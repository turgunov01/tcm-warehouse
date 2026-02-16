import { _ as __nuxt_component_0 } from './Alert-CEW1Bd40.mjs';
import { _ as __nuxt_component_0$1, u as useUI, t as textarea } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_2 } from './Form-B_6MfFER.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, withCtx, createVNode, withModifiers, createTextVNode, toDisplayString, toRef, watch, nextTick, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { D as defu } from '../_/nitro.mjs';
import { u as useFormGroup } from './useFormGroup-DqE91r20.mjs';
import { b as useSupabaseClient, _ as _export_sfc, t as twMerge, e as appConfig, m as mergeConfig, l as looseToNumber } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_6 } from './SelectMenu-CepcR2XP.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import '@vueuse/core';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import '@tanstack/vue-virtual';
import './active-element-history-CsQcsyjA.mjs';
import './nuxt-link-Bv1Nr2cZ.mjs';

const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.textarea, textarea);
const _sfc_main$1 = defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Number,
      default: 3
    },
    maxrows: {
      type: Number,
      default: 0
    },
    autoresize: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    autofocusDelay: {
      type: Number,
      default: 100
    },
    resize: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: null,
      validator(value) {
        return Object.keys(config.size).includes(value);
      }
    },
    color: {
      type: String,
      default: () => config.default.color,
      validator(value) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value);
      }
    },
    variant: {
      type: String,
      default: () => config.default.variant,
      validator(value) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap((value2) => Object.keys(value2))
        ].includes(value);
      }
    },
    textareaClass: {
      type: String,
      default: null
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    },
    modelModifiers: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue", "blur", "change"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("textarea", toRef(props, "ui"), config, toRef(props, "class"));
    const { emitFormBlur, emitFormInput, inputId, color, size, name } = useFormGroup(props, config);
    const modelModifiers = ref(defu({}, props.modelModifiers, { trim: false, lazy: false, number: false, nullify: false }));
    const textarea2 = ref(null);
    const autoResize = () => {
      if (props.autoresize) {
        if (!textarea2.value) {
          return;
        }
        textarea2.value.rows = props.rows;
        const overflow = textarea2.value.style.overflow;
        textarea2.value.style.overflow = "hidden";
        const styles = (void 0).getComputedStyle(textarea2.value);
        const paddingTop = Number.parseInt(styles.paddingTop);
        const paddingBottom = Number.parseInt(styles.paddingBottom);
        const padding = paddingTop + paddingBottom;
        const lineHeight = Number.parseInt(styles.lineHeight);
        const { scrollHeight } = textarea2.value;
        const newRows = (scrollHeight - padding) / lineHeight;
        if (newRows > props.rows) {
          textarea2.value.rows = props.maxrows ? Math.min(newRows, props.maxrows) : newRows;
        }
        textarea2.value.style.overflow = overflow;
      }
    };
    const updateInput = (value) => {
      if (modelModifiers.value.trim) {
        value = value.trim();
      }
      if (modelModifiers.value.number) {
        value = looseToNumber(value);
      }
      if (modelModifiers.value.nullify) {
        value || (value = null);
      }
      emit("update:modelValue", value);
      emitFormInput();
    };
    const onInput = (event) => {
      autoResize();
      if (!modelModifiers.value.lazy) {
        updateInput(event.target.value);
      }
    };
    const onChange = (event) => {
      const value = event.target.value;
      emit("change", value);
      if (modelModifiers.value.lazy) {
        updateInput(value);
      }
      if (modelModifiers.value.trim) {
        event.target.value = value.trim();
      }
    };
    const onBlur = (event) => {
      emit("blur", event);
      emitFormBlur();
    };
    watch(() => props.modelValue, () => {
      nextTick(autoResize);
    });
    const textareaClass = computed(() => {
      var _a, _b;
      const variant = ((_b = (_a = ui.value.color) == null ? void 0 : _a[color.value]) == null ? void 0 : _b[props.variant]) || ui.value.variant[props.variant];
      return twMerge(twJoin(
        ui.value.base,
        ui.value.form,
        ui.value.rounded,
        ui.value.placeholder,
        ui.value.size[size.value],
        props.padded ? ui.value.padding[size.value] : "p-0",
        variant == null ? void 0 : variant.replaceAll("{color}", color.value),
        !props.resize && "resize-none"
      ), props.textareaClass);
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      inputId,
      textarea: textarea2,
      // eslint-disable-next-line vue/no-dupe-keys
      textareaClass,
      onInput,
      onChange,
      onBlur
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  let _temp0;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.ui.wrapper
  }, _attrs))}><textarea${ssrRenderAttrs(_temp0 = mergeProps({
    id: _ctx.inputId,
    ref: "textarea",
    value: _ctx.modelValue,
    name: _ctx.name,
    rows: _ctx.rows,
    required: _ctx.required,
    disabled: _ctx.disabled,
    placeholder: _ctx.placeholder,
    class: _ctx.textareaClass
  }, _ctx.attrs), "textarea")}>${ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Textarea.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notifications",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const { roleLabel } = useRuLabels();
    const recipients = ref([]);
    const rows = ref([]);
    const form = reactive({
      title: "",
      body: "",
      recipient_id: ""
    });
    const notice = ref("");
    const load = async () => {
      var _a, _b;
      const [recipientsResp, notificationResp] = await Promise.all([
        supabase.from("profiles").select("id, full_name, role").order("full_name"),
        supabase.from("notifications").select("*").order("created_at", { ascending: false })
      ]);
      recipients.value = ((_a = recipientsResp.data) != null ? _a : []).map((recipient) => ({
        ...recipient,
        label: `[${recipient.full_name || "\u0411\u0435\u0437 \u0438\u043C\u0435\u043D\u0438"}] [${roleLabel(recipient.role)}]`
      }));
      rows.value = (_b = notificationResp.data) != null ? _b : [];
    };
    const tableRows = computed(
      () => rows.value.map((row) => ({
        ...row,
        recipient_display: row.recipient_id || "\u0412\u0441\u0435\u043C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C"
      }))
    );
    const send = async () => {
      const { error } = await supabase.from("notifications").insert({
        title: form.title,
        body: form.body,
        recipient_id: form.recipient_id || null
      });
      notice.value = error ? error.message : "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E.";
      form.title = "";
      form.body = "";
      form.recipient_id = "";
      await load();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = __nuxt_component_0;
      const _component_UCard = __nuxt_component_0$1;
      const _component_UForm = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_UTextarea = __nuxt_component_5;
      const _component_USelectMenu = __nuxt_component_6;
      const _component_UButton = __nuxt_component_1;
      const _component_UTable = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</h1><p class="text-sm text-slate-500">\u0421\u043E\u0437\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u043C\u0430\u0441\u0441\u043E\u0432\u044B\u0435 \u0438\u043B\u0438 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F.</p></div>`);
      if (unref(notice)) {
        _push(ssrRenderComponent(_component_UAlert, {
          title: unref(notice),
          color: "primary",
          variant: "subtle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              state: unref(form),
              class: "space-y-3",
              onSubmit: send
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).title,
                          "onUpdate:modelValue": ($event) => unref(form).title = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).title,
                            "onUpdate:modelValue": ($event) => unref(form).title = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UTextarea, {
                          modelValue: unref(form).body,
                          "onUpdate:modelValue": ($event) => unref(form).body = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UTextarea, {
                            modelValue: unref(form).body,
                            "onUpdate:modelValue": ($event) => unref(form).body = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C (\u043F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435\u043C)" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(form).recipient_id,
                          "onUpdate:modelValue": ($event) => unref(form).recipient_id = $event,
                          options: unref(recipients),
                          "option-attribute": "label",
                          "value-attribute": "id",
                          searchable: "",
                          placeholder: "\u0412\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
                          "clear-search-on-close": ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(form).recipient_id,
                            "onUpdate:modelValue": ($event) => unref(form).recipient_id = $event,
                            options: unref(recipients),
                            "option-attribute": "label",
                            "value-attribute": "id",
                            searchable: "",
                            placeholder: "\u0412\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
                            "clear-search-on-close": ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    label: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
                    color: "white"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UFormGroup, { label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).title,
                          "onUpdate:modelValue": ($event) => unref(form).title = $event,
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(form).body,
                          "onUpdate:modelValue": ($event) => unref(form).body = $event,
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C (\u043F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435\u043C)" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(form).recipient_id,
                          "onUpdate:modelValue": ($event) => unref(form).recipient_id = $event,
                          options: unref(recipients),
                          "option-attribute": "label",
                          "value-attribute": "id",
                          searchable: "",
                          placeholder: "\u0412\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
                          "clear-search-on-close": ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      label: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
                      color: "white"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UForm, {
                state: unref(form),
                class: "space-y-3",
                onSubmit: withModifiers(send, ["prevent"])
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormGroup, { label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).title,
                        "onUpdate:modelValue": ($event) => unref(form).title = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(form).body,
                        "onUpdate:modelValue": ($event) => unref(form).body = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C (\u043F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435\u043C)" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(form).recipient_id,
                        "onUpdate:modelValue": ($event) => unref(form).recipient_id = $event,
                        options: unref(recipients),
                        "option-attribute": "label",
                        "value-attribute": "id",
                        searchable: "",
                        placeholder: "\u0412\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
                        "clear-search-on-close": ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    label: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
                    color: "white"
                  })
                ]),
                _: 1
              }, 8, ["state"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              rows: unref(tableRows),
              columns: [
                { key: "created_at", label: "\u0421\u043E\u0437\u0434\u0430\u043D\u043E" },
                { key: "title", label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" },
                { key: "body", label: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" },
                { key: "recipient_display", label: "\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C" }
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
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                rows: unref(tableRows),
                columns: [
                  { key: "created_at", label: "\u0421\u043E\u0437\u0434\u0430\u043D\u043E" },
                  { key: "title", label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" },
                  { key: "body", label: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" },
                  { key: "recipient_display", label: "\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C" }
                ]
              }, {
                "created_at-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(new Date(row.created_at).toLocaleString()), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=notifications-9IFD1FOT.mjs.map
