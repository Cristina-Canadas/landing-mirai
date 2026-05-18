'use client'

import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useField } from '@payloadcms/ui'
import { Pipette } from 'lucide-react'

const LEGACY_COLORS: Record<string, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
}

const HUE_GRADIENT =
  'linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'

type RGB = {
  r: number
  g: number
  b: number
}

type HSV = {
  h: number
  s: number
  v: number
}

function getFloatingStyle(anchor: HTMLElement, maxWidth: number, maxHeight: number): CSSProperties {
  const rect = anchor.getBoundingClientRect()
  const viewportPadding = 12
  const width = Math.min(Math.max(rect.width, 320), maxWidth, window.innerWidth - viewportPadding * 2)
  const availableBelow = window.innerHeight - rect.bottom - viewportPadding
  const availableAbove = rect.top - viewportPadding
  const openAbove = availableBelow < maxHeight && availableAbove > availableBelow
  const height = Math.min(maxHeight, Math.max(260, openAbove ? availableAbove : availableBelow))
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

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function rgbToHex(value: string): string | null {
  const match = value.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i)
  if (!match) return null

  const channels = match.slice(1, 4).map((channel) => {
    const number = Math.max(0, Math.min(255, Number(channel)))
    return number.toString(16).padStart(2, '0')
  })

  return `#${channels.join('')}`
}

function toPickerValue(value: unknown): string {
  if (typeof value !== 'string') return '#3b82f6'

  const normalized = value.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/i.test(normalized)) return normalized
  if (LEGACY_COLORS[normalized]) return LEGACY_COLORS[normalized]

  return rgbToHex(normalized) ?? '#3b82f6'
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const int = parseInt(clean, 16)

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

function rgbToHexValue({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const diff = max - min
  let h = 0

  if (diff) {
    if (max === rn) h = ((gn - bn) / diff) % 6
    else if (max === gn) h = (bn - rn) / diff + 2
    else h = (rn - gn) / diff + 4
    h *= 60
    if (h < 0) h += 360
  }

  return {
    h,
    s: max === 0 ? 0 : diff / max,
    v: max,
  }
}

function hsvToRgb({ h, s, v }: HSV): RGB {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let rn = 0
  let gn = 0
  let bn = 0

  if (h < 60) [rn, gn, bn] = [c, x, 0]
  else if (h < 120) [rn, gn, bn] = [x, c, 0]
  else if (h < 180) [rn, gn, bn] = [0, c, x]
  else if (h < 240) [rn, gn, bn] = [0, x, c]
  else if (h < 300) [rn, gn, bn] = [x, 0, c]
  else [rn, gn, bn] = [c, 0, x]

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  }
}

function rgbToHsl({ r, g, b }: RGB) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const diff = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (diff) {
    s = diff / (1 - Math.abs(2 * l - 1))
    if (max === rn) h = ((gn - bn) / diff) % 6
    else if (max === gn) h = (bn - rn) / diff + 2
    else h = (rn - gn) / diff + 4
    h *= 60
    if (h < 0) h += 360
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function CategoryColorPicker() {
  const { value, setValue, showError, errorMessage } = useField<string>({})
  const [isOpen, setIsOpen] = useState(false)
  const [floatingStyle, setFloatingStyle] = useState<CSSProperties | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const current = toPickerValue(value)
  const rgb = useMemo(() => hexToRgb(current), [current])
  const hsv = useMemo(() => rgbToHsv(rgb), [rgb])
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb])
  const hueColor = rgbToHexValue(hsvToRgb({ h: hsv.h, s: 1, v: 1 }))

  const updateFloatingStyle = useCallback(() => {
    if (!rootRef.current) return
    setFloatingStyle(getFloatingStyle(rootRef.current, 390, 390))
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

  const updateFromSaturation = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const s = clamp((event.clientX - rect.left) / rect.width)
    const v = 1 - clamp((event.clientY - rect.top) / rect.height)
    setValue(rgbToHexValue(hsvToRgb({ h: hsv.h, s, v })))
  }

  const updateFromHue = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const h = clamp((event.clientX - rect.left) / rect.width) * 360
    setValue(rgbToHexValue(hsvToRgb({ h, s: hsv.s, v: hsv.v })))
  }

  const colorPicker =
    isOpen && floatingStyle && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Color picker"
            style={{
              position: 'fixed',
              zIndex: 1000,
              left: floatingStyle.left,
              top: floatingStyle.top,
              width: floatingStyle.width,
              maxHeight: floatingStyle.maxHeight,
              overflowY: 'auto',
              padding: '0.8rem',
              background: '#ffffff',
              border: '1px solid #cfd6df',
              borderRadius: '0.72rem',
              boxShadow: '0 22px 55px rgba(15, 23, 42, 0.14)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.72rem' }}>
              <Pipette size={16} color="#334155" />
              <span style={{ color: '#0f172a', fontSize: '0.86rem', fontWeight: 700 }}>Color Picker</span>
            </div>

            <div
              role="slider"
              aria-label="Hue"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={Math.round(hsv.h)}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId)
                updateFromHue(event)
              }}
              onPointerMove={(event) => {
                if (event.buttons === 1) updateFromHue(event)
              }}
              style={{
                position: 'relative',
                height: '40px',
                borderRadius: '0.45rem',
                background: HUE_GRADIENT,
                border: '1px solid rgba(255, 255, 255, 0.35)',
                cursor: 'crosshair',
                marginBottom: '0.58rem',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: `${(hsv.h / 360) * 100}%`,
                  top: '50%',
                  width: '21px',
                  height: '21px',
                  borderRadius: '999px',
                  border: '3px solid #ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>

            <div
              role="slider"
              aria-label="Saturation and brightness"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(hsv.s * 100)}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId)
                updateFromSaturation(event)
              }}
              onPointerMove={(event) => {
                if (event.buttons === 1) updateFromSaturation(event)
              }}
              style={{
                position: 'relative',
                height: '92px',
                borderRadius: '0.45rem',
                background: `linear-gradient(0deg, #000000, transparent), linear-gradient(90deg, #ffffff, ${hueColor})`,
                border: '1px solid rgba(255, 255, 255, 0.35)',
                cursor: 'crosshair',
                marginBottom: '0.6rem',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: `${hsv.s * 100}%`,
                  top: `${(1 - hsv.v) * 100}%`,
                  width: '18px',
                  height: '18px',
                  borderRadius: '999px',
                  border: '3px solid #ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '42px',
                borderRadius: '0.45rem',
                background: current,
                color: '#ffffff',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                marginBottom: '0.58rem',
              }}
            >
              {current.toUpperCase()}
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.42rem',
                padding: '0.68rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                color: '#334155',
                fontSize: '0.78rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>HEX:</strong>
                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                  {current.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>RGB:</strong>
                <span>{rgb.r}, {rgb.g}, {rgb.b}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>HSL:</strong>
                <span>{hsl.h}deg, {hsl.s}%, {hsl.l}%</span>
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.7rem',
                marginTop: '0.65rem',
                padding: '0.6rem 0.68rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                color: '#334155',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Native picker
              <input
                type="color"
                value={current}
                onChange={(event) => setValue(event.target.value)}
                style={{
                  width: '2rem',
                  height: '1.6rem',
                  border: 0,
                  padding: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              />
            </label>
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className="field-type text" style={{ marginBottom: '1.8rem', position: 'relative' }}>
      <div className="field-label-wrap">
        <label className="field-label">Color</label>
      </div>

      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
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
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            aria-hidden="true"
            style={{
              width: '1.45rem',
              height: '1.45rem',
              borderRadius: '0.42rem',
              background: current,
              boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.16), 0 1px 2px rgba(15, 23, 42, 0.12)',
            }}
          />
          <span
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.88rem',
              color: '#111827',
            }}
          >
            {current.toUpperCase()}
          </span>
        </span>
        <span aria-hidden="true" style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1 }}>
          {isOpen ? '^' : 'v'}
        </span>
      </button>

      {colorPicker}

      {showError && errorMessage && (
        <p style={{ color: '#d72833', fontSize: '0.84rem', marginTop: '0.4rem' }}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
