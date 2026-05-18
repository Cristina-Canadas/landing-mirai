'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { MiraiDocHeader } from './MiraiDocHeader'

const DOC_CONTROLS_SELECTOR = '.header--doc .doc-controls'
const SAVE_BUTTON_SELECTOR = '#action-save, button[type="submit"]'

type ViewMode = 'create' | 'edit' | null

function getViewMode(pathname: string): ViewMode {
  if (/\/collections\/users\/create/.test(pathname)) return 'create'
  if (/\/collections\/users\/\d+/.test(pathname)) return 'edit'
  return null
}

export function MiraiUserCreateHeader() {
  const pathname = usePathname() ?? ''
  const mode = getViewMode(pathname)

  const actionsSlotRef = useRef<HTMLDivElement | null>(null)
  const movedNodeRef = useRef<HTMLElement | null>(null)
  const originalParentRef = useRef<HTMLElement | null>(null)
  const originalNextSiblingRef = useRef<Node | null>(null)
  const sourceControlsRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!mode) return

    const bodyClass = mode === 'create' ? 'mirai-users-create' : 'mirai-users-edit'
    document.body.classList.add(bodyClass)

    const relocateSave = () => {
      const slot = actionsSlotRef.current
      if (!slot) return
      const sourceControls = document.querySelector<HTMLElement>(DOC_CONTROLS_SELECTOR)
      if (!sourceControls) return
      const saveButton = sourceControls.querySelector<HTMLElement>(SAVE_BUTTON_SELECTOR)
      if (!saveButton) return
      const movable = (saveButton.closest('.form-submit') as HTMLElement | null) ?? saveButton
      if (slot.contains(movable)) return

      if (!movedNodeRef.current) {
        originalParentRef.current = movable.parentElement
        originalNextSiblingRef.current = movable.nextSibling
      }

      slot.appendChild(movable)
      sourceControls.classList.add('mirai-doc-controls--relocated')
      movedNodeRef.current = movable
      sourceControlsRef.current = sourceControls
    }

    relocateSave()
    const observer = new MutationObserver(relocateSave)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      document.body.classList.remove(bodyClass)
      sourceControlsRef.current?.classList.remove('mirai-doc-controls--relocated')

      if (movedNodeRef.current && originalParentRef.current) {
        if (originalNextSiblingRef.current) {
          originalParentRef.current.insertBefore(movedNodeRef.current, originalNextSiblingRef.current)
        } else {
          originalParentRef.current.appendChild(movedNodeRef.current)
        }
      }

      movedNodeRef.current = null
      originalParentRef.current = null
      originalNextSiblingRef.current = null
      sourceControlsRef.current = null
    }
  }, [mode])

  if (!mode) return null

  const isEdit = mode === 'edit'
  const pageLabel = isEdit ? 'Edit user' : 'Create new user'

  return (
    <MiraiDocHeader
      title={pageLabel}
      breadcrumbs={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Users', href: '/admin/collections/users' },
        { label: pageLabel },
      ]}
      actionsSlotRef={actionsSlotRef}
    />
  )
}
