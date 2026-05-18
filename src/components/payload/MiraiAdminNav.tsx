'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Bot,
  Braces,
  Coffee,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Tag,
  Users,
  Wrench,
} from 'lucide-react'
import { Header } from '@/components/Header'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/collections/tools', label: 'Tools', icon: Wrench, exact: false },
  { href: '/admin/collections/categories', label: 'Categories', icon: Tag, exact: false },
  { href: '/admin/collections/users', label: 'Users', icon: Users, exact: false },
  { href: '/admin/collections/media', label: 'Media', icon: ImageIcon, exact: false },
] as const

export function MiraiAdminNav() {
  const pathname = usePathname()
  const toolDocumentPath = pathname?.match(/^\/admin\/collections\/tools\/(?!create(?:\/|$))([^/]+)(?:\/api)?/)
  const apiHref = toolDocumentPath ? `/admin/collections/tools/${toolDocumentPath[1]}/api` : '/admin/api-docs'

  return (
    <>
      <Header
        showSearch={false}
        logoHref="/"
        avatarHref="/admin/account"
        avatarAriaLabel="Go to my account"
        showLogoutIcon
        logoutHref="/admin/logout"
        logoutAriaLabel="Log out"
      />
    <nav className="mirai-sidebar" aria-label="Admin navigation">
      <div className="mirai-sidebar__section" aria-hidden="true">
        <span className="mirai-sidebar__section-label">Menu</span>
      </div>

      <ul className="mirai-sidebar__list" role="list">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : !!pathname?.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                className={`mirai-sidebar__item${isActive ? ' mirai-sidebar__item--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={21} strokeWidth={1.65} aria-hidden="true" className="mirai-sidebar__icon" />
                <span className="mirai-sidebar__label">{label}</span>
              </Link>
            </li>
          )
        })}
        <li>
          <Link
            href={apiHref}
            className={`mirai-sidebar__item${pathname === apiHref ? ' mirai-sidebar__item--active' : ''}`}
            aria-current={pathname === apiHref ? 'page' : undefined}
          >
            <Braces size={21} strokeWidth={1.65} aria-hidden="true" className="mirai-sidebar__icon" />
            <span className="mirai-sidebar__label">API</span>
          </Link>
        </li>
      </ul>

      <div className="mirai-sidebar__footer">
        <a
          href="/admin/logout"
          className="mirai-sidebar__item mirai-sidebar__item--logout"
        >
          <LogOut size={21} strokeWidth={1.65} aria-hidden="true" className="mirai-sidebar__icon" />
          <span className="mirai-sidebar__label">Log out</span>
        </a>

        <p className="mirai-sidebar__tagline">
          Made with{' '}
          <Heart size={11} strokeWidth={0} fill="#d72833" aria-hidden="true" className="mirai-sidebar__tagline-icon" />
          {' '}love,{' '}
          <Coffee size={11} strokeWidth={1.6} aria-hidden="true" className="mirai-sidebar__tagline-icon" />
          {' '}caffeine{' '}
          and{' '}
          <Bot size={11} strokeWidth={1.6} aria-hidden="true" className="mirai-sidebar__tagline-icon" />
          {' '}AI, by the fabulous{' '}
          <a
            href="https://www.mirai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mirai-sidebar__tagline-link"
          >
            Mirai
          </a>
          {' '}team
        </p>
      </div>
    </nav>
    </>
  )
}
