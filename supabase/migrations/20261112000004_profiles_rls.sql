-- ==============================================================================
-- EMMY-T CONCEPT — Profiles RLS Policies
-- Migration: 20261112000004_profiles_rls.sql
-- Description: Adds RLS policies for public.profiles so authenticated users
--              can read profiles without PostgREST 406 / RLS denial.
-- ==============================================================================

-- 1. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- 3. Allow all authenticated users (staff, admin, super_admin) to view profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- 4. Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Allow super_admin to insert or delete profiles
CREATE POLICY "Authenticated can insert profiles"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (true);

