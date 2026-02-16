import { defineComponent, toRef, computed, h, withCtx, createTextVNode, toDisplayString, unref, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { u as useUI, a as useProvideButtonGroup, _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { g as getSlotsChildren, t as twMerge, m as mergeConfig, e as appConfig } from './server.mjs';
import { b as button } from './Button-CrgxThWw.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { _ as __nuxt_component_8$1 } from './Badge-DxNY05Lj.mjs';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';

const buttonGroup = {
  wrapper: {
    horizontal: "inline-flex -space-x-px",
    vertical: "inline-flex flex-col -space-y-px"
  },
  rounded: "rounded-md",
  shadow: "shadow-sm",
  orientation: {
    "rounded-none": { horizontal: { start: "rounded-s-none", end: "rounded-e-none" }, vertical: { start: "rounded-t-none", end: "rounded-b-none" } },
    "rounded-sm": { horizontal: { start: "rounded-s-sm", end: "rounded-e-sm" }, vertical: { start: "rounded-t-sm", end: "rounded-b-sm" } },
    "rounded": { horizontal: { start: "rounded-s", end: "rounded-e" }, vertical: { start: "rounded-t", end: "rounded-b" } },
    "rounded-md": { horizontal: { start: "rounded-s-md", end: "rounded-e-md" }, vertical: { start: "rounded-t-md", end: "rounded-b-md" } },
    "rounded-lg": { horizontal: { start: "rounded-s-lg", end: "rounded-e-lg" }, vertical: { start: "rounded-t-lg", end: "rounded-b-lg" } },
    "rounded-xl": { horizontal: { start: "rounded-s-xl", end: "rounded-e-xl" }, vertical: { start: "rounded-t-xl", end: "rounded-b-xl" } },
    "rounded-2xl": { horizontal: { start: "rounded-s-2xl", end: "rounded-e-2xl" }, vertical: { start: "rounded-t-2xl", end: "rounded-b-2xl" } },
    "rounded-3xl": { horizontal: { start: "rounded-s-3xl", end: "rounded-e-3xl" }, vertical: { start: "rounded-t-3xl", end: "rounded-b-3xl" } },
    "rounded-full": { horizontal: { start: "rounded-s-full", end: "rounded-e-full" }, vertical: { start: "rounded-t-full", end: "rounded-b-full" } }
  }
};
const buttonConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.button, button);
const buttonGroupConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.buttonGroup, buttonGroup);
const __nuxt_component_3 = defineComponent({
  name: "ButtonGroup",
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: null,
      validator(value) {
        return Object.keys(buttonConfig.size).includes(value);
      }
    },
    orientation: {
      type: String,
      default: "horizontal",
      validator(value) {
        return ["horizontal", "vertical"].includes(value);
      }
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const { ui, attrs } = useUI("buttonGroup", toRef(props, "ui"), buttonGroupConfig);
    const children = computed(() => getSlotsChildren(slots));
    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper[props.orientation],
        ui.value.rounded,
        ui.value.shadow
      ), props.class);
    });
    const rounded = computed(() => ui.value.orientation[ui.value.rounded][props.orientation]);
    useProvideButtonGroup({ orientation: toRef(props, "orientation"), size: toRef(props, "size"), ui, rounded });
    return () => h("div", { class: wrapperClass.value, ...attrs.value }, children.value);
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BookingTable",
  __ssrInlineRender: true,
  props: {
    rows: {}
  },
  setup(__props) {
    const props = __props;
    const { bookingStatusLabel } = useRuLabels();
    const columns = [
      { key: "id", label: "ID" },
      { key: "requested_datetime", label: "\u0417\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043E" },
      { key: "status", label: "\u0421\u0442\u0430\u0442\u0443\u0441" },
      { key: "driver_name", label: "\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C" },
      { key: "car_plate_text", label: "\u041D\u043E\u043C\u0435\u0440" },
      { key: "tenant", label: "\u0410\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UTable = __nuxt_component_8;
      const _component_UBadge = __nuxt_component_8$1;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              rows: props.rows,
              columns
            }, {
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
              "requested_datetime-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(new Date(row.requested_datetime).toLocaleString())}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(new Date(row.requested_datetime).toLocaleString()), 1)
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
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                rows: props.rows,
                columns
              }, {
                "status-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    label: unref(bookingStatusLabel)(row.status),
                    color: "gray",
                    variant: "subtle"
                  }, null, 8, ["label"])
                ]),
                "requested_datetime-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(new Date(row.requested_datetime).toLocaleString()), 1)
                ]),
                "tenant-data": withCtx(({ row }) => {
                  var _a;
                  return [
                    createTextVNode(toDisplayString(((_a = row.profiles) == null ? void 0 : _a.full_name) || row.tenant_id), 1)
                  ];
                }),
                _: 2
              }, 1032, ["rows"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BookingTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BookingCalendar",
  __ssrInlineRender: true,
  props: {
    rows: {}
  },
  setup(__props) {
    const props = __props;
    const { bookingStatusLabel } = useRuLabels();
    const grouped = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const row of props.rows) {
        const day = new Date(row.requested_datetime).toISOString().slice(0, 10);
        const arr = map.get(day) || [];
        arr.push(row);
        map.set(day, arr);
      }
      return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UBadge = __nuxt_component_8$1;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold"${_scopeId}>\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold" }, "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
            ssrRenderList(unref(grouped), (item) => {
              _push2(`<div class="rounded border border-[#eeeeee] p-3"${_scopeId}><p class="mb-2 font-medium"${_scopeId}>${ssrInterpolate(item[0])}</p><div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(item[1], (booking) => {
                _push2(`<div class="flex items-center justify-between rounded-md border border-[#eeeeee] bg-transparent p-2"${_scopeId}><span class="text-sm"${_scopeId}>${ssrInterpolate(new Date(booking.requested_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))} - ${ssrInterpolate(booking.driver_name)}</span>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  label: unref(bookingStatusLabel)(booking.status),
                  color: "gray",
                  variant: "subtle"
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(grouped).length) {
              _push2(`<p class="text-sm text-slate-500"${_scopeId}>\u0417\u0430\u043F\u0438\u0441\u0435\u0439 \u0432 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0435 \u043D\u0435\u0442.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(grouped), (item) => {
                  return openBlock(), createBlock("div", {
                    key: item[0],
                    class: "rounded border border-[#eeeeee] p-3"
                  }, [
                    createVNode("p", { class: "mb-2 font-medium" }, toDisplayString(item[0]), 1),
                    createVNode("div", { class: "space-y-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(item[1], (booking) => {
                        return openBlock(), createBlock("div", {
                          key: booking.id,
                          class: "flex items-center justify-between rounded-md border border-[#eeeeee] bg-transparent p-2"
                        }, [
                          createVNode("span", { class: "text-sm" }, toDisplayString(new Date(booking.requested_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) + " - " + toDisplayString(booking.driver_name), 1),
                          createVNode(_component_UBadge, {
                            label: unref(bookingStatusLabel)(booking.status),
                            color: "gray",
                            variant: "subtle"
                          }, null, 8, ["label"])
                        ]);
                      }), 128))
                    ])
                  ]);
                }), 128)),
                !unref(grouped).length ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-slate-500"
                }, "\u0417\u0430\u043F\u0438\u0441\u0435\u0439 \u0432 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0435 \u043D\u0435\u0442.")) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BookingCalendar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { __nuxt_component_3 as _, _sfc_main$1 as a, _sfc_main as b };
//# sourceMappingURL=BookingCalendar-BWxIqXQn.mjs.map
