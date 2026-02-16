import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { b as useSupabaseClient, d as useState, n as navigateTo } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';
import './nuxt-link-Bv1Nr2cZ.mjs';
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
import 'tailwind-merge';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './useFormGroup-DqE91r20.mjs';
import '@vueuse/core';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "bookings",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const selectedZone = useState("guard-zone", () => null);
    const { bookingStatusLabel } = useRuLabels();
    const rows = ref([]);
    const zoneName = ref("");
    const todayStart = () => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    };
    const todayEnd = () => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(23, 59, 59, 999);
      return d.toISOString();
    };
    const load = async () => {
      var _a, _b;
      if (!selectedZone.value) {
        await navigateTo("/guard");
        return;
      }
      const [zoneResp, bookingsResp] = await Promise.all([
        supabase.from("zones").select("name").eq("id", selectedZone.value).single(),
        supabase.from("bookings").select("*").eq("zone_id", selectedZone.value).gte("requested_datetime", todayStart()).lte("requested_datetime", todayEnd()).in("status", ["approved", "arrived", "left", "completed"]).order("requested_datetime")
      ]);
      zoneName.value = ((_a = zoneResp.data) == null ? void 0 : _a.name) || "";
      rows.value = (_b = bookingsResp.data) != null ? _b : [];
    };
    const updateStatus = async (row, status) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", row.id);
      if (!error) {
        await load();
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_1;
      const _component_UCard = __nuxt_component_0$1;
      const _component_UTable = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold">\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F</h1><p class="text-sm text-slate-500">\u0417\u043E\u043D\u0430: ${ssrInterpolate(unref(zoneName) || "\u041D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u0430")}</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        label: "\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u043E\u043D\u0443",
        variant: "outline",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/guard")
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              rows: unref(rows),
              columns: [
                { key: "requested_datetime", label: "\u0421\u043B\u043E\u0442" },
                { key: "driver_name", label: "\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C" },
                { key: "car_plate_text", label: "\u041D\u043E\u043C\u0435\u0440" },
                { key: "status", label: "\u0421\u0442\u0430\u0442\u0443\u0441" },
                { key: "overtime_minutes", label: "\u041F\u0435\u0440\u0435\u0440\u0430\u0431\u043E\u0442\u043A\u0430 (\u043C\u0438\u043D)" },
                { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
              ]
            }, {
              "requested_datetime-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(new Date(row.requested_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(new Date(row.requested_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })), 1)
                  ];
                }
              }),
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(bookingStatusLabel)(row.status))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(bookingStatusLabel)(row.status)), 1)
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "2xs",
                    label: "\u041F\u0440\u0438\u0431\u044B\u043B",
                    disabled: row.status !== "approved",
                    onClick: ($event) => updateStatus(row, "arrived")
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "2xs",
                    label: "\u0412\u044B\u0435\u0445\u0430\u043B",
                    disabled: row.status !== "arrived",
                    onClick: ($event) => updateStatus(row, "left")
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "2xs",
                    label: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E",
                    disabled: row.status !== "left",
                    onClick: ($event) => updateStatus(row, "completed")
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex gap-1" }, [
                      createVNode(_component_UButton, {
                        size: "2xs",
                        label: "\u041F\u0440\u0438\u0431\u044B\u043B",
                        disabled: row.status !== "approved",
                        onClick: ($event) => updateStatus(row, "arrived")
                      }, null, 8, ["disabled", "onClick"]),
                      createVNode(_component_UButton, {
                        size: "2xs",
                        label: "\u0412\u044B\u0435\u0445\u0430\u043B",
                        disabled: row.status !== "arrived",
                        onClick: ($event) => updateStatus(row, "left")
                      }, null, 8, ["disabled", "onClick"]),
                      createVNode(_component_UButton, {
                        size: "2xs",
                        label: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E",
                        disabled: row.status !== "left",
                        onClick: ($event) => updateStatus(row, "completed")
                      }, null, 8, ["disabled", "onClick"])
                    ])
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
                  { key: "requested_datetime", label: "\u0421\u043B\u043E\u0442" },
                  { key: "driver_name", label: "\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C" },
                  { key: "car_plate_text", label: "\u041D\u043E\u043C\u0435\u0440" },
                  { key: "status", label: "\u0421\u0442\u0430\u0442\u0443\u0441" },
                  { key: "overtime_minutes", label: "\u041F\u0435\u0440\u0435\u0440\u0430\u0431\u043E\u0442\u043A\u0430 (\u043C\u0438\u043D)" },
                  { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
                ]
              }, {
                "requested_datetime-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(new Date(row.requested_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })), 1)
                ]),
                "status-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(unref(bookingStatusLabel)(row.status)), 1)
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-1" }, [
                    createVNode(_component_UButton, {
                      size: "2xs",
                      label: "\u041F\u0440\u0438\u0431\u044B\u043B",
                      disabled: row.status !== "approved",
                      onClick: ($event) => updateStatus(row, "arrived")
                    }, null, 8, ["disabled", "onClick"]),
                    createVNode(_component_UButton, {
                      size: "2xs",
                      label: "\u0412\u044B\u0435\u0445\u0430\u043B",
                      disabled: row.status !== "arrived",
                      onClick: ($event) => updateStatus(row, "left")
                    }, null, 8, ["disabled", "onClick"]),
                    createVNode(_component_UButton, {
                      size: "2xs",
                      label: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E",
                      disabled: row.status !== "left",
                      onClick: ($event) => updateStatus(row, "completed")
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 1
              }, 8, ["rows"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/guard/bookings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=bookings-XWALDPiq.mjs.map
