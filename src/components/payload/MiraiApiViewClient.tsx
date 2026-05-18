'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Copy } from 'lucide-react'

type Endpoint = {
  description: string
  method: 'GET'
  path: string
}

const ENDPOINTS: Endpoint[] = [
  { method: 'GET', path: '/api/tools', description: 'List all tools' },
  { method: 'GET', path: '/api/tools?depth=1', description: 'Tools with category data' },
  { method: 'GET', path: '/api/categories', description: 'List all categories' },
  { method: 'GET', path: '/api/media', description: 'List all media' },
]

export function MiraiApiViewClient() {
  const [response, setResponse] = useState('')
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0].path)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchEndpoint = useCallback(async (path: string) => {
    setLoading(true)
    setResponse('')
    try {
      const res = await fetch(path)
      const json = await res.json()
      setResponse(JSON.stringify(json, null, 2))
    } catch {
      setResponse('Error fetching endpoint.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEndpoint(activeEndpoint)
  }, [activeEndpoint, fetchEndpoint])

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="mirai-api-view">
      <nav className="mirai-list-breadcrumbs" aria-label="Breadcrumb navigation">
        <Link href="/admin" className="mirai-list-breadcrumbs__link">
          Dashboard
        </Link>
        <span className="mirai-list-breadcrumbs__sep" aria-hidden="true">/</span>
        <span className="mirai-list-breadcrumbs__current" aria-current="page">
          API
        </span>
      </nav>

      <div className="mirai-api-view__header">
        <h1>REST API</h1>
        <p>Use these endpoints to connect the app to other technologies.</p>
      </div>

      <div className="mirai-admin-dashboard__panel mirai-api-view__panel">
        <div className="mirai-admin-dashboard__panel-header">
          <div>
            <h2>Endpoints</h2>
            <p>Select an endpoint to preview its JSON response</p>
          </div>
        </div>

        <div className="mirai-api-view__endpoints" role="list">
          {ENDPOINTS.map((ep) => {
            const isActive = activeEndpoint === ep.path
            return (
              <button
                key={ep.path}
                role="listitem"
                className={`mirai-api-view__endpoint${isActive ? ' mirai-api-view__endpoint--active' : ''}`}
                onClick={() => setActiveEndpoint(ep.path)}
                aria-pressed={isActive}
              >
                <span className="mirai-api-view__method">{ep.method}</span>
                <code className="mirai-api-view__path">{ep.path}</code>
                <span className="mirai-api-view__desc">{ep.description}</span>
              </button>
            )
          })}
        </div>

        <div className="mirai-api-view__code-block">
          <div className="mirai-api-view__code-header">
            <code className="mirai-api-view__active-path">{activeEndpoint}</code>
            <button
              className="mirai-api-view__copy-btn"
              onClick={handleCopy}
              aria-label="Copy JSON to clipboard"
              disabled={loading || !response}
            >
              {copied
                ? <Check size={13} strokeWidth={2.2} aria-hidden="true" />
                : <Copy size={13} strokeWidth={1.9} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="mirai-api-view__code" aria-live="polite">
            {loading ? 'Loading…' : response}
          </pre>
        </div>
      </div>
    </main>
  )
}
