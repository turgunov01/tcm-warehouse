import { d as defineEventHandler, r as requireAdmin, h as readBody, f as createError, s as serviceClient } from '../../../_/nitro.mjs';
import { z } from 'zod';
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

const bodySchema = z.object({
  email: z.string().email(),
  username: z.string().trim().min(3).max(50).optional(),
  password: z.string().min(6),
  role: z.enum(["admin", "guard", "tenant"]),
  full_name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  zone_id: z.string().uuid().optional().nullable(),
  tenant_code: z.string().optional().nullable()
});
const createUser_post = defineEventHandler(async (event) => {
  await requireAdmin(event);
  const parsed = bodySchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0437\u0430\u043F\u0440\u043E\u0441\u0430" });
  }
  const payload = parsed.data;
  const admin = serviceClient();
  const username = (payload.username || payload.email.split("@")[0] || "").trim().toLowerCase();
  if (!username) {
    throw createError({ statusCode: 400, statusMessage: "\u041B\u043E\u0433\u0438\u043D \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" });
  }
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true,
    user_metadata: { username }
  });
  if (authError || !authData.user) {
    throw createError({
      statusCode: 400,
      statusMessage: (authError == null ? void 0 : authError.message) || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0432 Auth"
    });
  }
  const { error: profileError } = await admin.from("profiles").insert({
    id: authData.user.id,
    role: payload.role,
    email: payload.email.trim().toLowerCase(),
    username,
    full_name: payload.full_name || null,
    phone: payload.phone || null,
    zone_id: payload.zone_id || null,
    tenant_code: payload.tenant_code || null
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    throw createError({ statusCode: 400, statusMessage: profileError.message });
  }
  return { ok: true, id: authData.user.id };
});

export { createUser_post as default };
//# sourceMappingURL=create-user.post.mjs.map
