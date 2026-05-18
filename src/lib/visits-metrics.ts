const DEFAULT_VISITS_BASELINE_ISO = '2026-04-17T16:24:21.3574771+02:00'
const DEFAULT_VISITS_TRACKING_ENABLED = process.env.NODE_ENV === 'production'

function parseBooleanFlag(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value.trim() === '') {
    return fallback
  }

  const normalized = value.trim().toLowerCase()

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false
  }

  return fallback
}

function parseDateOrFallback(input: string, fallbackISO: string): Date {
  const value = new Date(input)
  if (Number.isNaN(value.getTime())) {
    return new Date(fallbackISO)
  }
  return value
}

export const VISITS_BASELINE_ISO =
  process.env.VISITS_BASELINE_ISO ?? process.env.NEXT_PUBLIC_VISITS_BASELINE_ISO ?? DEFAULT_VISITS_BASELINE_ISO

export const VISITS_BASELINE_DATE = parseDateOrFallback(VISITS_BASELINE_ISO, DEFAULT_VISITS_BASELINE_ISO)
export const VISITS_TRACKING_ENABLED = parseBooleanFlag(
  process.env.ENABLE_VISITS_TRACKING ?? process.env.NEXT_PUBLIC_ENABLE_VISITS_TRACKING,
  DEFAULT_VISITS_TRACKING_ENABLED,
)

export function isVisitsTrackingEnabled(): boolean {
  return VISITS_TRACKING_ENABLED
}

export function getVisitsBaselineISO(): string {
  return VISITS_BASELINE_DATE.toISOString()
}

export function getTodayVisitsStartISO(now: Date = new Date()): string {
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const startDate =
    todayStart.getTime() > VISITS_BASELINE_DATE.getTime() ? todayStart : VISITS_BASELINE_DATE

  return startDate.toISOString()
}
