import { MiraiAdminLogo } from './MiraiAdminLogo'
import { MiraiAdminLoginForm } from './MiraiAdminLoginForm'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

type MiraiAdminLoginViewProps = {
  searchParams: SearchParams
}

export async function MiraiAdminLoginView({ searchParams }: MiraiAdminLoginViewProps) {
  const resolvedSearchParams = await searchParams

  return (
    <div className="template-minimal login">
      <div className="template-minimal__wrap">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <MiraiAdminLogo />
        </div>
        <MiraiAdminLoginForm searchParams={resolvedSearchParams} />
      </div>
    </div>
  )
}
