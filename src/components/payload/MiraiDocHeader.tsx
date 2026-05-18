'use client'

import Link from 'next/link'
import type { RefObject } from 'react'

export interface Breadcrumb {
  label: string
  href?: string
}

interface MiraiDocHeaderProps {
  title: string
  breadcrumbs: Breadcrumb[]
  actionsSlotRef?: RefObject<HTMLDivElement | null>
  deleteLabel?: string
  onDelete?: () => void
  onSave?: () => void
  saveLabel?: string
}

export function MiraiDocHeader({
  title,
  breadcrumbs,
  actionsSlotRef,
  deleteLabel = 'Delete',
  onDelete,
  onSave,
  saveLabel = 'Save',
}: MiraiDocHeaderProps) {
  return (
    <section className="mirai-doc-create-header">
      <nav className="mirai-list-breadcrumbs" aria-label="Breadcrumb navigation">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {i > 0 && (
              <span className="mirai-list-breadcrumbs__sep" aria-hidden="true">
                /
              </span>
            )}
            {crumb.href ? (
              <Link href={crumb.href} className="mirai-list-breadcrumbs__link">
                {crumb.label}
              </Link>
            ) : (
              <span className="mirai-list-breadcrumbs__current" aria-current="page">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      <div className="mirai-doc-create-header__main">
        <h1 className="mirai-doc-create-header__title">{title}</h1>

        <div className="mirai-doc-create-header__actions" ref={actionsSlotRef}>
          {onSave && (
            <button
              type="button"
              className="btn btn--style-primary"
              onClick={onSave}
              aria-label={saveLabel}
            >
              <span className="btn__content">{saveLabel}</span>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn mirai-doc-create-header__delete"
              onClick={onDelete}
              aria-label={deleteLabel}
            >
              <span className="btn__content">{deleteLabel}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
