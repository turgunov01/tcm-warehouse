import { _ as _sfc_main$1$1, a as _sfc_main$2 } from './StatusPieChart-CwlzjMLK.mjs';
import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, isRef, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';
import { _ as _sfc_main$3 } from './BookingFilters-D2T0XxJR.mjs';
import { _ as __nuxt_component_3 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_6 } from './SelectMenu-CepcR2XP.mjs';
import { _ as __nuxt_component_3$1, a as _sfc_main$1$2, b as _sfc_main$4 } from './BookingCalendar-BWxIqXQn.mjs';
import { _ as __nuxt_component_3$2 } from './Skeleton-D2TlUZAi.mjs';
import { b as useSupabaseClient } from './server.mjs';
import { u as useWarehouse } from './useWarehouse-DYq1S74A.mjs';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'vue-chartjs';
import 'chart.js';
import 'tailwind-merge';
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
import './useFormGroup-DqE91r20.mjs';
import '@vueuse/core';
import '@tanstack/vue-virtual';
import './active-element-history-CsQcsyjA.mjs';
import './Table-BxGkz4HY.mjs';
import './Badge-DxNY05Lj.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ActivityFeed",
  __ssrInlineRender: true,
  props: {
    items: {},
    showMoreTo: { default: "" },
    showMoreLabel: { default: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0435" }
  },
  setup(__props) {
    const { actionLabel, tableLabel } = useRuLabels();
    const feed = ref(null);
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_1;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold"${_scopeId}>\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold" }, "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(props.items, (item) => {
              _push2(`<div class="activity-item rounded border border-[#eeeeee] p-3"${_scopeId}><div class="flex items-center justify-between gap-2"${_scopeId}><p class="text-sm text-slate-900"${_scopeId}>${ssrInterpolate(unref(actionLabel)(item.action))}: ${ssrInterpolate(unref(tableLabel)(item.table_name))}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(new Date(item.created_at).toLocaleString())}</p></div></div>`);
            });
            _push2(`<!--]-->`);
            if (!props.items.length) {
              _push2(`<p class="text-sm text-slate-500"${_scopeId}>\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (props.showMoreTo) {
              _push2(`<div class="mt-3 flex justify-end"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                size: "xs",
                variant: "outline",
                color: "white",
                label: props.showMoreLabel,
                to: props.showMoreTo
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", {
                ref_key: "feed",
                ref: feed,
                class: "space-y-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(props.items, (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.id,
                    class: "activity-item rounded border border-[#eeeeee] p-3"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between gap-2" }, [
                      createVNode("p", { class: "text-sm text-slate-900" }, toDisplayString(unref(actionLabel)(item.action)) + ": " + toDisplayString(unref(tableLabel)(item.table_name)), 1),
                      createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(new Date(item.created_at).toLocaleString()), 1)
                    ])
                  ]);
                }), 128)),
                !props.items.length ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-slate-500"
                }, "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438.")) : createCommentVNode("", true)
              ], 512),
              props.showMoreTo ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-3 flex justify-end"
              }, [
                createVNode(_component_UButton, {
                  size: "xs",
                  variant: "outline",
                  color: "white",
                  label: props.showMoreLabel,
                  to: props.showMoreTo
                }, null, 8, ["label", "to"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ActivityFeed.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const { fetchBookings, fetchRecentActivity } = useWarehouse();
    const { bookingStatusLabel } = useRuLabels();
    const loading = ref(true);
    const viewMode = ref("table");
    const filters = ref({
      from: "",
      to: "",
      statuses: []
    });
    const bookings = ref([]);
    const tenants = ref([]);
    const selectedTenants = ref([]);
    const activity = ref([]);
    const statusCounts = computed(() => {
      const map = {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0
      };
      for (const row of bookings.value) {
        if (map[row.status] !== void 0) {
          map[row.status] += 1;
        }
      }
      return map;
    });
    const pieLabels = computed(() => Object.keys(statusCounts.value).map((status) => bookingStatusLabel(status)));
    const pieValues = computed(() => Object.values(statusCounts.value));
    const filteredBookings = computed(() => {
      if (!selectedTenants.value.length) {
        return bookings.value;
      }
      return bookings.value.filter((row) => selectedTenants.value.includes(row.tenant_id));
    });
    const refresh = async () => {
      loading.value = true;
      bookings.value = await fetchBookings({
        from: filters.value.from ? `${filters.value.from}T00:00:00` : void 0,
        to: filters.value.to ? `${filters.value.to}T23:59:59` : void 0,
        statuses: filters.value.statuses
      });
      activity.value = await fetchRecentActivity(5);
      loading.value = false;
    };
    watch(filters, refresh, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardStatCard = _sfc_main$1$1;
      const _component_StatusPieChart = _sfc_main$2;
      const _component_ActivityFeed = _sfc_main$1;
      const _component_BookingFilters = _sfc_main$3;
      const _component_UCard = __nuxt_component_0$1;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_USelectMenu = __nuxt_component_6;
      const _component_UButtonGroup = __nuxt_component_3$1;
      const _component_UButton = __nuxt_component_1;
      const _component_USkeleton = __nuxt_component_3$2;
      const _component_BookingTable = _sfc_main$1$2;
      const _component_BookingCalendar = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u041F\u0430\u043D\u0435\u043B\u044C \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430</h1><p class="text-sm text-slate-500">\u041E\u0431\u0437\u043E\u0440 \u0441\u043A\u043B\u0430\u0434\u0430, \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0439 \u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438.</p></div><div class="card-grid">`);
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "\u0412 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0438",
        value: unref(statusCounts).pending,
        tone: "warning"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "\u041E\u0434\u043E\u0431\u0440\u0435\u043D\u043E",
        value: unref(statusCounts).approved,
        tone: "success"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E",
        value: unref(statusCounts).rejected,
        tone: "danger"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E",
        value: unref(statusCounts).completed
      }, null, _parent));
      _push(`</div><div class="grid gap-4 xl:grid-cols-[2fr_1fr]">`);
      _push(ssrRenderComponent(_component_StatusPieChart, {
        title: "\u0420\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u0432",
        labels: unref(pieLabels),
        values: unref(pieValues)
      }, null, _parent));
      _push(ssrRenderComponent(_component_ActivityFeed, {
        items: unref(activity),
        "show-more-to": "/admin/audit"
      }, null, _parent));
      _push(`</div><div class="grid gap-4">`);
      _push(ssrRenderComponent(_component_BookingFilters, {
        modelValue: unref(filters),
        "onUpdate:modelValue": ($event) => isRef(filters) ? filters.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0430\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440\u0443",
              class: "w-full md:max-w-md"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(selectedTenants),
                    "onUpdate:modelValue": ($event) => isRef(selectedTenants) ? selectedTenants.value = $event : null,
                    options: unref(tenants),
                    "option-attribute": "full_name",
                    "value-attribute": "id",
                    multiple: "",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(selectedTenants),
                      "onUpdate:modelValue": ($event) => isRef(selectedTenants) ? selectedTenants.value = $event : null,
                      options: unref(tenants),
                      "option-attribute": "full_name",
                      "value-attribute": "id",
                      multiple: "",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButtonGroup, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    label: "\u0422\u0430\u0431\u043B\u0438\u0446\u0430",
                    variant: unref(viewMode) === "table" ? "solid" : "outline",
                    onClick: ($event) => viewMode.value = "table"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    label: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",
                    variant: unref(viewMode) === "calendar" ? "solid" : "outline",
                    onClick: ($event) => viewMode.value = "calendar"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      label: "\u0422\u0430\u0431\u043B\u0438\u0446\u0430",
                      variant: unref(viewMode) === "table" ? "solid" : "outline",
                      onClick: ($event) => viewMode.value = "table"
                    }, null, 8, ["variant", "onClick"]),
                    createVNode(_component_UButton, {
                      label: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",
                      variant: unref(viewMode) === "calendar" ? "solid" : "outline",
                      onClick: ($event) => viewMode.value = "calendar"
                    }, null, 8, ["variant", "onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between" }, [
                createVNode(_component_UFormGroup, {
                  label: "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0430\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440\u0443",
                  class: "w-full md:max-w-md"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(selectedTenants),
                      "onUpdate:modelValue": ($event) => isRef(selectedTenants) ? selectedTenants.value = $event : null,
                      options: unref(tenants),
                      "option-attribute": "full_name",
                      "value-attribute": "id",
                      multiple: "",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UButtonGroup, null, {
                  default: withCtx(() => [
                    createVNode(_component_UButton, {
                      label: "\u0422\u0430\u0431\u043B\u0438\u0446\u0430",
                      variant: unref(viewMode) === "table" ? "solid" : "outline",
                      onClick: ($event) => viewMode.value = "table"
                    }, null, 8, ["variant", "onClick"]),
                    createVNode(_component_UButton, {
                      label: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",
                      variant: unref(viewMode) === "calendar" ? "solid" : "outline",
                      onClick: ($event) => viewMode.value = "calendar"
                    }, null, 8, ["variant", "onClick"])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading)) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-44" }, null, _parent));
        _push(`</div>`);
      } else if (unref(viewMode) === "table") {
        _push(ssrRenderComponent(_component_BookingTable, { rows: unref(filteredBookings) }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_BookingCalendar, { rows: unref(filteredBookings) }, null, _parent));
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BhJ-SN2h.mjs.map
