import { z } from 'zod'
import { requireAdmin, serviceClient } from '~/server/utils/auth'

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== 'string') {
    return value
  }
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

const nullableStringSchema = z.preprocess((value) => {
  if (value === null) {
    return null
  }
  if (typeof value !== 'string') {
    return value
  }
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}, z.string().nullable().optional())

const bodySchema = z.object({
  id: z.string().uuid(),
  username: z.preprocess(emptyStringToUndefined, z.string().trim().min(3).max(50).optional()),
  email: z.preprocess(emptyStringToUndefined, z.string().trim().email().optional()),
  password: z.preprocess(emptyStringToUndefined, z.string().min(6).optional()),
  role: z.enum(['admin', 'guard', 'tenant']).optional(),
  full_name: nullableStringSchema,
  phone: nullableStringSchema,
  zone_id: z.string().uuid().nullable().optional(),
  tenant_code: nullableStringSchema
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request payload' })
  }

  const payload = parsed.data
  const admin = serviceClient()

  const profilePatch: Record<string, any> = {}
  const authPatch: Record<string, any> = {}

  if (payload.username !== undefined) {
    const username = payload.username.trim().toLowerCase()
    profilePatch.username = username
    authPatch.user_metadata = { username }
  }

  if (payload.email !== undefined) {
    const email = payload.email.trim().toLowerCase()
    profilePatch.email = email
    authPatch.email = email
    authPatch.email_confirm = true
  }

  if (payload.password !== undefined) {
    authPatch.password = payload.password
  }

  if (payload.role !== undefined) {
    profilePatch.role = payload.role
  }

  if (payload.full_name !== undefined) {
    profilePatch.full_name = payload.full_name
  }

  if (payload.phone !== undefined) {
    profilePatch.phone = payload.phone
  }

  if (payload.zone_id !== undefined) {
    profilePatch.zone_id = payload.zone_id
  }

  if (payload.tenant_code !== undefined) {
    profilePatch.tenant_code = payload.tenant_code
  }

  if (Object.keys(authPatch).length > 0) {
    const { error: authError } = await admin.auth.admin.updateUserById(payload.id, authPatch)
    if (authError) {
      throw createError({ statusCode: 400, statusMessage: authError.message })
    }
  }

  if (Object.keys(profilePatch).length > 0) {
    const { error: profileError } = await admin.from('profiles').update(profilePatch).eq('id', payload.id)
    if (profileError) {
      throw createError({ statusCode: 400, statusMessage: profileError.message })
    }
  }

  return { ok: true }
})
