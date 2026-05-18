import Link from 'next/link'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  FolderPlus,
  ImagePlus,
  MousePointerClick,
  Sparkles,
  Tag,
  UserPlus,
  Users,
  WandSparkles,
  Wrench,
} from 'lucide-react'

type DashboardProps = {
  payload?: any
}

type Trend = {
  direction: 'up' | 'down'
  label: string
}

type Kpi = {
  icon: typeof BarChart3
  label: string
  value: string
  trend: Trend
}

type ToolMetric = {
  clicks: number
  name: string
}

type SeriesPoint = {
  clicks: number
  day: string
  key: string
  visits: number
}

type ActivityItem = {
  icon: typeof Wrench
  text: string
  time: string
  updatedAt: string
}

type DashboardData = {
  activeUsers: number
  activeUsersPrevious: number
  recentActivity: ActivityItem[]
  todayClicks: number
  todayVisits: number
  toolClicksYesterday: number
  topTools: ToolMetric[]
  visitsSeries: SeriesPoint[]
  visitsYesterday: number
}

const emptyTopTools: ToolMetric[] = [
  { name: 'No clicks tracked yet', clicks: 0 },
]

const quickActions = [
  { href: '/admin/collections/tools/create', icon: Wrench, label: 'Create tool' },
  { href: '/admin/collections/categories/create', icon: FolderPlus, label: 'Create category' },
  { href: '/admin/collections/media/create', icon: ImagePlus, label: 'Upload media' },
  { href: '/admin/collections/users', icon: Users, label: 'Manage users' },
]

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }).format(value)
}

function formatDay(value: Date): string {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(value)
}

function getDateKey(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function startOfDay(value: Date): Date {
  const next = new Date(value)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(value: Date, amount: number): Date {
  const next = new Date(value)
  next.setDate(next.getDate() + amount)
  return next
}

function getLocalizedName(name: unknown, fallback: string): string {
  if (typeof name === 'string' && name.trim()) return name
  if (name && typeof name === 'object') {
    const localized = name as Record<string, unknown>
    const value = localized.en ?? localized.es ?? Object.values(localized)[0]
    if (typeof value === 'string' && value.trim()) return value
  }
  return fallback
}

function getDocTitle(doc: any, fallback: string): string {
  return getLocalizedName(doc?.name ?? doc?.alt ?? doc?.email, fallback)
}

function getRelativeTime(dateInput: string, now: Date): string {
  const date = new Date(dateInput)
  const diffMs = Math.max(now.getTime() - date.getTime(), 0)
  const minutes = Math.floor(diffMs / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`

  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(date)
}

function getTrend(current: number, previous: number, fallbackLabel: string): Trend {
  if (previous === 0 && current === 0) {
    return { direction: 'up', label: fallbackLabel }
  }

  if (previous === 0) {
    return { direction: 'up', label: '+100% vs previous period' }
  }

  const change = Math.round(((current - previous) / previous) * 100)
  return {
    direction: change >= 0 ? 'up' : 'down',
    label: `${change >= 0 ? '+' : ''}${change}% vs previous period`,
  }
}

function buildLinePath(values: number[], width = 620, height = 230): string {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)
  const step = width / Math.max(values.length - 1, 1)

  return values
    .map((value, index) => {
      const x = index * step
      const y = height - ((value - min) / range) * (height - 34) - 17
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function countDocsByDay(docs: any[], field = 'createdAt'): Record<string, number> {
  return docs.reduce<Record<string, number>>((acc, doc) => {
    const value = doc?.[field]
    if (!value) return acc
    const key = getDateKey(new Date(value))
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
}

function countUniqueUserAgents(docs: any[]): number {
  const agents = new Set<string>()

  docs.forEach((doc) => {
    const value = typeof doc?.userAgent === 'string' ? doc.userAgent.trim() : ''
    if (value) agents.add(value)
  })

  return agents.size
}

async function fetchRecentActivity(payload: any, now: Date): Promise<ActivityItem[]> {
  const configs = [
    { collection: 'tools', created: 'Tool created', updated: 'Tool updated', icon: Wrench },
    { collection: 'categories', created: 'Category created', updated: 'Category updated', icon: Tag },
    { collection: 'users', created: 'User added', updated: 'User updated', icon: UserPlus },
    { collection: 'media', created: 'Media uploaded', updated: 'Media updated', icon: ImagePlus },
  ] as const

  const results = await Promise.all(
    configs.map(async (item) => {
      try {
        const response = await payload.find({
          collection: item.collection,
          depth: 0,
          limit: 4,
          locale: 'en',
          overrideAccess: true,
          sort: '-updatedAt',
        })

        return (Array.isArray(response?.docs) ? response.docs : []).map((doc: any) => {
          const createdAt = typeof doc?.createdAt === 'string' ? doc.createdAt : ''
          const updatedAt = typeof doc?.updatedAt === 'string' ? doc.updatedAt : createdAt
          const wasCreated =
            createdAt && updatedAt && Math.abs(new Date(updatedAt).getTime() - new Date(createdAt).getTime()) < 2000

          return {
            icon: item.icon,
            text: `${wasCreated ? item.created : item.updated}: ${getDocTitle(doc, item.collection)}`,
            time: getRelativeTime(updatedAt, now),
            updatedAt,
          }
        })
      } catch {
        return []
      }
    }),
  )

  return results
    .flat()
    .filter((item) => item.updatedAt)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)
}

async function getDashboardData(payload?: any): Promise<DashboardData> {
  const now = new Date()
  const todayStart = startOfDay(now)
  const yesterdayStart = addDays(todayStart, -1)
  const sevenDaysStart = addDays(todayStart, -6)
  const activeWindowStart = new Date(now.getTime() - 30 * 60 * 1000)
  const previousActiveWindowStart = new Date(now.getTime() - 60 * 60 * 1000)

  const emptySeries = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(sevenDaysStart, index)
    return {
      clicks: 0,
      day: formatDay(date),
      key: getDateKey(date),
      visits: 0,
    }
  })

  if (!payload?.find) {
    return {
      activeUsers: 0,
      activeUsersPrevious: 0,
      recentActivity: [],
      todayClicks: 0,
      todayVisits: 0,
      toolClicksYesterday: 0,
      topTools: emptyTopTools,
      visitsSeries: emptySeries,
      visitsYesterday: 0,
    }
  }

  try {
    const [visits, clicks, activeVisits, previousActiveVisits, activeClicks, previousActiveClicks, activity] =
      await Promise.all([
        payload.find({
          collection: 'visits',
          depth: 0,
          limit: 10000,
          overrideAccess: true,
          where: {
            createdAt: {
              greater_than_equal: sevenDaysStart.toISOString(),
            },
          },
        }),
        payload.find({
          collection: 'toolClicks',
          depth: 0,
          limit: 10000,
          overrideAccess: true,
          where: {
            createdAt: {
              greater_than_equal: sevenDaysStart.toISOString(),
            },
          },
        }),
        payload.find({
          collection: 'visits',
          depth: 0,
          limit: 10000,
          overrideAccess: true,
          where: {
            createdAt: {
              greater_than_equal: activeWindowStart.toISOString(),
            },
          },
        }),
        payload.find({
          collection: 'visits',
          depth: 0,
          limit: 10000,
          overrideAccess: true,
          where: {
            and: [
              { createdAt: { greater_than_equal: previousActiveWindowStart.toISOString() } },
              { createdAt: { less_than: activeWindowStart.toISOString() } },
            ],
          },
        }),
        payload.find({
          collection: 'toolClicks',
          depth: 0,
          limit: 10000,
          overrideAccess: true,
          where: {
            createdAt: {
              greater_than_equal: activeWindowStart.toISOString(),
            },
          },
        }),
        payload.find({
          collection: 'toolClicks',
          depth: 0,
          limit: 10000,
          overrideAccess: true,
          where: {
            and: [
              { createdAt: { greater_than_equal: previousActiveWindowStart.toISOString() } },
              { createdAt: { less_than: activeWindowStart.toISOString() } },
            ],
          },
        }),
        fetchRecentActivity(payload, now),
      ])

    const visitDocs = Array.isArray(visits?.docs) ? visits.docs : []
    const clickDocs: any[] = Array.isArray(clicks?.docs) ? clicks.docs : []
    const visitsByDay = countDocsByDay(visitDocs)
    const clicksByDay = countDocsByDay(clickDocs)

    const visitsSeries = emptySeries.map((point) => ({
      ...point,
      clicks: clicksByDay[point.key] ?? 0,
      visits: visitsByDay[point.key] ?? 0,
    }))

    const clicksByTool: Record<string, ToolMetric> = clickDocs.reduce((acc: Record<string, ToolMetric>, doc: any) => {
      const toolName = getLocalizedName(doc?.toolName, 'Unknown tool')
      acc[toolName] = {
        name: toolName,
        clicks: (acc[toolName]?.clicks ?? 0) + 1,
      }
      return acc
    }, {})

    const topTools = Object.values(clicksByTool)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)

    const activeDocs = [
      ...(Array.isArray(activeVisits?.docs) ? activeVisits.docs : []),
      ...(Array.isArray(activeClicks?.docs) ? activeClicks.docs : []),
    ]
    const previousActiveDocs = [
      ...(Array.isArray(previousActiveVisits?.docs) ? previousActiveVisits.docs : []),
      ...(Array.isArray(previousActiveClicks?.docs) ? previousActiveClicks.docs : []),
    ]

    return {
      activeUsers: countUniqueUserAgents(activeDocs),
      activeUsersPrevious: countUniqueUserAgents(previousActiveDocs),
      recentActivity: activity,
      todayClicks: clicksByDay[getDateKey(todayStart)] ?? 0,
      todayVisits: visitsByDay[getDateKey(todayStart)] ?? 0,
      toolClicksYesterday: clicksByDay[getDateKey(yesterdayStart)] ?? 0,
      topTools: topTools.length ? topTools : emptyTopTools,
      visitsSeries,
      visitsYesterday: visitsByDay[getDateKey(yesterdayStart)] ?? 0,
    }
  } catch {
    return {
      activeUsers: 0,
      activeUsersPrevious: 0,
      recentActivity: [],
      todayClicks: 0,
      todayVisits: 0,
      toolClicksYesterday: 0,
      topTools: emptyTopTools,
      visitsSeries: emptySeries,
      visitsYesterday: 0,
    }
  }
}

export async function MiraiAdminDashboard({ payload }: DashboardProps) {
  const dashboard = await getDashboardData(payload)
  const mostUsedTool = dashboard.topTools[0]?.clicks ? dashboard.topTools[0].name : 'No clicks yet'
  const maxToolClicks = Math.max(...dashboard.topTools.map((tool) => tool.clicks), 1)
  const visitsPath = buildLinePath(dashboard.visitsSeries.map((item) => item.visits))
  const clicksPath = buildLinePath(dashboard.visitsSeries.map((item) => item.clicks))

  const kpis: Kpi[] = [
    {
      icon: BarChart3,
      label: 'Visits',
      value: formatNumber(dashboard.todayVisits),
      trend: getTrend(dashboard.todayVisits, dashboard.visitsYesterday, 'No previous visits'),
    },
    {
      icon: MousePointerClick,
      label: 'Tool clicks',
      value: formatNumber(dashboard.todayClicks),
      trend: getTrend(dashboard.todayClicks, dashboard.toolClicksYesterday, 'No previous clicks'),
    },
    {
      icon: Users,
      label: 'Active users',
      value: formatNumber(dashboard.activeUsers),
      trend: getTrend(dashboard.activeUsers, dashboard.activeUsersPrevious, 'No previous activity'),
    },
    {
      icon: Sparkles,
      label: 'Most used tool',
      value: mostUsedTool,
      trend: { direction: dashboard.topTools[0]?.clicks ? 'up' : 'down', label: 'Based on tracked clicks' },
    },
  ]

  return (
    <main className="mirai-admin-dashboard">
      <section className="mirai-admin-dashboard__welcome">
        <div className="mirai-admin-dashboard__welcome-content">
          <span className="mirai-admin-dashboard__eyebrow">
            <CalendarDays size={16} strokeWidth={1.8} aria-hidden="true" />
            {formatDate(new Date())}
          </span>
          <h1>Welcome back</h1>
          <p>
            Today recorded {formatNumber(dashboard.todayVisits)} visits and{' '}
            {formatNumber(dashboard.todayClicks)} tool accesses.
          </p>
        </div>
        <div className="mirai-admin-dashboard__welcome-mark" aria-hidden="true">
          <Activity size={28} strokeWidth={1.7} />
        </div>
      </section>

      <section className="mirai-admin-dashboard__kpis" aria-label="Main metrics">
        {kpis.map(({ icon: Icon, label, value, trend }) => {
          const TrendIcon = trend.direction === 'up' ? ArrowUpRight : ArrowDownRight
          return (
            <article className="mirai-admin-dashboard__kpi-card" key={label}>
              <div className="mirai-admin-dashboard__kpi-topline">
                <span className="mirai-admin-dashboard__icon">
                  <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span
                  className={`mirai-admin-dashboard__trend mirai-admin-dashboard__trend--${trend.direction}`}
                >
                  <TrendIcon size={14} strokeWidth={2} aria-hidden="true" />
                  {trend.label}
                </span>
              </div>
              <h2>{label}</h2>
              <p>{value}</p>
            </article>
          )
        })}
      </section>

      <section className="mirai-admin-dashboard__grid mirai-admin-dashboard__grid--main">
        <article className="mirai-admin-dashboard__panel mirai-admin-dashboard__panel--chart">
          <div className="mirai-admin-dashboard__panel-header">
            <div>
              <h2>Visits</h2>
              <p>Last 7 days</p>
            </div>
            <div className="mirai-admin-dashboard__legend" aria-label="Chart legend">
              <span><i className="mirai-admin-dashboard__dot mirai-admin-dashboard__dot--visits" /> Visits</span>
              <span><i className="mirai-admin-dashboard__dot mirai-admin-dashboard__dot--clicks" /> Clicks</span>
            </div>
          </div>

          <div className="mirai-admin-dashboard__chart" aria-label="Daily visits and clicks chart">
            <svg viewBox="0 0 620 230" role="img" aria-hidden="true" preserveAspectRatio="none">
              <path d="M 0 206 H 620 M 0 154 H 620 M 0 102 H 620 M 0 50 H 620" className="mirai-admin-dashboard__grid-lines" />
              <path d={visitsPath} className="mirai-admin-dashboard__line mirai-admin-dashboard__line--visits" />
              <path d={clicksPath} className="mirai-admin-dashboard__line mirai-admin-dashboard__line--clicks" />
            </svg>
            <div className="mirai-admin-dashboard__chart-labels">
              {dashboard.visitsSeries.map((item) => (
                <span key={item.key}>{item.day}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="mirai-admin-dashboard__panel">
          <div className="mirai-admin-dashboard__panel-header">
            <div>
              <h2>Top tools</h2>
              <p>Ranked by tracked clicks</p>
            </div>
          </div>
          <ol className="mirai-admin-dashboard__tool-list">
            {dashboard.topTools.map((tool, index) => {
              const percent = Math.round((tool.clicks / maxToolClicks) * 100)
              return (
                <li className="mirai-admin-dashboard__tool-item" key={`${tool.name}-${index}`}>
                  <div className="mirai-admin-dashboard__tool-row">
                    <span className="mirai-admin-dashboard__tool-rank">#{index + 1}</span>
                    <span className="mirai-admin-dashboard__tool-name">{tool.name}</span>
                    <span className="mirai-admin-dashboard__tool-clicks">{formatNumber(tool.clicks)} clicks</span>
                  </div>
                  <div className="mirai-admin-dashboard__progress" aria-hidden="true">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                </li>
              )
            })}
          </ol>
        </article>
      </section>

      <section className="mirai-admin-dashboard__grid">
        <article className="mirai-admin-dashboard__panel">
          <div className="mirai-admin-dashboard__panel-header">
            <div>
              <h2>Recent activity</h2>
              <p>Latest content changes</p>
            </div>
          </div>
          <div className="mirai-admin-dashboard__activity-list">
            {dashboard.recentActivity.length ? (
              dashboard.recentActivity.map(({ icon: Icon, text, time }) => (
                <div className="mirai-admin-dashboard__activity-item" key={`${text}-${time}`}>
                  <span className="mirai-admin-dashboard__activity-icon">
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <p>{text}</p>
                    <span>{time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="mirai-admin-dashboard__activity-item">
                <span className="mirai-admin-dashboard__activity-icon">
                  <WandSparkles size={17} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p>No recent activity yet</p>
                  <span>Changes will appear here</span>
                </div>
              </div>
            )}
          </div>
        </article>

        <article className="mirai-admin-dashboard__panel">
          <div className="mirai-admin-dashboard__panel-header">
            <div>
              <h2>Quick actions</h2>
              <p>Daily admin management</p>
            </div>
          </div>
          <div className="mirai-admin-dashboard__quick-actions">
            {quickActions.map(({ href, icon: Icon, label }) => (
              <Link className="mirai-admin-dashboard__quick-action" href={href} key={href}>
                <span>
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                </span>
                {label}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}
