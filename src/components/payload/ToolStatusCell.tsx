import type { DefaultCellComponentProps } from 'payload'

type StatusValue = 'active' | 'coming_soon' | 'deprecated'

const STATUS_LABELS: Record<StatusValue, string> = {
  active: 'Active',
  coming_soon: 'Coming soon',
  deprecated: 'Deprecated',
}

function normalizeStatus(value: unknown): StatusValue {
  const raw = String(value ?? '').trim().toLowerCase()

  if (raw === 'coming_soon' || raw === 'pr\u00f3ximamente' || raw === 'proximamente') {
    return 'coming_soon'
  }

  if (raw === 'deprecated' || raw === 'obsoleta') {
    return 'deprecated'
  }

  return 'active'
}

export function ToolStatusCell({ cellData }: DefaultCellComponentProps) {
  const status = normalizeStatus(cellData)
  const label = STATUS_LABELS[status]

  return (
    <span className={`mirai-status-badge mirai-status-badge--${status}`} title={label}>
      {label}
    </span>
  )
}
