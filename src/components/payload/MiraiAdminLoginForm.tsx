'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import {
  EmailField,
  Form,
  FormSubmit,
  TextField,
  useAuth,
  useConfig,
  useField,
  useTranslation,
} from '@payloadcms/ui'
import { email, formatAdminURL, getLoginOptions, getSafeRedirect, username } from 'payload/shared'

type SearchParams = {
  [key: string]: string | string[] | undefined
}

type LoginType = 'email' | 'emailOrUsername' | 'username'

type LoginFormProps = {
  searchParams: SearchParams
}

function LoginIdentityField({
  loginType,
  required = true,
}: {
  loginType: LoginType
  required?: boolean
}) {
  const { t } = useTranslation()

  if (loginType === 'email') {
    return (
      <EmailField
        field={{
          name: 'email',
          admin: {
            autoComplete: 'email',
          },
          label: t('general:email'),
          required,
        }}
        path="email"
        validate={email}
      />
    )
  }

  if (loginType === 'username') {
    return (
      <TextField
        field={{
          name: 'username',
          label: t('authentication:username'),
          required,
        }}
        path="username"
        validate={username}
      />
    )
  }

  const validateEmailOrUsername = (value: unknown, options: any) => {
    const typedValue = value as string | null | undefined
    const passesUsername = username(typedValue, options)
    const passesEmail = email(typedValue, options)

    if (!passesEmail && !passesUsername) {
      return `${t('general:email')}: ${passesEmail} ${t('general:username')}: ${passesUsername}`
    }

    return true
  }

  return (
    <TextField
      field={{
        name: 'username',
        label: t('authentication:emailOrUsername'),
        required,
      }}
      path="username"
      validate={validateEmailOrUsername as any}
    />
  )
}

function PasswordToggleField() {
  const { t } = useTranslation()
  const { value, setValue, valid, showError, errorMessage } = useField<string>({ path: 'password' })
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="field-type" style={{ marginBottom: 0 }}>
      <label className="field-label" htmlFor="password">
        {t('general:password')}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          onChange={(event) => setValue(event.target.value)}
          required
          type={showPassword ? 'text' : 'password'}
          value={value ?? ''}
          style={{
            paddingRight: '3rem',
            width: '100%',
          }}
        />
        <button
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          onClick={() => setShowPassword((current) => !current)}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
          style={{
            position: 'absolute',
            top: '50%',
            right: '0.8rem',
            transform: 'translateY(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.35rem',
            border: 0,
            background: 'transparent',
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showError && !valid && errorMessage ? (
        <p className="field-description" role="alert" style={{ marginTop: '0.45rem', color: '#c71827' }}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}

export function MiraiAdminLoginForm({ searchParams }: LoginFormProps) {
  const {
    config,
    getEntityConfig,
  } = useConfig()
  const { t } = useTranslation()
  const { setUser } = useAuth()

  const adminRoute = config.routes.admin
  const apiRoute = config.routes.api
  const forgotRoute = config.admin?.routes?.forgot ?? '/forgot'
  const userSlug = config.admin?.user ?? 'users'

  const collectionConfig = getEntityConfig({
    collectionSlug: userSlug,
  })

  const loginWithUsername = collectionConfig.auth?.loginWithUsername
  const { canLoginWithEmail, canLoginWithUsername } = getLoginOptions(loginWithUsername ?? false)

  const [loginType] = React.useState<LoginType>(() => {
    if (canLoginWithEmail && canLoginWithUsername) {
      return 'emailOrUsername'
    }

    if (canLoginWithUsername) {
      return 'username'
    }

    return 'email'
  })

  const prefillAutoLogin = typeof config.admin?.autoLogin === 'object' && config.admin?.autoLogin.prefillOnly
  const prefillUsername = prefillAutoLogin && typeof config.admin?.autoLogin === 'object' ? config.admin?.autoLogin.username : undefined
  const prefillEmail = prefillAutoLogin && typeof config.admin?.autoLogin === 'object' ? config.admin?.autoLogin.email : undefined
  const prefillPassword = prefillAutoLogin && typeof config.admin?.autoLogin === 'object' ? config.admin?.autoLogin.password : undefined

  const redirectUrl = getSafeRedirect({
    fallbackTo: adminRoute,
    redirectTo: searchParams.redirect as any,
  })

  const initialState: Record<string, any> = {
    password: {
      initialValue: prefillPassword ?? undefined,
      valid: true,
      value: prefillPassword ?? undefined,
    },
  }

  if (loginWithUsername) {
    initialState.username = {
      initialValue: prefillUsername ?? undefined,
      valid: true,
      value: prefillUsername ?? undefined,
    }
  } else {
    initialState.email = {
      initialValue: prefillEmail ?? undefined,
      valid: true,
      value: prefillEmail ?? undefined,
    }
  }

  return (
    <Form
      action={formatAdminURL({
        apiRoute,
        path: `/${userSlug}/login`,
      })}
      className="login__form"
      disableSuccessStatus
      initialState={initialState}
      method="POST"
      onSuccess={(data) => {
        setUser(data as any)
      }}
      redirect={redirectUrl}
      waitForAutocomplete
    >
      <div className="login__inputWrap" style={{ display: 'grid', gap: '0.25rem' }}>
        <LoginIdentityField loginType={loginType} />
        <PasswordToggleField />
      </div>

      <Link
        href={formatAdminURL({ adminRoute, path: forgotRoute })}
        prefetch={false}
        style={{ display: 'inline-block', marginTop: '1.75rem', marginBottom: '0.75rem' }}
      >
        {t('authentication:forgotPasswordQuestion')}
      </Link>

      <div style={{ marginTop: '0.25rem' }}>
        <FormSubmit size="large">{t('authentication:login')}</FormSubmit>
      </div>
    </Form>
  )
}
