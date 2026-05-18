'use client'

import { useEffect } from 'react'

const REMEMBER_SESSION_COOKIE = 'mirai-remember-session'
const REMEMBER_SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const EYE_ICON = `
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M1.5 12s3.5-6.5 10.5-6.5S22.5 12 22.5 12s-3.5 6.5-10.5 6.5S1.5 12 1.5 12Z" />
  <circle cx="12" cy="12" r="3.25" />
</svg>
`

const EYE_OFF_ICON = `
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M3 3l18 18" />
  <path d="M9.75 5.96A10.44 10.44 0 0 1 12 5.5c7 0 10.5 6.5 10.5 6.5a18.87 18.87 0 0 1-3.54 4.35" />
  <path d="M6.1 8.2A18.53 18.53 0 0 0 1.5 12S5 18.5 12 18.5c1.59 0 3.03-.34 4.3-.9" />
  <path d="M10.59 10.58A2 2 0 0 0 12 14a1.95 1.95 0 0 0 1.41-.59" />
</svg>
`

function hasRememberSessionPreference(): boolean {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part === `${REMEMBER_SESSION_COOKIE}=1`)
}

function setRememberSessionPreference(enabled: boolean) {
  document.cookie = `${REMEMBER_SESSION_COOKIE}=${enabled ? '1' : '0'}; Max-Age=${
    enabled ? REMEMBER_SESSION_COOKIE_MAX_AGE : 0
  }; Path=/; SameSite=Lax`
}

function ensureToggle(input: HTMLInputElement) {
  if (input.dataset.miraiPasswordReady === 'true') return

  const wrap = (input.parentElement ?? input) as HTMLElement
  wrap.classList.add('mirai-password-field-wrap')

  if (!input.id) {
    input.id = `mirai-password-${Math.random().toString(36).slice(2, 10)}`
  }

  input.classList.add('mirai-password-input')

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'mirai-password-toggle'
  button.setAttribute('aria-label', 'Mostrar contraseña')
  button.setAttribute('aria-controls', input.id)
  button.innerHTML = EYE_ICON

  button.addEventListener('click', () => {
    const isHidden = input.type === 'password'
    input.type = isHidden ? 'text' : 'password'
    button.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña')
    button.innerHTML = isHidden ? EYE_OFF_ICON : EYE_ICON
  })

  wrap.appendChild(button)
  input.dataset.miraiPasswordReady = 'true'
}

function ensureRememberSessionOption(root: Element) {
  const existing = root.querySelector<HTMLInputElement>('.mirai-login-remember__checkbox')
  if (existing) {
    existing.checked = hasRememberSessionPreference()
    return
  }

  const forgotPasswordLink = root.querySelector(".login__form a[href*='/forgot']")
  const submitRow = root.querySelector('.login__form .form-submit')
  const insertionPoint = forgotPasswordLink ?? submitRow

  if (!insertionPoint?.parentElement) return

  const wrapper = document.createElement('label')
  wrapper.className = 'mirai-login-remember'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'mirai-login-remember__checkbox'
  checkbox.checked = hasRememberSessionPreference()
  checkbox.setAttribute('aria-label', 'Mantener sesión iniciada')

  const copy = document.createElement('span')
  copy.className = 'mirai-login-remember__label'
  copy.textContent = 'Mantener sesión iniciada'

  checkbox.addEventListener('change', () => {
    setRememberSessionPreference(checkbox.checked)
  })

  wrapper.appendChild(checkbox)
  wrapper.appendChild(copy)
  insertionPoint.insertAdjacentElement('beforebegin', wrapper)
}

function ensureBackLink(root: Element) {
  if (root.querySelector('.mirai-login-landing-link')) return

  const submitRow = root.querySelector('.login__form .form-submit')
  if (!submitRow?.parentElement) return

  const wrapper = document.createElement('div')
  wrapper.className = 'mirai-login-landing-link'

  const link = document.createElement('a')
  link.href = '/'
  link.className = 'mirai-login-landing-link__button'
  link.textContent = 'Volver a herramientas'

  wrapper.appendChild(link)
  submitRow.insertAdjacentElement('afterend', wrapper)
}

export function LoginPasswordToggle() {
  useEffect(() => {
    const root = document.querySelector('.template-minimal.login')
    if (!root) return

    const apply = () => {
      const inputs = root.querySelectorAll<HTMLInputElement>('input[type="password"]')
      inputs.forEach(ensureToggle)
      ensureRememberSessionOption(root)
      ensureBackLink(root)
    }

    apply()

    const observer = new MutationObserver(apply)
    observer.observe(root, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
