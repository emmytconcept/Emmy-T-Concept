import React from 'react'

export function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.37C16.32 14.24 15.1 13.64 14.87 13.56C14.65 13.48 14.48 13.44 14.32 13.69C14.15 13.94 13.67 14.51 13.52 14.68C13.38 14.85 13.23 14.87 12.98 14.75C12.73 14.62 11.93 14.36 10.98 13.52C10.25 12.86 9.75 12.05 9.61 11.8C9.46 11.55 9.59 11.42 9.72 11.29C9.83 11.18 9.97 11 10.09 10.86C10.22 10.72 10.26 10.62 10.34 10.45C10.42 10.28 10.38 10.14 10.32 10.01C10.26 9.89 9.75 8.64 9.54 8.13C9.34 7.63 9.13 7.7 8.98 7.69C8.83 7.68 8.66 7.68 8.49 7.68C8.32 7.68 8.04 7.74 7.81 8C7.57 8.25 6.92 8.86 6.92 10.11C6.92 11.36 7.83 12.56 7.95 12.73C8.08 12.9 9.73 15.44 12.26 16.53C12.86 16.79 13.33 16.95 13.69 17.06C14.3 17.25 14.85 17.22 15.29 17.16C15.78 17.09 16.8 16.54 17.01 15.96C17.22 15.37 17.22 14.87 17.16 14.75C17.1 14.64 16.82 14.5 16.57 14.37Z" />
    </svg>
  )
}

export function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

export function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

export function TwitterIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
