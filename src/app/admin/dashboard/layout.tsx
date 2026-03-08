'use client'

import React from 'react'

// Dashboard layout only wraps content; sidebar comes from admin/layout.tsx
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
