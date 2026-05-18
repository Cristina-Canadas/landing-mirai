'use client'

import { useState, useEffect } from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { icons, type LucideIcon } from 'lucide-react'

const COLOR_HEX: Record<string, string> = {
  blue:   '#3b82f6',
  green:  '#10b981',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red:    '#ef4444',
  pink:   '#ec4899',
}

const COLOR_BG: Record<string, string> = {
  blue:   'rgba(59,130,246,0.12)',
  green:  'rgba(16,185,129,0.12)',
  purple: 'rgba(139,92,246,0.12)',
  orange: 'rgba(245,158,11,0.12)',
  red:    'rgba(239,68,68,0.12)',
  pink:   'rgba(236,72,153,0.12)',
}

// In-memory cache shared across all cell instances
const catCache: Record<number, string> = {}

function paletteFromKey(colorKey: string) {
  if (/^#[0-9a-f]{6}$/i.test(colorKey)) {
    return {
      color: colorKey,
      bg: `${colorKey}1f`,
    }
  }

  return {
    color: COLOR_HEX[colorKey] ?? '#334155',
    bg:    COLOR_BG[colorKey]  ?? 'rgba(51,65,85,0.08)',
  }
}

export function ToolIconCell({ cellData, rowData }: DefaultCellComponentProps) {
  const [palette, setPalette] = useState({ color: '#334155', bg: 'rgba(51,65,85,0.08)' })

  const category = rowData?.category

  useEffect(() => {
    if (!category) return

    // Already a populated object with color field
    if (typeof category === 'object' && category !== null && 'color' in category) {
      setPalette(paletteFromKey(String((category as { color: unknown }).color ?? '')))
      return
    }

    // Just an ID — fetch the category
    if (typeof category === 'number' || typeof category === 'string') {
      const id = Number(category)
      if (!id) return

      if (catCache[id]) {
        setPalette(paletteFromKey(catCache[id]))
        return
      }

      fetch(`/api/categories/${id}?depth=0`, { credentials: 'include' })
        .then((r) => r.json())
        .then((data: { color?: string }) => {
          const colorKey = String(data?.color ?? '')
          catCache[id] = colorKey
          setPalette(paletteFromKey(colorKey))
        })
        .catch(() => {})
    }
  }, [category])

  const iconName = String(cellData ?? '').trim() || 'Wrench'
  const Icon = (icons as Record<string, LucideIcon>)[iconName] ?? icons.Wrench

  return (
    <span
      className="mirai-tool-icon-cell"
      title={iconName}
      aria-label={iconName}
      role="img"
      style={{
        color: palette.color,
        background: palette.bg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        flexShrink: 0,
      }}
    >
      <Icon size={15} />
    </span>
  )
}
