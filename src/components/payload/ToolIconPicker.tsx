'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useField } from '@payloadcms/ui'
import { icons, type LucideIcon } from 'lucide-react'

import { CATEGORY_ICON_OPTIONS } from './categoryIconOptions'

type PopoverPosition = {
  top: number
  left: number
  width: number
  maxHeight: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function ToolIconPicker() {
  const { value, setValue, showError, errorMessage } = useField<string>({})
  const [isOpen, setIsOpen] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const current = typeof value === 'string' && value ? value : 'Wrench'
  const CurrentIcon = (icons as Record<string, LucideIcon>)[current] ?? icons.Wrench

  const updatePopoverPosition = useCallback(() => {
    const button = buttonRef.current
    if (!button || typeof window === 'undefined') return

    const rect = button.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const margin = 12
    const gap = 8
    const viewportSafeWidth = Math.max(240, viewportWidth - margin * 2)
    const viewportSafeHeight = Math.max(140, viewportHeight - margin * 2)
    const minHeight = Math.min(180, viewportSafeHeight)
    const preferredMaxHeight = 320
    const width = Math.min(Math.max(rect.width, 360), 520, viewportSafeWidth)
    const left = clamp(rect.left, margin, Math.max(margin, viewportWidth - width - margin))
    const belowSpace = viewportHeight - rect.bottom - gap - margin
    const aboveSpace = rect.top - gap - margin
    const placeBelow = belowSpace >= minHeight || belowSpace >= aboveSpace
    const availableHeight = placeBelow ? belowSpace : aboveSpace
    const maxHeight = Math.max(minHeight, Math.min(preferredMaxHeight, availableHeight, viewportSafeHeight))
    const preferredTop = placeBelow ? rect.bottom + gap : rect.top - gap - maxHeight
    const top = clamp(preferredTop, margin, Math.max(margin, viewportHeight - maxHeight - margin))

    setPopoverPosition({ top, left, width, maxHeight })
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      const isInsideField = rootRef.current?.contains(target)
      const isInsidePopover = popoverRef.current?.contains(target)

      if (!isInsideField && !isInsidePopover) setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    updatePopoverPosition()
    window.addEventListener('resize', updatePopoverPosition)
    window.addEventListener('scroll', updatePopoverPosition, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', updatePopoverPosition)
      window.removeEventListener('scroll', updatePopoverPosition, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, updatePopoverPosition])

  return (
    <div ref={rootRef} className="field-type select" style={{ marginBottom: '1.8rem' }}>
      <div className="field-label-wrap">
        <label className="field-label">
          Icon
          <span style={{ color: '#d72833', marginLeft: '0.25rem' }}>*</span>
        </label>
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
            return
          }

          updatePopoverPosition()
          setIsOpen(true)
        }}
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

      {isOpen && popoverPosition && createPortal(
        <div
          ref={popoverRef}
          role="listbox"
          aria-label="Icon options"
          style={{
            position: 'fixed',
            zIndex: 45,
            left: `${popoverPosition.left}px`,
            top: `${popoverPosition.top}px`,
            width: `${popoverPosition.width}px`,
            maxHeight: `${popoverPosition.maxHeight}px`,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(42px, 1fr))',
            gap: '0.35rem',
            padding: '0.6rem',
            background: '#ffffff',
            border: '1px solid rgba(148, 163, 184, 0.38)',
            borderRadius: '0.7rem',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16), 0 1px 2px rgba(15, 23, 42, 0.08)',
            scrollbarGutter: 'stable',
            overscrollBehavior: 'contain',
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
                aria-label={iconName}
                aria-selected={isSelected}
                title={iconName}
                onClick={() => {
                  setValue(iconName)
                  setIsOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  padding: 0,
                  border: 0,
                  borderRadius: '0.62rem',
                  background: isSelected ? 'rgba(215, 40, 51, 0.08)' : 'transparent',
                  color: isSelected ? '#b91c1c' : '#111827',
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'inset 0 0 0 1px rgba(215, 40, 51, 0.22)' : 'none',
                }}
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
      )}

      {showError && errorMessage && (
        <p style={{ color: '#d72833', fontSize: '0.84rem', marginTop: '0.4rem' }}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
