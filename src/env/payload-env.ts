const LOCAL_DEV_PAYLOAD_SECRET = 'mirai-suite-local-dev-secret-not-for-production'

const truthyValues = new Set(['1', 'true', 'yes', 'on'])
const productionLikeEnvironments = new Set(['production', 'staging'])

function isTruthy(value: string | undefined): boolean {
  return value != null && truthyValues.has(value.trim().toLowerCase())
}

function isDefaultSecret(value: string): boolean {
  return (
    value === LOCAL_DEV_PAYLOAD_SECRET ||
    value === 'mirai-suite-dev-secret-change-in-production' ||
    value === 'cambiar-en-produccion'
  )
}

function isHostedOrCIEnvironment(): boolean {
  return Boolean(
    process.env.CI ||
      process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.VERCEL ||
      process.env.VERCEL_ENV ||
      process.env.RENDER ||
      process.env.FLY_APP_NAME,
  )
}

function getRuntimeEnvironment(): string {
  return (
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.VERCEL_ENV ||
    process.env.APP_ENV ||
    process.env.NODE_ENV ||
    'development'
  )
}

function shouldRequireProductionSecrets(): boolean {
  if (isTruthy(process.env.REQUIRE_PRODUCTION_SECRETS)) return true

  const runtimeEnvironment = getRuntimeEnvironment().toLowerCase()
  return (
    process.env.NODE_ENV === 'production' &&
    isHostedOrCIEnvironment() &&
    productionLikeEnvironments.has(runtimeEnvironment)
  )
}

export function resolvePayloadSecret(): string {
  const payloadSecret = process.env['PAYLOAD_SECRET']?.trim()
  const strictSecrets = shouldRequireProductionSecrets()

  if (!payloadSecret) {
    if (strictSecrets) {
      throw new Error(
        [
          'PAYLOAD_SECRET is required for hosted, CI, staging, or production builds.',
          'Set PAYLOAD_SECRET to a strong random value in the environment dashboard.',
          'For local development only, you may omit it and the project will use a non-production fallback.',
        ].join(' '),
      )
    }

    return LOCAL_DEV_PAYLOAD_SECRET
  }

  if (strictSecrets && isDefaultSecret(payloadSecret)) {
    throw new Error(
      [
        'PAYLOAD_SECRET is using a known development placeholder.',
        'Set PAYLOAD_SECRET to a strong random value before deploying.',
      ].join(' '),
    )
  }

  return payloadSecret
}

export function resolveDatabaseURI(defaultLocalDatabaseURI: string): string {
  const databaseURI = process.env['DATABASE_URI']?.trim()
  const strictSecrets = shouldRequireProductionSecrets()

  if (!databaseURI) {
    if (strictSecrets) {
      throw new Error(
        [
          'DATABASE_URI is required for hosted, CI, staging, or production builds.',
          'Use a managed database connection string, for example PostgreSQL on Railway.',
          'For local development only, the project falls back to payload.db.',
        ].join(' '),
      )
    }

    return defaultLocalDatabaseURI
  }

  if (strictSecrets && databaseURI.startsWith('file:')) {
    throw new Error(
      [
        'DATABASE_URI points to a local SQLite file in a hosted, CI, staging, or production build.',
        'Use a Turso (libsql://) remote database for deployed environments.',
        'See: https://turso.tech — create a database and set DATABASE_URI to the libsql connection string.',
      ].join(' '),
    )
  }

  return databaseURI
}
