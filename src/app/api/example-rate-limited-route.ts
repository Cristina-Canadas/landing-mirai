/**
 * BONUS: Rate Limiting Implementation
 * 
 * Archivo de ejemplo para proteger rutas sensibles (login, signup, contacto)
 * Cópialo a: src/app/api/protected-route/route.ts
 * 
 * Uso:
 * POST /api/protected-route
 */

import { getRateLimitByIp } from '@/lib/security-utils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Ejemplo de ruta protegida con rate limiting
 * Máximo 5 intentos por IP cada 15 minutos
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar rate limit
    const { canProceed, ip, resetTime } = await getRateLimitByIp(
      5, // máximo 5 requests
      15 * 60 * 1000 // cada 15 minutos
    )

    if (!canProceed) {
      return NextResponse.json(
        {
          error: 'Demasiados intentos. Intenta de nuevo más tarde.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        },
        {
          status: 429, // Too Many Requests
          headers: {
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    // 2. Procesar el request (tu lógica aquí)
    const body = await request.json()

    // Validaciones básicas
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // 3. Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Request procesado correctamente',
        // En desarrollo, puedes devolver el IP (útil para testing)
        ...(process.env.NODE_ENV === 'development' && { ip }),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API Route] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * CONFIGURACIONES RECOMENDADAS POR TIPO DE RUTA:
 *
 * 1. Login/Admin:
 *    getRateLimitByIp(5, 15 * 60 * 1000) // 5 intentos per 15 min
 *
 * 2. Signup/Register:
 *    getRateLimitByIp(3, 60 * 60 * 1000) // 3 intentos per 1 hora
 *
 * 3. Password Reset:
 *    getRateLimitByIp(3, 60 * 60 * 1000) // 3 intentos per 1 hora
 *
 * 4. Contact Form:
 *    getRateLimitByIp(5, 60 * 1000) // 5 intentos per 1 minuto
 *
 * 5. API Público:
 *    getRateLimitByIp(100, 60 * 60 * 1000) // 100 intentos per 1 hora
 */
