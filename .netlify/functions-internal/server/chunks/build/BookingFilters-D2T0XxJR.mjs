import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_6 } from './SelectMenu-CepcR2XP.mjs';
import { defineComponent, ref, watch, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BookingFilters",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const state = ref({ ...props.modelValue });
    const { bookingStatusLabel } = useRuLabels();
    watch(
      () => props.modelValue,
      (next) => {
        state.value = { ...next };
      }
    );
    watch(
      state,
      (next) => {
        emit("update:modelValue", next);
      },
      { deep: true }
    );
    const statusOptions = [
      "pending",
      "approved",
      "rejected",
      "cancelled",
      "arrived",
      "left",
      "completed"
    ].map((value) => ({
      value,
      label: bookingStatusLabel(value)
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_USelectMenu = __nuxt_component_6;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-3 md:grid-cols-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u0421" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(state).from,
                    "onUpdate:modelValue": ($event) => unref(state).from = $event,
                    type: "date"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(state).from,
                      "onUpdate:modelValue": ($event) => unref(state).from = $event,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041F\u043E" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(state).to,
                    "onUpdate:modelValue": ($event) => unref(state).to = $event,
                    type: "date"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(state).to,
                      "onUpdate:modelValue": ($event) => unref(state).to = $event,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u0421\u0442\u0430\u0442\u0443\u0441\u044B" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(state).statuses,
                    "onUpdate:modelValue": ($event) => unref(state).statuses = $event,
                    options: unref(statusOptions),
                    "option-attribute": "label",
                    "value-attribute": "value",
                    multiple: "",
                    searchable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(state).statuses,
                      "onUpdate:modelValue": ($event) => unref(state).statuses = $event,
                      options: unref(statusOptions),
                      "option-attribute": "label",
                      "value-attribute": "value",
                      multiple: "",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-3 md:grid-cols-3" }, [
                createVNode(_component_UFormGroup, { label: "\u0421" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(state).from,
                      "onUpdate:modelValue": ($event) => unref(state).from = $event,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, { label: "\u041F\u043E" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(state).to,
                      "onUpdate:modelValue": ($event) => unref(state).to = $event,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormGroup, { label: "\u0421\u0442\u0430\u0442\u0443\u0441\u044B" }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(state).statuses,
                      "onUpdate:modelValue": ($event) => unref(state).statuses = $event,
                      options: unref(statusOptions),
                      "option-attribute": "label",
                      "value-attribute": "value",
                      multiple: "",
                      searchable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ]),
                  _: 1
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BookingFilters.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=BookingFilters-D2T0XxJR.mjs.map
