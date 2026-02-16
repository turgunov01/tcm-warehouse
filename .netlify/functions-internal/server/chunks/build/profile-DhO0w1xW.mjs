import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_2 } from './Form-B_6MfFER.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, unref, createVNode, withModifiers, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useSupabaseClient, c as useAuthRbac } from './server.mjs';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';
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
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const { user, profile, loadProfile } = useAuthRbac();
    const { roleLabel } = useRuLabels();
    const form = reactive({
      full_name: "",
      phone: ""
    });
    const notice = ref("");
    const save = async () => {
      if (!user.value) {
        return;
      }
      const { error } = await supabase.from("profiles").update({ full_name: form.full_name, phone: form.phone }).eq("id", user.value.id);
      notice.value = error ? error.message : "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D.";
      await loadProfile();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UForm = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 max-w-xl" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u041F\u0440\u043E\u0444\u0438\u043B\u044C</h1><p class="text-sm text-slate-500">\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435.</p></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              state: unref(form),
              class: "space-y-3",
              onSubmit: save
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u0424\u0418\u041E" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).full_name,
                          "onUpdate:modelValue": ($event) => unref(form).full_name = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).full_name,
                            "onUpdate:modelValue": ($event) => unref(form).full_name = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).phone,
                          "onUpdate:modelValue": ($event) => unref(form).phone = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).phone,
                            "onUpdate:modelValue": ($event) => unref(form).phone = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    label: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
                    color: "white"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UFormGroup, { label: "\u0424\u0418\u041E" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).full_name,
                          "onUpdate:modelValue": ($event) => unref(form).full_name = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).phone,
                          "onUpdate:modelValue": ($event) => unref(form).phone = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      label: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
                      color: "white"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(notice)) {
              _push2(`<p class="mt-3 text-sm text-slate-600"${_scopeId}>${ssrInterpolate(unref(notice))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-2 text-xs text-slate-500"${_scopeId}>\u0420\u043E\u043B\u044C: ${ssrInterpolate(unref(roleLabel)((_a = unref(profile)) == null ? void 0 : _a.role))}</p>`);
          } else {
            return [
              createVNode(_component_UForm, {
                state: unref(form),
                class: "space-y-3",
                onSubmit: withModifiers(save, ["prevent"])
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormGroup, { label: "\u0424\u0418\u041E" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).full_name,
                        "onUpdate:modelValue": ($event) => unref(form).full_name = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).phone,
                        "onUpdate:modelValue": ($event) => unref(form).phone = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    label: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
                    color: "white"
                  })
                ]),
                _: 1
              }, 8, ["state"]),
              unref(notice) ? (openBlock(), createBlock("p", {
                key: 0,
                class: "mt-3 text-sm text-slate-600"
              }, toDisplayString(unref(notice)), 1)) : createCommentVNode("", true),
              createVNode("p", { class: "mt-2 text-xs text-slate-500" }, "\u0420\u043E\u043B\u044C: " + toDisplayString(unref(roleLabel)((_b = unref(profile)) == null ? void 0 : _b.role)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tenant/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-DhO0w1xW.mjs.map
