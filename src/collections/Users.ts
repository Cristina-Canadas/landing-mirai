import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
  },
  admin: {
    useAsTitle: 'email',
    components: {
      beforeList: ['./src/components/payload/MiraiListBreadcrumbs.tsx#MiraiListBreadcrumbs'],
      edit: {
        beforeDocumentControls: [
          './src/components/payload/MiraiUserCreateHeader.tsx#MiraiUserCreateHeader',
        ],
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
