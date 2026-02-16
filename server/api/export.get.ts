import ExcelJS from 'exceljs'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется авторизация' })
  }

  const client = await serverSupabaseClient<Database>(event)
  const { data: profile } = await client.from('profiles').select('role').eq('id', user.id).single()
  if (!profile) {
    throw createError({ statusCode: 403, statusMessage: 'Доступ запрещен' })
  }

  const query = getQuery(event)
  let q = client
    .from('bookings')
    .select('id, requested_datetime, status, created_at, updated_at, logged_in, logged_out, driver_name, driver_passport_front, car_plate_text, tenant_id')
    .order('requested_datetime', { ascending: false })

  if (profile.role === 'tenant') {
    q = q.eq('tenant_id', user.id)
  }

  if (typeof query.from === 'string') {
    q = q.gte('requested_datetime', query.from)
  }
  if (typeof query.to === 'string') {
    q = q.lte('requested_datetime', query.to)
  }

  const { data, error } = await q
  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Бронирования')

  const columns = [
    'id',
    'дата',
    'статус',
    'создано',
    'обновлено',
    'вход',
    'выход',
    'водитель',
    'паспорт_водителя',
    'номер_авто'
  ]

  sheet.addRow(columns)

  for (const row of data ?? []) {
    sheet.addRow([
      row.id,
      row.requested_datetime,
      row.status,
      row.created_at,
      row.updated_at,
      row.logged_in,
      row.logged_out,
      row.driver_name,
      row.driver_passport_front,
      row.car_plate_text
    ])
  }

  const buffer = await workbook.xlsx.writeBuffer()
  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', 'attachment; filename="bookings-export.xlsx"')

  return buffer
})
