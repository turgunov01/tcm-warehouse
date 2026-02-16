import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import type { Database } from '~/types/database'
import { serviceClient } from '~/server/utils/auth'

const bodySchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректные данные запроса' })
  }

  const username = parsed.data.username.toLowerCase()
  const password = parsed.data.password

  const admin = serviceClient()
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('email')
    .ilike('username', username)
    .maybeSingle()

  if (profileError || !profile?.email) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный логин или пароль' })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, statusMessage: 'Отсутствует публичная конфигурация Supabase' })
  }

  const authClient = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })

  const { data, error } = await authClient.auth.signInWithPassword({
    email: profile.email,
    password
  })

  if (error || !data.session) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный логин или пароль' })
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  }
})
