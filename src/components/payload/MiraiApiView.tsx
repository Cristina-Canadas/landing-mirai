import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { MiraiApiViewClient } from './MiraiApiViewClient'

export function MiraiApiView({
  i18n,
  locale,
  params,
  payload,
  permissions,
  searchParams,
  user,
  visibleEntities,
}: AdminViewServerProps) {
  return (
    <DefaultTemplate
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user}
      visibleEntities={visibleEntities ?? { collections: [], globals: [] }}
    >
      <MiraiApiViewClient />
    </DefaultTemplate>
  )
}
