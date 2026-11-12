import { supabase, isSupabaseConfigured } from './supabase'

export async function loginWithSupabase(email, password) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Check your .env file.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    throw error
  }

  const user = data.user
  let role = 'admin'
  let fullName = user.user_metadata?.full_name || 'Emmy-T Director'

  // Fetch verified profile from profiles table
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role, is_active')
      .eq('id', user.id)
      .single()

    if (profile) {
      if (!profile.is_active) {
        await supabase.auth.signOut()
        throw new Error('This administrator account has been deactivated.')
      }
      role = profile.role || role
      fullName = profile.full_name || fullName
    }
  } catch (err) {
    // If profile fetch encounters error, fallback to user metadata
    console.warn('Profile fetch note:', err.message)
  }

  return {
    isAuthenticated: true,
    id: user.id,
    email: user.email,
    name: fullName,
    role,
  }
}

export async function logoutSupabase() {
  if (!isSupabaseConfigured()) return
  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.warn('Supabase logout error:', err.message)
  }
}

export async function getSupabaseSessionUser() {
  if (!isSupabaseConfigured()) return null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const user = session.user
    let role = user.user_metadata?.role || 'admin'
    let fullName = user.user_metadata?.full_name || 'Emmy-T Director'

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role, is_active')
      .eq('id', user.id)
      .single()

    if (profile) {
      if (!profile.is_active) return null
      role = profile.role || role
      fullName = profile.full_name || fullName
    }

    return {
      isAuthenticated: true,
      id: user.id,
      email: user.email,
      name: fullName,
      role,
    }
  } catch (err) {
    console.warn('getSupabaseSessionUser error:', err.message)
    return null
  }
}

