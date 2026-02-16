import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_6 } from './SelectMenu-CepcR2XP.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, isRef, unref, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useSupabaseClient } from './server.mjs';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';
import 'tailwind-merge';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import './useFormGroup-DqE91r20.mjs';
import '@vueuse/core';
import '@tanstack/vue-virtual';
import './active-element-history-CsQcsyjA.mjs';
import './nuxt-link-Bv1Nr2cZ.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "audit",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const { actionLabel, tableLabel } = useRuLabels();
    const rows = ref([]);
    const tableFilter = ref("");
    const actionFilter = ref("");
    const load = async () => {
      let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(300);
      if (tableFilter.value) {
        query = query.eq("table_name", tableFilter.value);
      }
      if (actionFilter.value) {
        query = query.eq("action", actionFilter.value);
      }
      const { data } = await query;
      rows.value = data != null ? data : [];
    };
    watch([tableFilter, actionFilter], load);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_USelectMenu = __nuxt_component_6;
      const _component_UButton = __nuxt_component_1;
      const _component_UTable = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u0416\u0443\u0440\u043D\u0430\u043B \u0430\u0443\u0434\u0438\u0442\u0430</h1><p class="text-sm text-slate-500">\u041E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u0432 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u0445 \u0442\u0430\u0431\u043B\u0438\u0446\u0430\u0445.</p></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-3 md:grid-cols-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u0422\u0430\u0431\u043B\u0438\u0446\u0430" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(tableFilter),
                    "onUpdate:modelValue": ($event) => isRef(tableFilter) ? tableFilter.value = $event : null,
                    placeholder: "bookings"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(tableFilter),
                      "onUpdate:modelValue": ($event) => isRef(tableFilter) ? tableFilter.value = $event : null,
                      placeholder: "bookings"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(actionFilter),
                    "onUpdate:modelValue": ($event) => isRef(actionFilter) ? actionFilter.value = $event : null,
                    options: ["", "INSERT", "UPDATE", "DELETE"]
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(actionFilter),
                      "onUpdate:modelValue": ($event) => isRef(actionFilter) ? actionFilter.value = $event : null,
                      options: ["", "INSERT", "UPDATE", "DELETE"]
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex items-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
              onClick: load
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-3 md:grid-cols-3" }, [
                createVNode(_component_UFormGroup, { label: "\u0422\u0430\u0431\u043B\u0438\u0446\u0430" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(tableFilter),
                      "onUpdate:modelValue": ($event) => isRef(tableFilter) ? tableFilter.value = $event : null,
                      placeholder: "bookings"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, { label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435" }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(actionFilter),
                      "onUpdate:modelValue": ($event) => isRef(actionFilter) ? actionFilter.value = $event : null,
                      options: ["", "INSERT", "UPDATE", "DELETE"]
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex items-end" }, [
                  createVNode(_component_UButton, {
                    label: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
                    onClick: load
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              rows: unref(rows),
              columns: [
                { key: "created_at", label: "\u0412\u0440\u0435\u043C\u044F" },
                { key: "table_name", label: "\u0422\u0430\u0431\u043B\u0438\u0446\u0430" },
                { key: "action", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435" },
                { key: "record_id", label: "\u0417\u0430\u043F\u0438\u0441\u044C" },
                { key: "actor_id", label: "\u041A\u0442\u043E \u0438\u0437\u043C\u0435\u043D\u0438\u043B" }
              ]
            }, {
              "created_at-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(new Date(row.created_at).toLocaleString())}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(new Date(row.created_at).toLocaleString()), 1)
                  ];
                }
              }),
              "table_name-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(tableLabel)(row.table_name))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(tableLabel)(row.table_name)), 1)
                  ];
                }
              }),
              "action-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(actionLabel)(row.action))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(actionLabel)(row.action)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                rows: unref(rows),
                columns: [
                  { key: "created_at", label: "\u0412\u0440\u0435\u043C\u044F" },
                  { key: "table_name", label: "\u0422\u0430\u0431\u043B\u0438\u0446\u0430" },
                  { key: "action", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435" },
                  { key: "record_id", label: "\u0417\u0430\u043F\u0438\u0441\u044C" },
                  { key: "actor_id", label: "\u041A\u0442\u043E \u0438\u0437\u043C\u0435\u043D\u0438\u043B" }
                ]
              }, {
                "created_at-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(new Date(row.created_at).toLocaleString()), 1)
                ]),
                "table_name-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(unref(tableLabel)(row.table_name)), 1)
                ]),
                "action-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(unref(actionLabel)(row.action)), 1)
                ]),
                _: 2
              }, 1032, ["rows"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/audit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=audit-D_KIVzfK.mjs.map
