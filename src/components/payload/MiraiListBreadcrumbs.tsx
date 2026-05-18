'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const COLLECTION_LABELS: Record<string, string> = {
  tools:      'Tools',
  users:      'Users',
  media:      'Media',
  categories: 'Categories',
  visits:     'Visits',
}

function getCollectionSlug(pathname: string): string | null {
  const match = pathname.match(/\/collections\/([^/]+)/)
  return match?.[1] ?? null
}

export function MiraiListBreadcrumbs() {
  const pathname = usePathname() ?? ''
  const collectionSlug = getCollectionSlug(pathname)
  const currentLabel = collectionSlug
    ? (COLLECTION_LABELS[collectionSlug] ?? collectionSlug)
    : 'Collection'

  return (
    <div className="mirai-list-breadcrumbs-wrap">
      <nav className="mirai-list-breadcrumbs" aria-label="Breadcrumb navigation">
        <Link href="/admin" className="mirai-list-breadcrumbs__link">
          Dashboard
        </Link>
        <span className="mirai-list-breadcrumbs__sep" aria-hidden="true">
          /
        </span>
        <span className="mirai-list-breadcrumbs__current" aria-current="page">
          {currentLabel}
        </span>
      </nav>
    </div>
  )
}
