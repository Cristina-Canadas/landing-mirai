'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutDashboard,
  Puzzle,
  Layout,
  FileText,
  Search,
  Star,
  X,
  Menu,
} from 'lucide-react'
import heart from '@/assets/heart-mirai.png'
import logo from '@/assets/logo-mirai-go-sin-fondo.webp'
import type { CategoryFilterKey } from '@/i18n/translations'

export type SidebarFilterKey = CategoryFilterKey | 'favorites'

interface SidebarProps {
  activeCategory: SidebarFilterKey
  onCategoryChange: (cat: SidebarFilterKey) => void
  favoriteCount: number
  categoryTranslations: Record<string, string>
  uiTranslations: {
    dashboard: string
    categories: string
    favorites: string
  }
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  integration_core: <Puzzle size={16} />,
  layout_css: <Layout size={16} />,
  content_elementor: <FileText size={16} />,
  seo_audit: <Search size={16} />,
}

const CATEGORY_COLORS: Record<string, string> = {
  integration_core: 'var(--cat-integration)',
  layout_css: 'var(--cat-layout)',
  content_elementor: 'var(--cat-content)',
  seo_audit: 'var(--cat-seo)',
}

export function Sidebar({
  activeCategory,
  onCategoryChange,
  favoriteCount,
  categoryTranslations,
  uiTranslations,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (cat: SidebarFilterKey) => {
    onCategoryChange(cat)
    setMobileOpen(false)
  }

  const sidebarContent = (
    <div className="sidebar-inner">
      {/* Logo */}
      <Link href="/" className="sidebar-logo" aria-label="Inicio Mirai Suite">
        <Image src={heart} alt="" height={36} className="sidebar-heart" priority />
        <Image src={logo} alt="Mirai Suite" height={22} className="sidebar-brand" priority />
      </Link>

      <nav className="sidebar-nav">
        {/* Dashboard */}
        <div className="sidebar-section">
          <button
            className={`sidebar-item${activeCategory === 'all' ? ' sidebar-item--active' : ''}`}
            onClick={() => handleNav('all')}
          >
            <span className="sidebar-item-icon sidebar-item-icon--dashboard">
              <LayoutDashboard size={16} />
            </span>
            <span className="sidebar-item-label">{uiTranslations.dashboard}</span>
          </button>
        </div>

        {/* Categories */}
        <div className="sidebar-section">
          <p className="sidebar-section-title">{uiTranslations.categories}</p>
          {(['integration_core', 'layout_css', 'content_elementor', 'seo_audit'] as const).map(
            (cat) => (
              <button
                key={cat}
                className={`sidebar-item${activeCategory === cat ? ' sidebar-item--active' : ''}`}
                onClick={() => handleNav(cat)}
              >
                <span
                  className="sidebar-item-icon"
                  style={{ color: CATEGORY_COLORS[cat], background: `${CATEGORY_COLORS[cat]}1a` }}
                >
                  {CATEGORY_ICONS[cat]}
                </span>
                <span className="sidebar-item-label">
                  {categoryTranslations[cat] ?? cat}
                </span>
              </button>
            ),
          )}
        </div>

        {/* Favorites */}
        <div className="sidebar-section">
          <button
            className={`sidebar-item${activeCategory === 'favorites' ? ' sidebar-item--active' : ''}`}
            onClick={() => handleNav('favorites')}
          >
            <span className="sidebar-item-icon sidebar-item-icon--favorites">
              <Star size={16} />
            </span>
            <span className="sidebar-item-label">{uiTranslations.favorites}</span>
            {favoriteCount > 0 && (
              <span className="sidebar-badge">{favoriteCount}</span>
            )}
          </button>
        </div>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="sidebar">{sidebarContent}</aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}>
          <aside className="sidebar sidebar--mobile" onClick={(e) => e.stopPropagation()}>
            <button
              className="sidebar-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
