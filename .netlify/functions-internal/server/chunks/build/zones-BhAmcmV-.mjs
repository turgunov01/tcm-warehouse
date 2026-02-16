import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_2 } from './Form-B_6MfFER.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { defineComponent, ref, reactive, mergeProps, withCtx, unref, createVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { b as useSupabaseClient } from './server.mjs';
import 'tailwind-merge';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import './nuxt-link-Bv1Nr2cZ.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "zones",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const zones = ref([]);
    const form = reactive({ name: "", description: "" });
    const editing = ref(null);
    const loadZones = async () => {
      const { data } = await supabase.from("zones").select("*").order("created_at");
      zones.value = data != null ? data : [];
    };
    const saveZone = async () => {
      if (!form.name.trim()) {
        return;
      }
      if (editing.value) {
        await supabase.from("zones").update({ name: form.name, description: form.description || null }).eq("id", editing.value);
      } else {
        await supabase.from("zones").insert({ name: form.name, description: form.description || null });
      }
      form.name = "";
      form.description = "";
      editing.value = null;
      await loadZones();
    };
    const editRow = (row) => {
      editing.value = row.id;
      form.name = row.name;
      form.description = row.description || "";
    };
    const deleteZone = async (id) => {
      await supabase.from("zones").delete().eq("id", id);
      await loadZones();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UForm = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_UButton = __nuxt_component_1;
      const _component_UTable = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u0417\u043E\u043D\u044B</h1><p class="text-sm text-slate-500">\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0437\u043E\u043D\u0430\u043C\u0438 \u0441\u043A\u043B\u0430\u0434\u0430.</p></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              state: unref(form),
              class: "grid gap-3 md:grid-cols-[2fr_3fr_auto]",
              onSubmit: saveZone
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u043E\u043D\u044B" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          placeholder: "\u0417\u043E\u043D\u0430 1",
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event,
                            placeholder: "\u0417\u043E\u043D\u0430 1",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).description,
                            "onUpdate:modelValue": ($event) => unref(form).description = $event,
                            placeholder: "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="flex items-end"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    color: "white",
                    label: unref(editing) ? "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C" : "\u0421\u043E\u0437\u0434\u0430\u0442\u044C"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_UFormGroup, { label: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u043E\u043D\u044B" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          placeholder: "\u0417\u043E\u043D\u0430 1",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex items-end" }, [
                      createVNode(_component_UButton, {
                        type: "submit",
                        color: "white",
                        label: unref(editing) ? "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C" : "\u0421\u043E\u0437\u0434\u0430\u0442\u044C"
                      }, null, 8, ["label"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UForm, {
                state: unref(form),
                class: "grid gap-3 md:grid-cols-[2fr_3fr_auto]",
                onSubmit: withModifiers(saveZone, ["prevent"])
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormGroup, { label: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u043E\u043D\u044B" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).name,
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        placeholder: "\u0417\u043E\u043D\u0430 1",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).description,
                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                        placeholder: "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "flex items-end" }, [
                    createVNode(_component_UButton, {
                      type: "submit",
                      color: "white",
                      label: unref(editing) ? "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C" : "\u0421\u043E\u0437\u0434\u0430\u0442\u044C"
                    }, null, 8, ["label"])
                  ])
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
              rows: unref(zones),
              columns: [
                { key: "name", label: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" },
                { key: "description", label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },
                { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
              ]
            }, {
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    label: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",
                    onClick: ($event) => editRow(row)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "red",
                    variant: "outline",
                    label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
                    onClick: ($event) => deleteZone(row.id)
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(_component_UButton, {
                        size: "xs",
                        label: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",
                        onClick: ($event) => editRow(row)
                      }, null, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "red",
                        variant: "outline",
                        label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
                        onClick: ($event) => deleteZone(row.id)
                      }, null, 8, ["onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                rows: unref(zones),
                columns: [
                  { key: "name", label: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" },
                  { key: "description", label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },
                  { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
                ]
              }, {
                "actions-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      size: "xs",
                      label: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",
                      onClick: ($event) => editRow(row)
                    }, null, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      size: "xs",
                      color: "red",
                      variant: "outline",
                      label: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
                      onClick: ($event) => deleteZone(row.id)
                    }, null, 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/zones.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=zones-BhAmcmV-.mjs.map
