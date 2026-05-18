import type { CollectionConfig } from 'payload'

export const ToolClicks: CollectionConfig = {
  slug: 'toolClicks',
  admin: {
    hidden: true,
    useAsTitle: 'toolName',
  },
  access: {
    create: () => false,
    delete: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
  },
  fields: [
    {
      name: 'tool',
      type: 'relationship',
      relationTo: 'tools',
      required: true,
      index: true,
    },
    {
      name: 'toolName',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'toolUrl',
      type: 'text',
    },
    {
      name: 'locale',
      type: 'text',
      defaultValue: 'en',
      index: true,
    },
    {
      name: 'path',
      type: 'text',
      defaultValue: '/',
    },
    {
      name: 'userAgent',
      type: 'text',
    },
  ],
}
