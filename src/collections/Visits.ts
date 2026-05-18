import type { CollectionConfig } from 'payload'

export const Visits: CollectionConfig = {
  slug: 'visits',
  admin: {
    hidden: true,
    useAsTitle: 'path',
  },
  access: {
    create: () => false,
    delete: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
    },
    {
      name: 'locale',
      type: 'text',
    },
    {
      name: 'userAgent',
      type: 'text',
    },
  ],
}
