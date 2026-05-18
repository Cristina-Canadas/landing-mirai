import type { CollectionConfig } from 'payload'
import { CATEGORY_ICON_OPTIONS } from '../components/payload/categoryIconOptions'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'color', 'icon'],
    components: {
      beforeList: ['./src/components/payload/MiraiListBreadcrumbs.tsx#MiraiListBreadcrumbs'],
      edit: {
        beforeDocumentControls: [
          './src/components/payload/MiraiCategoryCreateHeader.tsx#MiraiCategoryCreateHeader',
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
      admin: { description: 'Category name, localized per language.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier. Lowercase letters, numbers and underscores only. E.g: my_category',
      },
    },
    {
      name: 'color',
      type: 'text',
      defaultValue: '#3b82f6',
      admin: {
        components: {
          Field: './src/components/payload/CategoryColorPicker.tsx#CategoryColorPicker',
        },
      },
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') return true

        const normalized = value.trim().toLowerCase()
        const isHex = /^#[0-9a-f]{6}$/i.test(normalized)
        const isRgb = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}/i.test(normalized)
        const isLegacy = ['blue', 'green', 'purple', 'orange', 'red', 'pink'].includes(normalized)

        return isHex || isRgb || isLegacy || 'Color must be a valid hex, rgb, or legacy color value.'
      },
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'Wrench',
      admin: {
        components: {
          Field: './src/components/payload/CategoryIconSelect.tsx#CategoryIconSelect',
        },
      },
      options: CATEGORY_ICON_OPTIONS.map((icon) => ({ label: icon, value: icon })),
    },
  ],
}
