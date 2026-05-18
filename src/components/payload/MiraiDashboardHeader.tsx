'use client'

import { Header } from '@/components/Header'

export function MiraiDashboardHeader() {
  return (
    <Header
      showSearch={false}
      logoHref="/"
      avatarHref="/admin/account"
      avatarAriaLabel="Go to my account"
      showLogoutIcon
      logoutHref="/admin/logout"
      logoutAriaLabel="Log out"
    />
  )
}
