import { d as defineEventHandler, r as requireAdmin, e as readMultipartFormData, f as createError, s as serviceClient } from '../../../_/nitro.mjs';
import ExcelJS from 'exceljs';
import '@supabase/supabase-js';
import '@supabase/ssr';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:fs';
import 'node:path';

const cellToString = (value) => {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object" && "text" in value && typeof value.text === "string") {
    return value.text.trim();
  }
  if (typeof value === "object" && "richText" in value && Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text).join("").trim();
  }
  return String(value).trim();
};
const genericCellToString = (value) => {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object" && "text" in value && typeof value.text === "string") {
    return value.text.trim();
  }
  if (typeof value === "object" && "richText" in value && Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text || "").join("").trim();
  }
  return String(value).trim();
};
const normalizeHeader = (value) => value.trim().toLowerCase();
const parseXlsxRecords = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) {
    throw new Error("\u041F\u0443\u0441\u0442\u0430\u044F \u043A\u043D\u0438\u0433\u0430");
  }
  const headerRow = sheet.getRow(1);
  const headerIndex = /* @__PURE__ */ new Map();
  headerRow.eachCell((cell, col) => {
    const key = normalizeHeader(cellToString(cell.value));
    if (key) {
      headerIndex.set(key, col);
    }
  });
  const rows = [];
  for (let i = 2; i <= sheet.rowCount; i += 1) {
    const row = sheet.getRow(i);
    const record = {};
    headerIndex.forEach((col, key) => {
      record[key] = cellToString(row.getCell(col).value);
    });
    rows.push(record);
  }
  return rows;
};
const parseXlsRecords = async (buffer) => {
  const xlsxModule = await import('xlsx/xlsx.mjs');
  const XLSX = xlsxModule.default || xlsxModule;
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("\u041F\u0443\u0441\u0442\u0430\u044F \u043A\u043D\u0438\u0433\u0430");
  }
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error("\u041F\u0443\u0441\u0442\u0430\u044F \u043A\u043D\u0438\u0433\u0430");
  }
  const rawRows = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false
  });
  return rawRows.map((rawRow) => {
    const record = {};
    for (const [key, value] of Object.entries(rawRow)) {
      const normalizedKey = normalizeHeader(key);
      if (!normalizedKey) {
        continue;
      }
      record[normalizedKey] = genericCellToString(value);
    }
    return record;
  });
};
const bulkUsers_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  await requireAdmin(event);
  const form = await readMultipartFormData(event);
  const file = form == null ? void 0 : form.find((part) => part.name === "file");
  if (!(file == null ? void 0 : file.data)) {
    throw createError({ statusCode: 400, statusMessage: "\u0424\u0430\u0439\u043B \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D" });
  }
  const filename = (file.filename || "").toLowerCase();
  const buffer = Buffer.from(file.data);
  let records = [];
  try {
    if (filename.endsWith(".xlsx")) {
      records = await parseXlsxRecords(buffer);
    } else if (filename.endsWith(".xls")) {
      records = await parseXlsRecords(buffer);
    } else {
      throw createError({ statusCode: 400, statusMessage: "\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0444\u0430\u0439\u043B\u0430. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 .xlsx \u0438\u043B\u0438 .xls" });
    }
  } catch (error) {
    if (error == null ? void 0 : error.statusCode) {
      throw error;
    }
    throw createError({ statusCode: 400, statusMessage: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C Excel-\u0444\u0430\u0439\u043B" });
  }
  const rows = [];
  for (const record of records) {
    const email = record.email || "";
    if (!email) {
      continue;
    }
    rows.push({
      email,
      username: record.username || void 0,
      password: record.password || void 0,
      role: ((_a = record.role) == null ? void 0 : _a.toLowerCase()) || void 0,
      full_name: record.full_name || void 0,
      phone: record.phone || void 0,
      zone_name: record.zone_name || void 0,
      tenant_code: record.tenant_code || void 0
    });
  }
  const admin = serviceClient();
  const { data: zones } = await admin.from("zones").select("id, name");
  const zoneMap = new Map((zones != null ? zones : []).map((z) => [z.name.toLowerCase(), z.id]));
  let inserted = 0;
  let failed = 0;
  for (const row of rows) {
    const email = (_b = row.email) == null ? void 0 : _b.trim().toLowerCase();
    const username = (((_c = row.username) == null ? void 0 : _c.trim().toLowerCase()) || (email == null ? void 0 : email.split("@")[0]) || "").trim();
    const password = ((_d = row.password) == null ? void 0 : _d.trim()) || "ChangeMe123!";
    const role = row.role && ["admin", "guard", "tenant"].includes(row.role) ? row.role : "tenant";
    if (!email || !username) {
      failed += 1;
      continue;
    }
    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username }
    });
    if (authError || !authUser.user) {
      failed += 1;
      continue;
    }
    const zoneId = row.zone_name ? zoneMap.get(row.zone_name.toLowerCase()) || null : null;
    const { error: profileError } = await admin.from("profiles").insert({
      id: authUser.user.id,
      role,
      email,
      username,
      full_name: row.full_name || null,
      phone: row.phone || null,
      zone_id: zoneId,
      tenant_code: row.tenant_code || null
    });
    if (profileError) {
      failed += 1;
      await admin.auth.admin.deleteUser(authUser.user.id);
      continue;
    }
    inserted += 1;
  }
  return { inserted, failed };
});

export { bulkUsers_post as default };
//# sourceMappingURL=bulk-users.post.mjs.map
