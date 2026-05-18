'use client'

import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useField } from '@payloadcms/ui'
import { icons, type LucideIcon } from 'lucide-react'
import { CATEGORY_ICON_OPTIONS } from './categoryIconOptions'

function getFloatingStyle(anchor: HTMLElement, maxWidth: number, maxHeight: number): CSSProperties {
  const rect = anchor.getBoundingClientRect()
  const viewportPadding = 12
  const width = Math.min(Math.max(rect.width, 320), maxWidth, window.innerWidth - viewportPadding * 2)
  const availableBelow = window.innerHeight - rect.bottom - viewportPadding
  const availableAbove = rect.top - viewportPadding
  const openAbove = availableBelow < maxHeight && availableAbove > availableBelow
  const height = Math.min(maxHeight, Math.max(180, openAbove ? availableAbove : availableBelow))
  const left = Math.min(
    Math.max(viewportPadding, rect.left),
    Math.max(viewportPadding, window.innerWidth - width - viewportPadding),
  )
  const top = openAbove ? rect.top - height - 8 : rect.bottom + 8

  return {
    left,
    top,
    width,
    maxHeight: height,
  }
}

export function CategoryIconSelect() {
  const { value, setValue, showError, errorMessage } = useField<string>({})
  const [isOpen, setIsOpen] = useState(false)
  const [floatingStyle, setFloatingStyle] = useState<CSSProperties | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const current = typeof value === 'string' && value ? value : 'Wrench'
  const CurrentIcon = (icons as Record<string, LucideIcon>)[current] ?? icons.Wrench

  const updateFloatingStyle = useCallback(() => {
    if (!rootRef.current) return
    setFloatingStyle(getFloatingStyle(rootRef.current, 360, 260))
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || popoverRef.current?.contains(target)) return
      setIsOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    updateFloatingStyle()
    window.addEventListener('resize', updateFloatingStyle)
    window.addEventListener('scroll', updateFloatingStyle, true)
    return () => {
      window.removeEventListener('resize', updateFloatingStyle)
      window.removeEventListener('scroll', updateFloatingStyle, true)
    }
  }, [isOpen, updateFloatingStyle])

  const iconOptions =
    isOpen && floatingStyle && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={popoverRef}
            role="listbox"
            aria-label="Icon options"
            style={{
              position: 'fixed',
              zIndex: 1000,
              left: floatingStyle.left,
              top: floatingStyle.top,
              width: floatingStyle.width,
              maxHeight: floatingStyle.maxHeight,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
              gap: '0.35rem',
              padding: '0.55rem',
              background: '#ffffff',
              border: '1px solid #cfd6df',
              borderRadius: '0.68rem',
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)',
              scrollbarGutter: 'stable',
            }}
          >
            {CATEGORY_ICON_OPTIONS.map((iconName) => {
              const Icon = (icons as Record<string, LucideIcon>)[iconName] ?? icons.Wrench
              const isSelected = current === iconName

              return (
                <button
                  key={iconName}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setValue(iconName)
                    setIsOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    aspectRatio: '1',
                    minHeight: '40px',
                    padding: 0,
                    border: 0,
                    borderRadius: '0.62rem',
                    background: isSelected ? 'rgba(215, 40, 51, 0.08)' : 'transparent',
                    color: isSelected ? '#b91c1c' : '#111827',
                    cursor: 'pointer',
                    boxShadow: isSelected ? 'inset 0 0 0 1px rgba(215, 40, 51, 0.22)' : 'none',
                  }}
                  title={iconName}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.55rem',
                      height: '1.55rem',
                      borderRadius: '0.42rem',
                      background: isSelected ? '#ffffff' : '#f3f5f7',
                      color: isSelected ? '#d72833' : '#64748b',
                    }}
                  >
                    <Icon size={15} strokeWidth={1.9} />
                  </span>
                </button>
              )
            })}
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className="field-type select" style={{ marginBottom: '1.8rem', position: 'relative' }}>
      <div className="field-label-wrap">
        <label className="field-label">Icon</label>
      </div>

      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((open) => !open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: '54px',
          padding: '0 0.78rem',
          background: '#f3f5f7',
          borderRadius: '0.68rem',
          border: showError ? '1px solid #d72833' : '1px solid #cfd6df',
          color: '#111827',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.65rem',
              height: '1.65rem',
              borderRadius: '0.45rem',
              background: '#ffffff',
              color: '#d72833',
              boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.08)',
            }}
          >
            <CurrentIcon size={16} strokeWidth={1.9} />
          </span>
          <span style={{ fontSize: '0.88rem' }}>{current}</span>
        </span>
        <span aria-hidden="true" style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1 }}>
          {isOpen ? '^' : 'v'}
        </span>
      </button>

      {iconOptions}

      {showError && errorMessage && (
        <p style={{ color: '#d72833', fontSize: '0.84rem', marginTop: '0.4rem' }}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
