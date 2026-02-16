import ExcelJS from 'exceljs'
import { readMultipartFormData } from 'h3'
import type * as XLSXType from 'xlsx'
import { requireAdmin, serviceClient } from '~/server/utils/auth'

interface RowInput {
  email?: string
  username?: string
  password?: string
  role?: 'admin' | 'guard' | 'tenant'
  full_name?: string
  phone?: string
  zone_name?: string
  tenant_code?: string
}

const cellToString = (value: ExcelJS.CellValue | undefined) => {
  if (value == null) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim()
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'object' && 'text' in value && typeof value.text === 'string') {
    return value.text.trim()
  }

  if (typeof value === 'object' && 'richText' in value && Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text).join('').trim()
  }

  return String(value).trim()
}

const genericCellToString = (value: unknown) => {
  if (value == null) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim()
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'object' && 'text' in value && typeof value.text === 'string') {
    return value.text.trim()
  }

  if (typeof value === 'object' && 'richText' in value && Array.isArray(value.richText)) {
    return value.richText.map((part: { text?: string }) => part.text || '').join('').trim()
  }

  return String(value).trim()
}

const normalizeHeader = (value: string) => value.trim().toLowerCase()

const parseXlsxRecords = async (buffer: Buffer) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer as any)
  const sheet = workbook.worksheets[0]

  if (!sheet) {
    throw new Error('Пустая книга')
  }

  const headerRow = sheet.getRow(1)
  const headerIndex = new Map<string, number>()

  headerRow.eachCell((cell, col) => {
    const key = normalizeHeader(cellToString(cell.value))
    if (key) {
      headerIndex.set(key, col)
    }
  })

  const rows: Record<string, string>[] = []

  for (let i = 2; i <= sheet.rowCount; i += 1) {
    const row = sheet.getRow(i)
    const record: Record<string, string> = {}

    headerIndex.forEach((col, key) => {
      record[key] = cellToString(row.getCell(col).value)
    })

    rows.push(record)
  }

  return rows
}

const parseXlsRecords = async (buffer: Buffer) => {
  const xlsxModule = await import('xlsx/xlsx.mjs')
  const XLSX = (xlsxModule.default || xlsxModule) as typeof XLSXType
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    throw new Error('Пустая книга')
  }

  const sheet = workbook.Sheets[sheetName]
  if (!sheet) {
    throw new Error('Пустая книга')
  }

  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false
  })

  return rawRows.map((rawRow) => {
    const record: Record<string, string> = {}

    for (const [key, value] of Object.entries(rawRow)) {
      const normalizedKey = normalizeHeader(key)
      if (!normalizedKey) {
        continue
      }
      record[normalizedKey] = genericCellToString(value)
    }

    return record
  })
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const form = await readMultipartFormData(event)

  const file = form?.find((part) => part.name === 'file')
  if (!file?.data) {
    throw createError({ statusCode: 400, statusMessage: 'Файл не передан' })
  }

  const filename = (file.filename || '').toLowerCase()
  const buffer = Buffer.from(file.data) as Buffer

  let records: Record<string, string>[] = []

  try {
    if (filename.endsWith('.xlsx')) {
      records = await parseXlsxRecords(buffer)
    } else if (filename.endsWith('.xls')) {
      records = await parseXlsRecords(buffer)
    } else {
      throw createError({ statusCode: 400, statusMessage: 'Неподдерживаемый формат файла. Используйте .xlsx или .xls' })
    }
  } catch (error: any) {
    if (error?.statusCode) {
      throw error
    }
    throw createError({ statusCode: 400, statusMessage: 'Не удалось прочитать Excel-файл' })
  }

  const rows: RowInput[] = []

  for (const record of records) {
    const email = record.email || ''

    if (!email) {
      continue
    }

    rows.push({
      email,
      username: record.username || undefined,
      password: record.password || undefined,
      role: (record.role?.toLowerCase() as RowInput['role']) || undefined,
      full_name: record.full_name || undefined,
      phone: record.phone || undefined,
      zone_name: record.zone_name || undefined,
      tenant_code: record.tenant_code || undefined
    })
  }

  const admin = serviceClient()
  const { data: zones } = await admin.from('zones').select('id, name')
  const zoneMap = new Map((zones ?? []).map((z) => [z.name.toLowerCase(), z.id]))

  let inserted = 0
  let failed = 0

  for (const row of rows) {
    const email = row.email?.trim().toLowerCase()
    const username = (row.username?.trim().toLowerCase() || email?.split('@')[0] || '').trim()
    const password = row.password?.trim() || 'ChangeMe123!'
    const role: 'admin' | 'guard' | 'tenant' = row.role && ['admin', 'guard', 'tenant'].includes(row.role) ? row.role : 'tenant'

    if (!email || !username) {
      failed += 1
      continue
    }

    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username }
    })

    if (authError || !authUser.user) {
      failed += 1
      continue
    }

    const zoneId = row.zone_name ? zoneMap.get(row.zone_name.toLowerCase()) || null : null

    const { error: profileError } = await admin.from('profiles').insert({
      id: authUser.user.id,
      role,
      email,
      username,
      full_name: row.full_name || null,
      phone: row.phone || null,
      zone_id: zoneId,
      tenant_code: row.tenant_code || null
    })

    if (profileError) {
      failed += 1
      await admin.auth.admin.deleteUser(authUser.user.id)
      continue
    }

    inserted += 1
  }

  return { inserted, failed }
})
