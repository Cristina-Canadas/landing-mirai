'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { icons, type LucideIcon, Pipette } from 'lucide-react'

import { MiraiListBreadcrumbs } from './MiraiListBreadcrumbs'
import { CATEGORY_ICON_OPTIONS } from './categoryIconOptions'

const TOOLS_LIST_PATH = '/collections/tools'

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

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
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

  return { h, s: max === 0 ? 0 : diff / max, v: max }
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

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

function isToolsListPath(pathname: string): boolean {
  return pathname.includes(TOOLS_LIST_PATH)
}

export function ToolsListHeader() {
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isToolsList, setIsToolsList] = useState(false)
  const [pageControlsTarget, setPageControlsTarget] = useState<HTMLElement | null>(null)
  const [searchBarActionsTarget, setSearchBarActionsTarget] = useState<HTMLElement | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [catColor, setCatColor] = useState('#3b82f6')
  const [catIcon, setCatIcon] = useState('Wrench')
  const [catSaving, setCatSaving] = useState(false)
  const [catError, setCatError] = useState<string | null>(null)
  const [catSuccess, setCatSuccess] = useState(false)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const iconPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsToolsList(isToolsListPath(window.location.pathname))
  }, [])

  useEffect(() => {
    if (!isToolsList) return

    const resolveTargets = () => {
      const pageControls = document.querySelector<HTMLElement>('.collection-list .page-controls')
      setPageControlsTarget(pageControls)

      const searchBarActions = document.querySelector<HTMLElement>('.search-bar__actions')
      setSearchBarActionsTarget(searchBarActions)
    }

    resolveTargets()

    const observer = new MutationObserver(resolveTargets)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      setPageControlsTarget(null)
      setSearchBarActionsTarget(null)
    }
  }, [isToolsList])

  // Focus name input when modal opens
  useEffect(() => {
    if (showModal) {
      setTimeout(() => nameInputRef.current?.focus(), 50)
    }
  }, [showModal])

  useEffect(() => {
    if (!showModal) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!colorPickerRef.current?.contains(target)) setIsColorPickerOpen(false)
      if (!iconPickerRef.current?.contains(target)) setIsIconPickerOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [showModal])

  const openModal = () => {
    setCatName('')
    setCatSlug('')
    setCatColor('#3b82f6')
    setCatIcon('Wrench')
    setCatError(null)
    setCatSuccess(false)
    setIsColorPickerOpen(false)
    setIsIconPickerOpen(false)
    setShowModal(true)
  }

  const closeModal = () => {
    setIsColorPickerOpen(false)
    setIsIconPickerOpen(false)
    setShowModal(false)
  }

  const handleNameChange = (value: string) => {
    setCatName(value)
    setCatSlug(slugify(value))
  }

  const handleCreateCategory = async () => {
    if (!catName.trim()) {
      setCatError('Name is required.')
      return
    }
    if (!catSlug.trim()) {
      setCatError('Slug is required.')
      return
    }

    setCatSaving(true)
    setCatError(null)

    try {
      const res = await fetch('/api/categories?locale=es', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: catName.trim(),
          slug: catSlug.trim(),
          color: catColor,
          icon: catIcon,
        }),
      })

      const data = (await res.json()) as { errors?: { message: string }[]; message?: string }

      if (!res.ok) {
        const msg = data?.errors?.[0]?.message ?? data?.message ?? 'Error creating category'
        throw new Error(msg)
      }

      setCatSuccess(true)
      setTimeout(() => {
        setShowModal(false)
      }, 1200)
    } catch (err) {
      setCatError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setCatSaving(false)
    }
  }

  const handleSaveOrder = async () => {
    setIsSaving(true)
    setStatusMessage(null)

    try {
      const response = await fetch('/api/tools/sync-order', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const payload = (await response.json()) as { message?: string; error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? payload.message ?? 'No se pudo guardar el orden')
      }

      setStatusMessage(payload.message ?? 'Order saved successfully')
      window.location.reload()
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Could not save order')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isToolsList) {
    return <MiraiListBreadcrumbs />
  }

  const colorRgb = hexToRgb(catColor)
  const colorHsv = rgbToHsv(colorRgb)
  const colorHsl = rgbToHsl(colorRgb)
  const hueColor = rgbToHexValue(hsvToRgb({ h: colorHsv.h, s: 1, v: 1 }))
  const CurrentCategoryIcon = (icons as Record<string, LucideIcon>)[catIcon] ?? icons.Wrench

  const updateColorFromSaturation = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const s = clamp((event.clientX - rect.left) / rect.width)
    const v = 1 - clamp((event.clientY - rect.top) / rect.height)
    setCatColor(rgbToHexValue(hsvToRgb({ h: colorHsv.h, s, v })))
  }

  const updateColorFromHue = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const h = clamp((event.clientX - rect.left) / rect.width) * 360
    setCatColor(rgbToHexValue(hsvToRgb({ h, s: colorHsv.s, v: colorHsv.v })))
  }

  return (
    <>
      <MiraiListBreadcrumbs />

      {/* Inject "Nueva categoría" button before Columns/Filters */}
      {searchBarActionsTarget &&
        createPortal(
          <button
            type="button"
            className="pill"
            onClick={openModal}
            style={{
              order: -1,
              minHeight: '38px',
              padding: '0.45rem 0.9rem',
              borderRadius: '0.6rem',
              border: '1px solid #cfd6df',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
            New category
          </button>,
          searchBarActionsTarget,
        )}

      {/* Inject "Guardar" order button */}
      {pageControlsTarget &&
        createPortal(
          <button
            type="button"
            className="btn btn--style-primary"
            onClick={handleSaveOrder}
            disabled={isSaving}
            style={{
              height: '40px',
              width: '86px',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingInline: '0.65rem',
            }}
          >
            <span className="btn__content">{isSaving ? 'Saving...' : 'Save order'}</span>
          </button>,
          pageControlsTarget,
        )}

      {statusMessage && <p className="mirai-list-toolbar__status">{statusMessage}</p>}

      {/* Modal */}
      {showModal &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="New category"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15,23,42,0.45)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                boxShadow: '0 16px 48px rgba(15,23,42,0.18)',
                padding: '2rem',
                width: '100%',
                maxWidth: '440px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                transform: isColorPickerOpen || isIconPickerOpen ? 'translateX(-120px)' : 'translateX(0)',
                transition: 'transform 0.18s ease',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: '#0f172a' }}>
                  New category
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  style={{
                    border: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontSize: '1.4rem',
                    lineHeight: 1,
                    padding: '0.2rem',
                  }}
                >
                  ×
                </button>
              </div>

              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1f2937' }}>
                  Name <span style={{ color: '#d72833' }}>*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={catName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Marketing & Analytics"
                  style={{
                    padding: '0.65rem 0.9rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cfd6df',
                    background: '#f3f5f7',
                    fontSize: '1rem',
                    color: '#111827',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Slug */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1f2937' }}>
                  Slug <span style={{ color: '#d72833' }}>*</span>
                </label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="marketing_analytics"
                  style={{
                    padding: '0.65rem 0.9rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cfd6df',
                    background: '#f3f5f7',
                    fontSize: '0.95rem',
                    fontFamily: 'monospace',
                    color: '#374151',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280' }}>
                  Unique identifier. Auto-generated from the name.
                </p>
              </div>

              {/* Color */}
              <div ref={colorPickerRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1f2937' }}>Color</label>
                <button
                  type="button"
                  aria-expanded={isColorPickerOpen}
                  aria-haspopup="dialog"
                  onClick={() => setIsColorPickerOpen((open) => !open)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '48px',
                    padding: '0 0.78rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cfd6df',
                    background: '#f3f5f7',
                    color: '#111827',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: '1.35rem',
                        height: '1.35rem',
                        borderRadius: '0.4rem',
                        background: catColor,
                        boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.16), 0 1px 2px rgba(15,23,42,0.12)',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.88rem',
                        color: '#111827',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {catColor.toUpperCase()}
                    </span>
                  </span>
                  <span aria-hidden="true" style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1 }}>
                    {isColorPickerOpen ? '^' : 'v'}
                  </span>
                </button>

                {isColorPickerOpen && (
                  <div
                    role="dialog"
                    aria-label="Color picker"
                    style={{
                      position: 'absolute',
                      zIndex: 10000,
                      left: 'calc(100% + 0.85rem)',
                      top: '-1.6rem',
                      width: '360px',
                      maxWidth: 'calc(100vw - 2rem)',
                      maxHeight: 'calc(100vh - 5rem)',
                      overflowY: 'auto',
                      padding: '0.8rem',
                      background: '#ffffff',
                      border: '1px solid #cfd6df',
                      borderRadius: '0.72rem',
                      boxShadow: '0 22px 55px rgba(15,23,42,0.14)',
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
                      aria-valuenow={Math.round(colorHsv.h)}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId)
                        updateColorFromHue(event)
                      }}
                      onPointerMove={(event) => {
                        if (event.buttons === 1) updateColorFromHue(event)
                      }}
                      style={{
                        position: 'relative',
                        height: '36px',
                        borderRadius: '0.45rem',
                        background: HUE_GRADIENT,
                        border: '1px solid rgba(15,23,42,0.16)',
                        cursor: 'crosshair',
                        marginBottom: '0.58rem',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: `${(colorHsv.h / 360) * 100}%`,
                          top: '50%',
                          width: '20px',
                          height: '20px',
                          borderRadius: '999px',
                          border: '3px solid #ffffff',
                          boxShadow: '0 2px 8px rgba(15,23,42,0.35)',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    </div>

                    <div
                      role="slider"
                      aria-label="Saturation and brightness"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(colorHsv.s * 100)}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId)
                        updateColorFromSaturation(event)
                      }}
                      onPointerMove={(event) => {
                        if (event.buttons === 1) updateColorFromSaturation(event)
                      }}
                      style={{
                        position: 'relative',
                        height: '84px',
                        borderRadius: '0.45rem',
                        background: `linear-gradient(0deg, #000000, transparent), linear-gradient(90deg, #ffffff, ${hueColor})`,
                        border: '1px solid rgba(15,23,42,0.16)',
                        cursor: 'crosshair',
                        marginBottom: '0.6rem',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: `${colorHsv.s * 100}%`,
                          top: `${(1 - colorHsv.v) * 100}%`,
                          width: '18px',
                          height: '18px',
                          borderRadius: '999px',
                          border: '3px solid #ffffff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.45)',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '38px',
                        borderRadius: '0.45rem',
                        background: catColor,
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                        marginBottom: '0.58rem',
                      }}
                    >
                      {catColor.toUpperCase()}
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
                        <span style={{ fontFamily: 'monospace' }}>{catColor.toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <strong>RGB:</strong>
                        <span>{colorRgb.r}, {colorRgb.g}, {colorRgb.b}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <strong>HSL:</strong>
                        <span>{colorHsl.h}deg, {colorHsl.s}%, {colorHsl.l}%</span>
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
                        value={catColor}
                        onChange={(event) => setCatColor(event.target.value)}
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
                  </div>
                )}
              </div>

              {/* Icon */}
              <div ref={iconPickerRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1f2937' }}>Icon</label>
                <button
                  type="button"
                  aria-expanded={isIconPickerOpen}
                  aria-haspopup="listbox"
                  onClick={() => setIsIconPickerOpen((open) => !open)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '48px',
                    padding: '0 0.78rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cfd6df',
                    background: '#f3f5f7',
                    color: '#111827',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.55rem',
                        height: '1.55rem',
                        borderRadius: '0.42rem',
                        background: '#ffffff',
                        color: '#d72833',
                        boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.08)',
                      }}
                    >
                      <CurrentCategoryIcon size={15} strokeWidth={1.9} />
                    </span>
                    <span style={{ fontSize: '0.9rem' }}>{catIcon}</span>
                  </span>
                  <span aria-hidden="true" style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1 }}>
                    {isIconPickerOpen ? '^' : 'v'}
                  </span>
                </button>

                {isIconPickerOpen && (
                  <div
                    role="listbox"
                    aria-label="Icon options"
                    style={{
                      position: 'absolute',
                      zIndex: 10000,
                      left: 'calc(100% + 0.85rem)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '300px',
                      maxWidth: 'calc(100vw - 2rem)',
                      height: 'min(250px, calc(100vh - 8rem))',
                      overflowY: 'scroll',
                      scrollbarGutter: 'stable',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: '0.35rem',
                      padding: '0.55rem',
                      background: '#ffffff',
                      border: '1px solid #cfd6df',
                      borderRadius: '0.68rem',
                      boxShadow: '0 18px 45px rgba(15,23,42,0.14)',
                    }}
                  >
                    {CATEGORY_ICON_OPTIONS.map((icon) => {
                      const Icon = (icons as Record<string, LucideIcon>)[icon] ?? icons.Wrench
                      const isSelected = catIcon === icon

                      return (
                        <button
                          key={icon}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setCatIcon(icon)
                            setIsIconPickerOpen(false)
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            padding: 0,
                            border: 0,
                            borderRadius: '0.62rem',
                            background: isSelected ? 'rgba(215,40,51,0.08)' : 'transparent',
                            color: isSelected ? '#b91c1c' : '#111827',
                            cursor: 'pointer',
                            boxShadow: isSelected ? 'inset 0 0 0 1px rgba(215,40,51,0.22)' : 'none',
                          }}
                          title={icon}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '1.45rem',
                              height: '1.45rem',
                              borderRadius: '0.4rem',
                              background: isSelected ? '#ffffff' : '#f3f5f7',
                              color: isSelected ? '#d72833' : '#64748b',
                            }}
                          >
                            <Icon size={14} strokeWidth={1.9} />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Error / Success */}
              {catError && (
                <p style={{ margin: 0, color: '#d72833', fontSize: '0.88rem', fontWeight: 600 }}>
                  {catError}
                </p>
              )}
              {catSuccess && (
                <p style={{ margin: 0, color: '#10b981', fontSize: '0.88rem', fontWeight: 600 }}>
                  ✓ Category created successfully
                </p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #d1d5db',
                    background: '#f8fafc',
                    color: '#374151',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={catSaving || catSuccess}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #d72833',
                    background: '#d72833',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: catSaving || catSuccess ? 'not-allowed' : 'pointer',
                    opacity: catSaving || catSuccess ? 0.75 : 1,
                  }}
                >
                  {catSaving ? 'Saving...' : 'Create category'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
