'use client'

import { useEffect, useRef, useState } from 'react'
import { LogOut, Search, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/logo-mirai-go-sin-fondo.webp'
import heart from '@/assets/heart-mirai.png'

interface HeaderProps {
  searchQuery?: string
  onSearchChange?: (q: string) => void
  searchPlaceholder?: string
  showSearch?: boolean
  logoHref?: string
  avatarHref?: string
  avatarAriaLabel?: string
  showLogoutIcon?: boolean
  logoutHref?: string
  logoutAriaLabel?: string
}

export function Header({
  searchQuery = '',
  onSearchChange = () => {},
  searchPlaceholder = 'Search tools...',
  showSearch = true,
  logoHref = '/',
  avatarHref = '/admin',
  avatarAriaLabel = 'Go to Payload dashboard',
  showLogoutIcon = false,
  logoutHref = '/admin/logout',
  logoutAriaLabel = 'Log out',
}: HeaderProps) {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!showSearch) return

    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showSearch])

  const [isMac, setIsMac] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`topbar${scrolled ? ' topbar--scrolled' : ''}`}>
      <Link href={logoHref} className="topbar-logo" aria-label="Mirai Suite">
        <Image src={heart} alt="" height={56} className="topbar-heart" priority />
        <Image src={logo} alt="Mirai" height={15} className="topbar-brand" priority />
      </Link>

      {showSearch && (
        <div className="topbar-search-wrapper">
          <Search size={15} className="topbar-search-icon" aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            className="topbar-search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={searchPlaceholder}
          />
          <span className="topbar-search-hint" aria-hidden="true">
            {isMac ? 'Cmd+K' : 'Ctrl+K'}
          </span>
        </div>
      )}

      <div className="topbar-actions">
        <Link href={avatarHref} className="topbar-avatar" aria-label={avatarAriaLabel}>
          <User size={16} />
        </Link>

        {showLogoutIcon && (
          <Link href={logoutHref} className="topbar-avatar topbar-logout" aria-label={logoutAriaLabel}>
            <LogOut size={16} />
          </Link>
        )}
      </div>
    </header>
  )
}
