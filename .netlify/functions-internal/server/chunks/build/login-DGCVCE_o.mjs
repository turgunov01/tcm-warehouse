import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_2 } from './Form-B_6MfFER.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as useRoute, b as useSupabaseClient, c as useAuthRbac, n as navigateTo } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const supabase = useSupabaseClient();
    const { loadProfile, roleHome } = useAuthRbac();
    const form = reactive({
      username: "",
      password: ""
    });
    const loading = ref(false);
    const errorText = ref("");
    if (route.query.reason === "profile_missing") {
      errorText.value = "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D, \u043D\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u043F\u0438\u0441\u044C \u0432 public.profiles \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F.";
    }
    const submit = async () => {
      var _a, _b, _c;
      loading.value = true;
      errorText.value = "";
      try {
        const sessionPayload = await $fetch("/api/auth/login", {
          method: "POST",
          body: {
            username: form.username,
            password: form.password
          }
        });
        const { data, error } = await supabase.auth.setSession({
          access_token: sessionPayload.access_token,
          refresh_token: sessionPayload.refresh_token
        });
        if (error) {
          errorText.value = error.message;
          loading.value = false;
          return;
        }
        const profile = await loadProfile((_a = data.user) == null ? void 0 : _a.id);
        loading.value = false;
        if (!profile) {
          errorText.value = "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u041F\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430 \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0432 public.profiles.";
          return;
        }
        await navigateTo(roleHome(profile.role), { replace: true });
      } catch (error) {
        errorText.value = ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.statusMessage) || ((_c = error == null ? void 0 : error.data) == null ? void 0 : _c.message) || (error == null ? void 0 : error.message) || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0432\u0445\u043E\u0434";
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UForm = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto flex min-h-screen w-full max-w-md items-center px-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, { class: "w-full" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-1"${_scopeId}><h1 class="text-xl font-semibold"${_scopeId}>\u0412\u0445\u043E\u0434 \u0432 TCM Warehouse</h1><p class="text-sm text-slate-500"${_scopeId}>\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0435 \u0443\u0447\u0435\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435.</p></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-1" }, [
                createVNode("h1", { class: "text-xl font-semibold" }, "\u0412\u0445\u043E\u0434 \u0432 TCM Warehouse"),
                createVNode("p", { class: "text-sm text-slate-500" }, "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0435 \u0443\u0447\u0435\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435.")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              state: unref(form),
              class: "space-y-3",
              onSubmit: submit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "\u041B\u043E\u0433\u0438\u043D",
                    name: "username"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).username,
                          "onUpdate:modelValue": ($event) => unref(form).username = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).username,
                            "onUpdate:modelValue": ($event) => unref(form).username = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "\u041F\u0430\u0440\u043E\u043B\u044C",
                    name: "password"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).password,
                          "onUpdate:modelValue": ($event) => unref(form).password = $event,
                          type: "password",
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).password,
                            "onUpdate:modelValue": ($event) => unref(form).password = $event,
                            type: "password",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(errorText)) {
                    _push3(`<p class="text-sm text-rose-600"${_scopeId2}>${ssrInterpolate(unref(errorText))}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    block: "",
                    color: "white",
                    loading: unref(loading),
                    label: "\u0412\u043E\u0439\u0442\u0438"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UFormGroup, {
                      label: "\u041B\u043E\u0433\u0438\u043D",
                      name: "username"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).username,
                          "onUpdate:modelValue": ($event) => unref(form).username = $event,
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "\u041F\u0430\u0440\u043E\u043B\u044C",
                      name: "password"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).password,
                          "onUpdate:modelValue": ($event) => unref(form).password = $event,
                          type: "password",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    unref(errorText) ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-rose-600"
                    }, toDisplayString(unref(errorText)), 1)) : createCommentVNode("", true),
                    createVNode(_component_UButton, {
                      type: "submit",
                      block: "",
                      color: "white",
                      loading: unref(loading),
                      label: "\u0412\u043E\u0439\u0442\u0438"
                    }, null, 8, ["loading"])
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
                onSubmit: withModifiers(submit, ["prevent"])
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormGroup, {
                    label: "\u041B\u043E\u0433\u0438\u043D",
                    name: "username"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).username,
                        "onUpdate:modelValue": ($event) => unref(form).username = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, {
                    label: "\u041F\u0430\u0440\u043E\u043B\u044C",
                    name: "password"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).password,
                        "onUpdate:modelValue": ($event) => unref(form).password = $event,
                        type: "password",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  unref(errorText) ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-rose-600"
                  }, toDisplayString(unref(errorText)), 1)) : createCommentVNode("", true),
                  createVNode(_component_UButton, {
                    type: "submit",
                    block: "",
                    color: "white",
                    loading: unref(loading),
                    label: "\u0412\u043E\u0439\u0442\u0438"
                  }, null, 8, ["loading"])
                ]),
                _: 1
              }, 8, ["state"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DGCVCE_o.mjs.map
