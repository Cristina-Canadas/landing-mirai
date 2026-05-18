type DashboardLogoutCardProps = {
  payload?: {
    config?: {
      admin?: {
        routes?: {
          logout?: string
        }
      }
      routes?: {
        admin?: string
      }
    }
  }
}

function normalizePathSegment(path: string | undefined, fallback: string): string {
  const value = (path || fallback).trim()
  if (!value) return fallback
  return value.startsWith('/') ? value : `/${value}`
}

export async function DashboardLogoutCard({ payload }: DashboardLogoutCardProps) {
  const adminRoute = normalizePathSegment(payload?.config?.routes?.admin, '/admin')
  const logoutRoute = normalizePathSegment(payload?.config?.admin?.routes?.logout, '/logout')
  const href = `${adminRoute}${logoutRoute}`

  return (
    <section className="mirai-dashboard-actions card">
      <div className="mirai-dashboard-actions__content">
        <h3 className="mirai-dashboard-actions__title">Session</h3>
        <p className="mirai-dashboard-actions__description">Sign out from the central panel.</p>
      </div>
      <a href={href} className="btn btn--style-primary btn--size-large mirai-dashboard-actions__logout">
        Log out
      </a>
    </section>
  )
}
