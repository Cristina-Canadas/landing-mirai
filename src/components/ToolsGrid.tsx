'use client'

import { useState, useEffect, useCallback } from 'react'
import { icons, type LucideIcon, Star, Flame } from 'lucide-react'
import { ToolCard } from './ToolCard'
import { Header } from './Header'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/logo-mirai-go-sin-fondo.webp'

const FAVORITES_KEY = 'mirai-favorites'
const USAGE_KEY    = 'mirai-usage'
const MOST_USED_MAX = 5

const COLOR_PALETTE: Record<string, { color: string; shadow: string; base: string; bg: string }> = {
  blue:   { color: '#3b82f6', shadow: 'rgba(59,130,246,0.25)',  base: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  green:  { color: '#10b981', shadow: 'rgba(16,185,129,0.25)',  base: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  purple: { color: '#8b5cf6', shadow: 'rgba(139,92,246,0.25)',  base: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  orange: { color: '#f59e0b', shadow: 'rgba(245,158,11,0.25)',  base: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  red:    { color: '#ef4444', shadow: 'rgba(239,68,68,0.25)',   base: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  pink:   { color: '#ec4899', shadow: 'rgba(236,72,153,0.25)', base: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
}

interface CategoryData {
  slug: string
  name: string
  color: string
  icon: string
}

interface Tool {
  id: string
  name: string
  description: string
  url: string
  category: string
  status: 'active' | 'coming_soon' | 'deprecated'
  icon: string
}

interface ToolsGridProps {
  tools: Tool[]
  categories: CategoryData[]
  allLabel: string
  uiTranslations: {
    openTool: string
    comingSoon: string
    deprecated: string
    favorites: string
    mostUsed: string
    noResults: string
    searchPlaceholder: string
    heroTitle: string
    heroSubtitle: string
    footerNote: string
  }
}

export function ToolsGrid({
  tools,
  categories,
  allLabel,
  uiTranslations,
}: ToolsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery]       = useState('')
  const [favoriteIds, setFavoriteIds]       = useState<string[]>([])
  const [usageMap, setUsageMap]             = useState<Record<string, number>>({})

  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(FAVORITES_KEY)
      if (savedFavs) setFavoriteIds(JSON.parse(savedFavs) as string[])
      const savedUsage = localStorage.getItem(USAGE_KEY)
      if (savedUsage) setUsageMap(JSON.parse(savedUsage) as Record<string, number>)
    } catch { /* ignore */ }
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const trackUsage = useCallback((id: string) => {
    setUsageMap((prev) => {
      const next = { ...prev, [id]: (prev[id] ?? 0) + 1 }
      localStorage.setItem(USAGE_KEY, JSON.stringify(next))
      return next
    })

    const payload = JSON.stringify({
      locale: 'en',
      path: window.location.pathname,
      toolId: id,
    })

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' })
        navigator.sendBeacon('/api/analytics/tool-click', blob)
        return
      }
    } catch {
      // Fall back to fetch below.
    }

    fetch('/api/analytics/tool-click', {
      method: 'POST',
      body: payload,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {
      // Analytics should never block navigation.
    })
  }, [])

  // Build lookup maps: slug → display name / color palette
  const categoryNameMap = Object.fromEntries(categories.map((c) => [c.slug, c.name]))
  const categoryPaletteMap = Object.fromEntries(
    categories.map((c) => {
      const p = COLOR_PALETTE[c.color]
      if (p) return [c.slug, { base: p.base, bg: p.bg }]
      const hex = /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : '#3b82f6'
      return [c.slug, { base: hex, bg: `${hex}1f` }]
    }),
  )

  const matchesSearch = useCallback(
    (tool: Tool) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        (categoryNameMap[tool.category] ?? tool.category).toLowerCase().includes(q)
      )
    },
    [searchQuery, categoryNameMap],
  )

  const filteredTools = tools
    .filter((t) => t.status !== 'deprecated')
    .filter((t) => activeCategory === 'all' || t.category === activeCategory)
    .filter(matchesSearch)

  const mostUsedTools = [...tools]
    .filter((t) => t.status !== 'deprecated')
    .filter((t) => (usageMap[t.id] ?? 0) > 0)
    .sort((a, b) => (usageMap[b.id] ?? 0) - (usageMap[a.id] ?? 0))
    .slice(0, MOST_USED_MAX)

  const favoriteTools = tools.filter((t) => t.status !== 'deprecated' && favoriteIds.includes(t.id))

  const showBottomSections = !searchQuery && activeCategory === 'all'
  const showFavoritesSection = showBottomSections && favoriteTools.length > 0

  return (
    <div className="page-wrapper">
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q)
          if (q) setActiveCategory('all')
        }}
        searchPlaceholder={uiTranslations.searchPlaceholder}
      />

      <main className="page-main container">
        {/* Hero */}
        <section className="hero-section">
          <h1 className="hero-title">
            <Image
              src={logo}
              alt="Mirai"
              height={52}
              quality={90}
              className="hero-logo"
              priority
            />
            <span>Suite</span>
          </h1>
          <p className="hero-subtitle">{uiTranslations.heroSubtitle}</p>
        </section>

        {/* Category filters */}
        <div className="filter-container">
          <div className="filter-list">
            {/* All button */}
            <button
              key="all"
              onClick={() => setActiveCategory('all')}
              className={`filter-btn${activeCategory === 'all' ? ' active' : ''}`}
            >
              <span className="filter-btn__icon" aria-hidden="true">
                {(() => {
                  const Icon = (icons as Record<string, LucideIcon>)['Wrench'] ?? icons.Wrench
                  return <Icon size={15} strokeWidth={2.2} />
                })()}
              </span>
              <span className="filter-btn__label">{allLabel}</span>
            </button>

            {/* Dynamic category buttons */}
            {categories.map((cat) => {
              const namedPalette = COLOR_PALETTE[cat.color]
              const hex = /^#[0-9a-f]{6}$/i.test(cat.color) ? cat.color : '#3b82f6'
              const catStyle = namedPalette ?? { color: hex, shadow: `${hex}40`, base: hex, bg: `${hex}1f` }
              const CategoryIcon = (icons as Record<string, LucideIcon>)[cat.icon] ?? icons.Wrench
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`filter-btn${activeCategory === cat.slug ? ' active' : ''}`}
                  style={{
                    '--btn-color': catStyle.color,
                    '--btn-shadow': catStyle.shadow,
                  } as React.CSSProperties}
                >
                  <span className="filter-btn__icon" aria-hidden="true">
                    <CategoryIcon size={15} strokeWidth={2.2} />
                  </span>
                  <span className="filter-btn__label">{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Favorites section */}
        {showFavoritesSection && (
          <section className="favorites-section">
            <h2 className="section-title">
              <Star size={16} style={{ color: '#eab308', fill: '#eab308' }} />
              {uiTranslations.favorites}
            </h2>
            <div className="tools-grid">
              {favoriteTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  {...tool}
                  categoryLabel={categoryNameMap[tool.category] ?? tool.category}
                  categoryPalette={categoryPaletteMap[tool.category]}
                  comingSoonLabel={uiTranslations.comingSoon}
                  deprecatedLabel={uiTranslations.deprecated}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onToolClick={trackUsage}
                />
              ))}
            </div>
          </section>
        )}

        {/* Main grid */}
        <div className="tools-grid">
          {filteredTools.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">{uiTranslations.noResults}</p>
            </div>
          ) : (
            filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                {...tool}
                categoryLabel={categoryNameMap[tool.category] ?? tool.category}
                categoryPalette={categoryPaletteMap[tool.category]}
                comingSoonLabel={uiTranslations.comingSoon}
                deprecatedLabel={uiTranslations.deprecated}
                isFavorite={favoriteIds.includes(tool.id)}
                onToggleFavorite={toggleFavorite}
                onToolClick={trackUsage}
              />
            ))
          )}
        </div>

        {/* Most used section */}
        {showBottomSections && mostUsedTools.length > 0 && (
          <section className="bottom-section">
            <h2 className="section-title">
              <Flame size={16} style={{ color: '#f59e0b' }} />
              {uiTranslations.mostUsed}
            </h2>
            <div className="tools-grid">
              {mostUsedTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  {...tool}
                  categoryLabel={categoryNameMap[tool.category] ?? tool.category}
                  categoryPalette={categoryPaletteMap[tool.category]}
                  comingSoonLabel={uiTranslations.comingSoon}
                  deprecatedLabel={uiTranslations.deprecated}
                  isFavorite={favoriteIds.includes(tool.id)}
                  onToggleFavorite={toggleFavorite}
                  onToolClick={trackUsage}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <Link href="/" aria-label="Mirai Suite">
            <Image src={logo} alt="Mirai" height={32} quality={90} className="footer-logo" />
          </Link>
          <p>
            2026 Built by the{' '}
            <a
              href="https://www.mirai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Mirai
            </a>{' '}
            Frontend team
          </p>
        </div>
      </footer>
    </div>
  )
}
