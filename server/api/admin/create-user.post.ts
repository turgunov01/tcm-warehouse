import { z } from 'zod'
import { requireAdmin, serviceClient } from '~/server/utils/auth'

const bodySchema = z.object({
  email: z.string().email(),
  username: z.string().trim().min(3).max(50).optional(),
  password: z.string().min(6),
  role: z.enum(['admin', 'guard', 'tenant']),
  full_name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  zone_id: z.string().uuid().optional().nullable(),
  tenant_code: z.string().optional().nullable()
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректные данные запроса' })
  }

  const payload = parsed.data
  const admin = serviceClient()
  const username = (payload.username || payload.email.split('@')[0] || '').trim().toLowerCase()

  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'Логин обязателен' })
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true,
    user_metadata: { username }
  })

  if (authError || !authData.user) {
    throw createError({
      statusCode: 400,
      statusMessage: authError?.message || 'Не удалось создать пользователя в Auth'
    })
  }

  const { error: profileError } = await admin.from('profiles').insert({
    id: authData.user.id,
    role: payload.role,
    email: payload.email.trim().toLowerCase(),
    username,
    full_name: payload.full_name || null,
    phone: payload.phone || null,
    zone_id: payload.zone_id || null,
    tenant_code: payload.tenant_code || null
  })

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id)
    throw createError({ statusCode: 400, statusMessage: profileError.message })
  }

  return { ok: true, id: authData.user.id }
})
