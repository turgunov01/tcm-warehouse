import { _ as __nuxt_component_0 } from './Alert-CEW1Bd40.mjs';
import { _ as _sfc_main$1 } from './BookingFilters-D2T0XxJR.mjs';
import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_3 } from './Skeleton-D2TlUZAi.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { _ as __nuxt_component_8$1 } from './Badge-DxNY05Lj.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { defineComponent, ref, watch, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useSupabaseClient } from './server.mjs';
import { u as useWarehouse } from './useWarehouse-DYq1S74A.mjs';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';
import './SelectMenu-CepcR2XP.mjs';
import 'tailwind-merge';
import '@tanstack/vue-virtual';
import './active-element-history-CsQcsyjA.mjs';
import '@vueuse/core';
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
import './Input-CoU3nx0Q.mjs';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './nuxt-link-Bv1Nr2cZ.mjs';
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
    const { fetchBookings } = useWarehouse();
    const { bookingStatusLabel } = useRuLabels();
    const loading = ref(false);
    const rows = ref([]);
    const notice = ref("");
    const filters = ref({
      from: "",
      to: "",
      statuses: []
    });
    const approvingId = ref(null);
    const removingId = ref(null);
    const tableColumns = [
      { key: "requested_datetime", label: "\u0417\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043E" },
      { key: "status", label: "\u0421\u0442\u0430\u0442\u0443\u0441" },
      { key: "driver_name", label: "\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C" },
      { key: "car_plate_text", label: "\u041D\u043E\u043C\u0435\u0440" },
      { key: "tenant", label: "\u0410\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440" },
      { key: "zone_id", label: "\u0417\u043E\u043D\u0430" },
      { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
    ];
    const refresh = async () => {
      loading.value = true;
      rows.value = await fetchBookings({
        from: filters.value.from ? `${filters.value.from}T00:00:00` : void 0,
        to: filters.value.to ? `${filters.value.to}T23:59:59` : void 0,
        statuses: filters.value.statuses
      });
      loading.value = false;
    };
    const approveBooking = async (row) => {
      approvingId.value = row.id;
      const { error } = await supabase.from("bookings").update({ status: "approved" }).eq("id", row.id);
      notice.value = error ? error.message : "\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043E.";
      approvingId.value = null;
      await refresh();
    };
    const removeBooking = async (row) => {
      const ok = confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435? \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C.");
      if (!ok) {
        return;
      }
      removingId.value = row.id;
      const { error } = await supabase.from("bookings").delete().eq("id", row.id);
      notice.value = error ? error.message : "\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u043E.";
      removingId.value = null;
      await refresh();
    };
    watch(filters, refresh, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = __nuxt_component_0;
      const _component_BookingFilters = _sfc_main$1;
      const _component_UCard = __nuxt_component_0$1;
      const _component_USkeleton = __nuxt_component_3;
      const _component_UTable = __nuxt_component_8;
      const _component_UBadge = __nuxt_component_8$1;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F</h1><p class="text-sm text-slate-500">\u041E\u0434\u043E\u0431\u0440\u0435\u043D\u0438\u0435 \u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u044F\u0432\u043E\u043A \u0430\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440\u043E\u0432.</p></div>`);
      if (unref(notice)) {
        _push(ssrRenderComponent(_component_UAlert, {
          title: unref(notice),
          color: "primary",
          variant: "subtle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_BookingFilters, {
        modelValue: unref(filters),
        "onUpdate:modelValue": ($event) => isRef(filters) ? filters.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(loading)) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_component_USkeleton, { class: "h-40" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(ssrRenderComponent(_component_UTable, {
                rows: unref(rows),
                columns: tableColumns
              }, {
                "requested_datetime-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(new Date(row.requested_datetime).toLocaleString())}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(new Date(row.requested_datetime).toLocaleString()), 1)
                    ];
                  }
                }),
                "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UBadge, {
                      label: unref(bookingStatusLabel)(row.status),
                      color: "gray",
                      variant: "subtle"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UBadge, {
                        label: unref(bookingStatusLabel)(row.status),
                        color: "gray",
                        variant: "subtle"
                      }, null, 8, ["label"])
                    ];
                  }
                }),
                "tenant-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  var _a, _b;
                  if (_push3) {
                    _push3(`${ssrInterpolate(((_a = row.profiles) == null ? void 0 : _a.full_name) || row.tenant_id)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(((_b = row.profiles) == null ? void 0 : _b.full_name) || row.tenant_id), 1)
                    ];
                  }
                }),
                "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UButton, {
                      size: "xs",
                      label: "\u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C",
                      loading: unref(approvingId) === row.id,
                      disabled: row.status === "approved" || unref(removingId) === row.id,
                      onClick: ($event) => approveBooking(row)
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UButton, {
                      size: "xs",
                      label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
                      color: "red",
                      variant: "outline",
                      loading: unref(removingId) === row.id,
                      disabled: unref(approvingId) === row.id,
                      onClick: ($event) => removeBooking(row)
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex gap-2" }, [
                        createVNode(_component_UButton, {
                          size: "xs",
                          label: "\u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C",
                          loading: unref(approvingId) === row.id,
                          disabled: row.status === "approved" || unref(removingId) === row.id,
                          onClick: ($event) => approveBooking(row)
                        }, null, 8, ["loading", "disabled", "onClick"]),
                        createVNode(_component_UButton, {
                          size: "xs",
                          label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
                          color: "red",
                          variant: "outline",
                          loading: unref(removingId) === row.id,
                          disabled: unref(approvingId) === row.id,
                          onClick: ($event) => removeBooking(row)
                        }, null, 8, ["loading", "disabled", "onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              unref(loading) ? (openBlock(), createBlock("div", { key: 0 }, [
                createVNode(_component_USkeleton, { class: "h-40" })
              ])) : (openBlock(), createBlock(_component_UTable, {
                key: 1,
                rows: unref(rows),
                columns: tableColumns
              }, {
                "requested_datetime-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(new Date(row.requested_datetime).toLocaleString()), 1)
                ]),
                "status-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    label: unref(bookingStatusLabel)(row.status),
                    color: "gray",
                    variant: "subtle"
                  }, null, 8, ["label"])
                ]),
                "tenant-data": withCtx(({ row }) => {
                  var _a;
                  return [
                    createTextVNode(toDisplayString(((_a = row.profiles) == null ? void 0 : _a.full_name) || row.tenant_id), 1)
                  ];
                }),
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      label: "\u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C",
                      loading: unref(approvingId) === row.id,
                      disabled: row.status === "approved" || unref(removingId) === row.id,
                      onClick: ($event) => approveBooking(row)
                    }, null, 8, ["loading", "disabled", "onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
                      color: "red",
                      variant: "outline",
                      loading: unref(removingId) === row.id,
                      disabled: unref(approvingId) === row.id,
                      onClick: ($event) => removeBooking(row)
                    }, null, 8, ["loading", "disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1032, ["rows"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/bookings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=bookings-IuJXEXS4.mjs.map
