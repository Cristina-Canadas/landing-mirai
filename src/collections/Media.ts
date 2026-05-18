import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    components: {
      beforeList: ['./src/components/payload/MiraiListBreadcrumbs.tsx#MiraiListBreadcrumbs'],
      edit: {
        beforeDocumentControls: [
          './src/components/payload/MiraiMediaCreateHeader.tsx#MiraiMediaCreateHeader',
        ],
      },
    },
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
