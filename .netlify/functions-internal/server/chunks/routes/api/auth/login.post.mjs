import { d as defineEventHandler, h as readBody, f as createError, s as serviceClient, i as useRuntimeConfig } from '../../../_/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
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
  username: z.string().trim().min(1),
  password: z.string().min(1)
});
const login_post = defineEventHandler(async (event) => {
  const parsed = bodySchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0437\u0430\u043F\u0440\u043E\u0441\u0430" });
  }
  const username = parsed.data.username.toLowerCase();
  const password = parsed.data.password;
  const admin = serviceClient();
  const { data: profile, error: profileError } = await admin.from("profiles").select("email").ilike("username", username).maybeSingle();
  if (profileError || !(profile == null ? void 0 : profile.email)) {
    throw createError({ statusCode: 401, statusMessage: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
  }
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseKey;
  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, statusMessage: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u0430\u044F \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044F Supabase" });
  }
  const authClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const { data, error } = await authClient.auth.signInWithPassword({
    email: profile.email,
    password
  });
  if (error || !data.session) {
    throw createError({ statusCode: 401, statusMessage: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
  }
  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
