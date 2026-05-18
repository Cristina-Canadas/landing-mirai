import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Tools } from './collections/Tools'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Visits } from './collections/Visits'
import { Categories } from './collections/Categories'
import { ToolClicks } from './collections/ToolClicks'
import { resolveDatabaseURI, resolvePayloadSecret } from './env/payload-env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const payloadSecret = resolvePayloadSecret()
const databaseURI = resolveDatabaseURI(`file:${path.resolve(dirname, '../payload.db')}`)

export default buildConfig({
  admin: {
    user: 'users',
    components: {
      Nav: './src/components/payload/MiraiAdminNav.tsx#MiraiAdminNav',
      beforeLogin: ['./src/components/payload/LoginPasswordToggle.tsx#LoginPasswordToggle'],
      afterDashboard: ['./src/components/payload/DashboardLogoutCard.tsx#DashboardLogoutCard'],
      views: {
        dashboard: {
          Component: './src/components/payload/MiraiAdminDashboard.tsx#MiraiAdminDashboard',
        },
        apiDocs: {
          Component: './src/components/payload/MiraiApiView.tsx#MiraiApiView',
          path: '/api-docs',
        },
      },
      graphics: {
        Icon: './src/components/payload/MiraiAdminIcon.tsx#MiraiAdminIcon',
        Logo: './src/components/payload/MiraiAdminLogo.tsx#MiraiAdminLogo',
      },
    },
    meta: {
      titleSuffix: '— Mirai Suite',
      description: 'Panel de administración de Mirai Suite',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/mirai.png',
        },
      ],
    },
  },

  localization: {
    locales: ['es', 'en', 'fr', 'ca', 'pt'],
    defaultLocale: 'en',
    fallback: true,
  },

  collections: [Tools, Users, Media, Visits, Categories, ToolClicks],

  editor: lexicalEditor(),

  secret: payloadSecret,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: sqliteAdapter({
    client: {
      url: databaseURI,
    },
  }),

  sharp,
})
