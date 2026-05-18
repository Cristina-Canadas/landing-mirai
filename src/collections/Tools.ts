import type { CollectionConfig } from 'payload'
import { CATEGORY_ICON_OPTIONS } from '../components/payload/categoryIconOptions'

/**
 * Safe URL validation.
 * Prevents javascript:, data:, vbscript:, and other unsafe protocols.
 */
const validateUrl = (url: string): boolean => {
  if (!url) return false

  try {
    // Allow placeholder anchors for tools that are not available yet.
    if (url === '#' || url.startsWith('#')) return true

    const urlObj = new URL(url, 'http://localhost')

    const allowedProtocols = ['http:', 'https:']
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export const Tools: CollectionConfig = {
  slug: 'tools',
  orderable: true,
  defaultSort: '_order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'status', 'order'],
    components: {
      beforeList: ['./src/components/payload/ToolsListHeader.tsx#ToolsListHeader'],
      edit: {
        beforeDocumentControls: [
          './src/components/payload/MiraiToolCreateHeader.tsx#MiraiToolCreateHeader',
        ],
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'Tool name, localized per language.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: true,
      admin: {
        description: 'Short tool description, localized per language.',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      defaultValue: '#',
      admin: {
        description: 'Tool URL. Use "#" if it is not available yet. Only http:// or https:// are allowed.',
      },
      validate: (value: any) => {
        if (!value || typeof value !== 'string') {
          return true
        }

        if (!validateUrl(value)) {
          return 'Invalid URL. Only http://, https://, or # are allowed.'
        }

        return true
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      admin: {
        components: {
          Cell: './src/components/payload/ToolStatusCell.tsx#ToolStatusCell',
        },
      },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Coming soon', value: 'coming_soon' },
        { label: 'Deprecated', value: 'deprecated' },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'Wrench',
      admin: {
        components: {
          Cell: './src/components/payload/ToolIconCell.tsx#ToolIconCell',
          Field: './src/components/payload/ToolIconPicker.tsx#ToolIconPicker',
        },
      },
      options: CATEGORY_ICON_OPTIONS.map((icon) => ({ label: icon, value: icon })),
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 99,
      admin: {
        condition: () => false,
      },
    },
  ],
}

