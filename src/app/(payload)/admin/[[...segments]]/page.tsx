import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import { MiraiAdminLoginView } from '../../../../components/payload/MiraiAdminLoginView'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export default async function Page({ params, searchParams }: Args) {
  const resolvedParams = await params

  if (resolvedParams.segments?.length === 1 && resolvedParams.segments[0] === 'login') {
    return <MiraiAdminLoginView searchParams={searchParams} />
  }

  return RootPage({ config, params, searchParams, importMap })
}
