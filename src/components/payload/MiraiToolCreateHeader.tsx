'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MiraiDocHeader } from './MiraiDocHeader'

const NATIVE_SAVE_SELECTORS = [
  '.header--doc .form-submit',
  '.header--doc #action-save',
  '.header--doc button[type="submit"]',
].join(', ')

type ViewMode = 'create' | 'edit' | null

function getViewMode(pathname: string): ViewMode {
  if (/\/collections\/tools\/create/.test(pathname)) return 'create'
  if (/\/collections\/tools\/[^/?#]+/.test(pathname)) return 'edit'
  return null
}

function getToolId(pathname: string): string {
  const match = pathname.match(/\/collections\/tools\/([^/?#]+)/)
  return match?.[1] ?? ''
}

export function MiraiToolCreateHeader() {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const mode = getViewMode(pathname)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!mode) return

    const bodyClass = mode === 'create' ? 'mirai-tools-create' : 'mirai-tools-edit'
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
  const pageLabel = isEdit ? 'Edit tool' : 'Add new tool'
  const toolId = getToolId(pathname)

  const handleDelete = async () => {
    if (!isEdit || !toolId || isDeleting) return

    const confirmed = window.confirm(
      'Delete this tool permanently? It will be removed from the website and database.',
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const response = await fetch('/api/tools/delete', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId }),
      })

      const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? payload.message ?? 'Could not delete the tool')
      }

      router.push('/admin/collections/tools')
      router.refresh()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not delete the tool')
      setIsDeleting(false)
    }
  }

  return (
    <MiraiDocHeader
      title={pageLabel}
      breadcrumbs={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Tools', href: '/admin/collections/tools' },
        { label: pageLabel },
      ]}
      onSave={handleSave}
      onDelete={isEdit ? handleDelete : undefined}
      deleteLabel={isDeleting ? 'Deleting...' : 'Delete tool'}
      saveLabel="Save"
    />
  )
}
