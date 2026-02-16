import { d as defineEventHandler, j as serverSupabaseUser, f as createError, k as serverSupabaseClient, l as getQuery, m as setHeader } from '../../_/nitro.mjs';
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

const export_get = defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F" });
  }
  const client = await serverSupabaseClient(event);
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).single();
  if (!profile) {
    throw createError({ statusCode: 403, statusMessage: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
  }
  const query = getQuery(event);
  let q = client.from("bookings").select("id, requested_datetime, status, created_at, updated_at, logged_in, logged_out, driver_name, driver_passport_front, car_plate_text, tenant_id").order("requested_datetime", { ascending: false });
  if (profile.role === "tenant") {
    q = q.eq("tenant_id", user.id);
  }
  if (typeof query.from === "string") {
    q = q.gte("requested_datetime", query.from);
  }
  if (typeof query.to === "string") {
    q = q.lte("requested_datetime", query.to);
  }
  const { data, error } = await q;
  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message });
  }
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F");
  const columns = [
    "id",
    "\u0434\u0430\u0442\u0430",
    "\u0441\u0442\u0430\u0442\u0443\u0441",
    "\u0441\u043E\u0437\u0434\u0430\u043D\u043E",
    "\u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E",
    "\u0432\u0445\u043E\u0434",
    "\u0432\u044B\u0445\u043E\u0434",
    "\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C",
    "\u043F\u0430\u0441\u043F\u043E\u0440\u0442_\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F",
    "\u043D\u043E\u043C\u0435\u0440_\u0430\u0432\u0442\u043E"
  ];
  sheet.addRow(columns);
  for (const row of data != null ? data : []) {
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
    ]);
  }
  const buffer = await workbook.xlsx.writeBuffer();
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setHeader(event, "Content-Disposition", 'attachment; filename="bookings-export.xlsx"');
  return buffer;
});

export { export_get as default };
//# sourceMappingURL=export.get.mjs.map
