import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useWarehouse } from './useWarehouse-DYq1S74A.mjs';
import 'tailwind-merge';
import './server.mjs';
import '../_/nitro.mjs';
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
import 'vue-router';
import '@vueuse/core';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './index-CyWm_zZC.mjs';
import '@iconify/utils/lib/css/icon';
import './nuxt-link-Bv1Nr2cZ.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notifications",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchNotifications, markNotificationRead } = useWarehouse();
    const rows = ref([]);
    const load = async () => {
      rows.value = await fetchNotifications();
    };
    const isRead = (row) => {
      var _a;
      return ((_a = row.notification_reads) == null ? void 0 : _a.length) > 0;
    };
    const markRead = async (row) => {
      await markNotificationRead(row.id);
      await load();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</h1><p class="text-sm text-slate-500">\u041E\u0431\u0449\u0438\u0435 \u0438 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F.</p></div><div class="space-y-3"><!--[-->`);
      ssrRenderList(unref(rows), (row) => {
        _push(ssrRenderComponent(_component_UCard, {
          key: row.id
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start justify-between gap-4"${_scopeId}><div class="space-y-1"${_scopeId}><p class="font-semibold"${_scopeId}>${ssrInterpolate(row.title)}</p><p class="text-sm text-slate-700"${_scopeId}>${ssrInterpolate(row.body)}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(new Date(row.created_at).toLocaleString())}</p></div>`);
              _push2(ssrRenderComponent(_component_UButton, {
                size: "xs",
                variant: isRead(row) ? "ghost" : "solid",
                label: isRead(row) ? "\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E" : "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C",
                onClick: ($event) => markRead(row)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                  createVNode("div", { class: "space-y-1" }, [
                    createVNode("p", { class: "font-semibold" }, toDisplayString(row.title), 1),
                    createVNode("p", { class: "text-sm text-slate-700" }, toDisplayString(row.body), 1),
                    createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(new Date(row.created_at).toLocaleString()), 1)
                  ]),
                  createVNode(_component_UButton, {
                    size: "xs",
                    variant: isRead(row) ? "ghost" : "solid",
                    label: isRead(row) ? "\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E" : "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C",
                    onClick: ($event) => markRead(row)
                  }, null, 8, ["variant", "label", "onClick"])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      if (!unref(rows).length) {
        _push(`<p class="text-sm text-slate-500">\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tenant/notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=notifications-BTwkWBsV.mjs.map
