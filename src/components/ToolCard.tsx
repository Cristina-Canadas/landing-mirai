'use client'

import { icons, type LucideIcon } from 'lucide-react'
import { Star } from 'lucide-react'

interface ToolCardProps {
  id: string
  name: string
  description: string
  url: string
  category: string
  status: 'active' | 'coming_soon' | 'deprecated'
  icon: string
  categoryLabel: string
  categoryPalette?: { base: string; bg: string }
  comingSoonLabel: string
  deprecatedLabel: string
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onToolClick?: (id: string) => void
}

const DEFAULT_PALETTE = { base: '#c71827', bg: 'rgba(199,24,39,0.12)' }

export function ToolCard({
  id,
  name,
  description,
  url,
  category,
  status,
  icon,
  categoryLabel,
  categoryPalette,
  comingSoonLabel,
  deprecatedLabel,
  isFavorite,
  onToggleFavorite,
  onToolClick,
}: ToolCardProps) {
  const Icon = (icons as Record<string, LucideIcon>)[icon] ?? icons.Wrench
  const isComingSoon = status === 'coming_soon' || url === '#'
  const isDeprecated = status === 'deprecated'
  const href = isComingSoon ? undefined : url
  const catPalette = categoryPalette ?? DEFAULT_PALETTE

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite(id)
  }

  const handleCardClick = () => {
    if (!isComingSoon) onToolClick?.(id)
  }

  const cardClass = ['tool-card', 'glass', isDeprecated ? 'tool-card--deprecated' : '']
    .filter(Boolean)
    .join(' ')

  const cardContent = (
    <>
      <div className="card-header">
        <div className="icon-wrapper" style={{ background: catPalette.bg, color: catPalette.base }}>
          <Icon size={22} />
        </div>

        <div className="card-header-right">
          {isDeprecated && (
            <span className="status-badge status-badge--deprecated">{deprecatedLabel}</span>
          )}
          {isComingSoon && !isDeprecated && (
            <span className="status-badge status-badge--coming-soon">{comingSoonLabel}</span>
          )}
          <button
            className={`star-btn${isFavorite ? ' star-btn--active' : ''}`}
            onClick={handleStarClick}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            aria-pressed={isFavorite}
          >
            <Star size={15} />
          </button>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-description">{description}</p>
      </div>

      <div className="card-footer">
        <span className="category-tag" style={{ color: catPalette.base, background: catPalette.bg }}>
          {categoryLabel}
        </span>
      </div>
    </>
  )

  if (isComingSoon) {
    return (
      <div className={cardClass} data-category={category}>
        {cardContent}
      </div>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
      data-category={category}
      onClick={handleCardClick}
    >
      {cardContent}
    </a>
  )
}
