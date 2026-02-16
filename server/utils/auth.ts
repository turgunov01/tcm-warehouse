import type { H3Event } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database'

export const requireAdmin = async (event: H3Event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется авторизация' })
  }

  const client = await serverSupabaseClient<Database>(event)
  const { data: profile } = await client.from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Доступ запрещен' })
  }

  return user
}

export const serviceClient = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const serviceRole = config.supabaseServiceRoleKey as string

  if (!supabaseUrl || !serviceRole) {
    throw createError({ statusCode: 500, statusMessage: 'Отсутствует конфигурация сервисного ключа Supabase' })
  }

  return createClient<Database>(supabaseUrl, serviceRole, {
    auth: { persistSession: false }
  })
}
