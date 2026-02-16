import { _ as _sfc_main$1, a as _sfc_main$2 } from './StatusPieChart-CwlzjMLK.mjs';
import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_8 } from './Badge-DxNY05Lj.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { c as useAuthRbac } from './server.mjs';
import { u as useWarehouse } from './useWarehouse-DYq1S74A.mjs';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'vue-chartjs';
import 'chart.js';
import 'tailwind-merge';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuthRbac();
    const { fetchBookings, fetchTenantDebt } = useWarehouse();
    const { bookingStatusLabel } = useRuLabels();
    const bookings = ref([]);
    const debt = ref(0);
    const lastBookings = computed(() => bookings.value.slice(0, 6));
    const statusMap = computed(() => {
      const map = {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0
      };
      for (const b of bookings.value) {
        if (map[b.status] !== void 0) map[b.status] += 1;
      }
      return map;
    });
    const load = async () => {
      var _a;
      const tenantId = (_a = user.value) == null ? void 0 : _a.id;
      if (!tenantId) {
        bookings.value = [];
        debt.value = 0;
        return;
      }
      bookings.value = await fetchBookings({ tenantIds: [tenantId] });
      debt.value = await fetchTenantDebt(tenantId);
    };
    watch(
      () => {
        var _a;
        return (_a = user.value) == null ? void 0 : _a.id;
      },
      () => {
        load();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardStatCard = _sfc_main$1;
      const _component_StatusPieChart = _sfc_main$2;
      const _component_UCard = __nuxt_component_0$1;
      const _component_UBadge = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u041F\u0430\u043D\u0435\u043B\u044C \u0430\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440\u0430</h1><p class="text-sm text-slate-500">\u0421\u0432\u043E\u0434\u043A\u0430 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0439 \u0438 \u0442\u0435\u043A\u0443\u0449\u0430\u044F \u0437\u0430\u0434\u043E\u043B\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u044C.</p></div><div class="card-grid">`);
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "\u041E\u0431\u0449\u0438\u0439 \u0434\u043E\u043B\u0433",
        value: unref(debt),
        tone: "danger"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "\u0412 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0438",
        value: unref(statusMap).pending,
        tone: "warning"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "\u041E\u0434\u043E\u0431\u0440\u0435\u043D\u043E",
        value: unref(statusMap).approved,
        tone: "success"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardStatCard, {
        label: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E",
        value: unref(statusMap).completed
      }, null, _parent));
      _push(`</div><div class="grid gap-4 xl:grid-cols-[2fr_1fr]">`);
      _push(ssrRenderComponent(_component_StatusPieChart, {
        title: "\u041C\u043E\u0438 \u0441\u0442\u0430\u0442\u0443\u0441\u044B",
        labels: Object.keys(unref(statusMap)).map((x) => unref(bookingStatusLabel)(x)),
        values: Object.values(unref(statusMap))
      }, null, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold"${_scopeId}>\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold" }, "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(unref(lastBookings), (booking) => {
              _push2(`<div class="rounded border border-[#eeeeee] p-3"${_scopeId}><p class="text-sm font-medium"${_scopeId}>${ssrInterpolate(new Date(booking.requested_datetime).toLocaleString())}</p><p class="text-sm text-slate-600"${_scopeId}>${ssrInterpolate(booking.driver_name)} \u2022 ${ssrInterpolate(booking.car_plate_text)}</p>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                class: "mt-2",
                label: unref(bookingStatusLabel)(booking.status),
                color: "gray",
                variant: "subtle"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(lastBookings).length) {
              _push2(`<p class="text-sm text-slate-500"${_scopeId}>\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0439.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-2" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(lastBookings), (booking) => {
                  return openBlock(), createBlock("div", {
                    key: booking.id,
                    class: "rounded border border-[#eeeeee] p-3"
                  }, [
                    createVNode("p", { class: "text-sm font-medium" }, toDisplayString(new Date(booking.requested_datetime).toLocaleString()), 1),
                    createVNode("p", { class: "text-sm text-slate-600" }, toDisplayString(booking.driver_name) + " \u2022 " + toDisplayString(booking.car_plate_text), 1),
                    createVNode(_component_UBadge, {
                      class: "mt-2",
                      label: unref(bookingStatusLabel)(booking.status),
                      color: "gray",
                      variant: "subtle"
                    }, null, 8, ["label"])
                  ]);
                }), 128)),
                !unref(lastBookings).length ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-slate-500"
                }, "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0439.")) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tenant/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BPraFux5.mjs.map
