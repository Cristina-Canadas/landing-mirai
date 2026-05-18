'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MiraiDocHeader } from './MiraiDocHeader'

const NATIVE_SAVE_SELECTORS = [
  '.header--doc .form-submit',
  '.header--doc #action-save',
  '.header--doc button[type="submit"]',
].join(', ')

type ViewMode = 'create' | 'edit' | null

function getViewMode(pathname: string): ViewMode {
  if (/\/collections\/media\/create/.test(pathname)) return 'create'
  if (/\/collections\/media\/\d+/.test(pathname)) return 'edit'
  return null
}

export function MiraiMediaCreateHeader() {
  const pathname = usePathname() ?? ''
  const mode = getViewMode(pathname)

  useEffect(() => {
    if (!mode) return

    const bodyClass = mode === 'create' ? 'mirai-media-create' : 'mirai-media-edit'
    document.body.classList.add(bodyClass)

    const hideNative = () => {
      document.querySelectorAll<HTMLElement>(NATIVE_SAVE_SELECTORS).forEach((el) => {
        if (el.closest('.mirai-doc-create-header')) return
        if (el.dataset.miraiDisplayBeforeHide === undefined) {
          el.dataset.miraiDisplayBeforeHide = el.style.display || ''
        }
        el.dataset.miraiNativeSaveHidden = 'true'
        el.style.display = 'none'
      })
    }

    hideNative()
    const observer = new MutationObserver(hideNative)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      document.querySelectorAll<HTMLElement>('[data-mirai-native-save-hidden="true"]').forEach((el) => {
        el.style.display = el.dataset.miraiDisplayBeforeHide ?? ''
        delete el.dataset.miraiDisplayBeforeHide
        delete el.dataset.miraiNativeSaveHidden
      })
      document.body.classList.remove(bodyClass)
    }
  }, [mode])

  if (!mode) return null

  const handleSave = () => {
    document.querySelector<HTMLFormElement>('form')?.requestSubmit()
  }

  const isEdit = mode === 'edit'
  const pageLabel = isEdit ? 'Edit media' : 'Upload media'

  return (
    <MiraiDocHeader
      title={pageLabel}
      breadcrumbs={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Media', href: '/admin/collections/media' },
        { label: pageLabel },
      ]}
      onSave={handleSave}
      saveLabel="Save"
    />
  )
}
