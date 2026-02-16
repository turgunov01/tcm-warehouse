import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_2 } from './Form-B_6MfFER.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_6 } from './SelectMenu-CepcR2XP.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { _ as __nuxt_component_0 } from './Alert-CEW1Bd40.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { defineComponent, ref, reactive, mergeProps, withCtx, unref, createVNode, withModifiers, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useSupabaseClient } from './server.mjs';
import { u as useFileInput } from './useFileInput-CMaEUmS3.mjs';
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
import '@tanstack/vue-virtual';
import './active-element-history-CsQcsyjA.mjs';
import './nuxt-link-Bv1Nr2cZ.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "users",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const { getFirstFile } = useFileInput();
    const { roleLabel } = useRuLabels();
    const zones = ref([]);
    const tenants = ref([]);
    const creating = ref(false);
    const bulkLoading = ref(false);
    const result = ref("");
    const roleOptions = [
      { label: "\u0410\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440", value: "tenant" },
      { label: "\u041E\u0445\u0440\u0430\u043D\u0430", value: "guard" },
      { label: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440", value: "admin" }
    ];
    const form = reactive({
      username: "",
      email: "",
      password: "",
      role: "tenant",
      full_name: "",
      phone: "",
      zone_id: "",
      tenant_code: ""
    });
    const load = async () => {
      var _a, _b;
      const [zonesResp, usersResp] = await Promise.all([
        supabase.from("zones").select("*").order("name"),
        supabase.from("profiles").select("*").order("created_at", { ascending: false })
      ]);
      zones.value = (_a = zonesResp.data) != null ? _a : [];
      tenants.value = (_b = usersResp.data) != null ? _b : [];
    };
    const createSingle = async () => {
      creating.value = true;
      result.value = "";
      const { error } = await $fetch("/api/admin/create-user", {
        method: "POST",
        body: {
          ...form,
          zone_id: form.zone_id || null,
          tenant_code: form.tenant_code || null
        }
      }).then(() => ({ error: null })).catch((err) => ({ error: err }));
      creating.value = false;
      if (error) {
        result.value = error.message;
        return;
      }
      result.value = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u043E\u0437\u0434\u0430\u043D.";
      form.username = "";
      form.email = "";
      form.password = "";
      form.full_name = "";
      form.phone = "";
      form.tenant_code = "";
      form.zone_id = "";
      await load();
    };
    const file = ref(null);
    const bulkUpload = async () => {
      var _a;
      if (!file.value) {
        result.value = "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 Excel-\u0444\u0430\u0439\u043B.";
        return;
      }
      bulkLoading.value = true;
      result.value = "";
      const data = new FormData();
      data.append("file", file.value);
      try {
        const resp = await $fetch(
          "/api/admin/bulk-users",
          {
            method: "POST",
            body: data
          }
        );
        result.value = `\u041C\u0430\u0441\u0441\u043E\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430. \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E: ${resp.inserted}, \u041E\u0448\u0438\u0431\u043E\u043A: ${resp.failed}`;
        file.value = null;
        await load();
      } catch (error) {
        result.value = ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.message) || (error == null ? void 0 : error.message) || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B";
      } finally {
        bulkLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UForm = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_USelectMenu = __nuxt_component_6;
      const _component_UButton = __nuxt_component_1;
      const _component_UAlert = __nuxt_component_0;
      const _component_UTable = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438</h1><p class="text-sm text-slate-500">\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0432\u0440\u0443\u0447\u043D\u0443\u044E \u0438\u043B\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0441\u043F\u0438\u0441\u043E\u043A \u0438\u0437 XLSX.</p></div><div class="grid gap-4 xl:grid-cols-2">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold"${_scopeId}>\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold" }, "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              state: unref(form),
              class: "space-y-3",
              onSubmit: createSingle
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid gap-3 md:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041B\u043E\u0433\u0438\u043D" }, {
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
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "Email" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).email,
                          "onUpdate:modelValue": ($event) => unref(form).email = $event,
                          type: "email",
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).email,
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid gap-3 md:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041F\u0430\u0440\u043E\u043B\u044C" }, {
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
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u0420\u043E\u043B\u044C" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(form).role,
                          "onUpdate:modelValue": ($event) => unref(form).role = $event,
                          options: roleOptions,
                          "option-attribute": "label",
                          "value-attribute": "value"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(form).role,
                            "onUpdate:modelValue": ($event) => unref(form).role = $event,
                            options: roleOptions,
                            "option-attribute": "label",
                            "value-attribute": "value"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u0417\u043E\u043D\u0430" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(form).zone_id,
                          "onUpdate:modelValue": ($event) => unref(form).zone_id = $event,
                          options: unref(zones),
                          "option-attribute": "name",
                          "value-attribute": "id",
                          placeholder: "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(form).zone_id,
                            "onUpdate:modelValue": ($event) => unref(form).zone_id = $event,
                            options: unref(zones),
                            "option-attribute": "name",
                            "value-attribute": "id",
                            placeholder: "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid gap-3 md:grid-cols-2"${_scopeId2}>`);
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
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041A\u043E\u0434 \u0430\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440\u0430" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(form).tenant_code,
                          "onUpdate:modelValue": ($event) => unref(form).tenant_code = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).tenant_code,
                            "onUpdate:modelValue": ($event) => unref(form).tenant_code = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    label: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
                    color: "white",
                    loading: unref(creating)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                      createVNode(_component_UFormGroup, { label: "\u041B\u043E\u0433\u0438\u043D" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).username,
                            "onUpdate:modelValue": ($event) => unref(form).username = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Email" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).email,
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                      createVNode(_component_UFormGroup, { label: "\u041F\u0430\u0440\u043E\u043B\u044C" }, {
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
                      createVNode(_component_UFormGroup, { label: "\u0420\u043E\u043B\u044C" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(form).role,
                            "onUpdate:modelValue": ($event) => unref(form).role = $event,
                            options: roleOptions,
                            "option-attribute": "label",
                            "value-attribute": "value"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "\u0417\u043E\u043D\u0430" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(form).zone_id,
                            "onUpdate:modelValue": ($event) => unref(form).zone_id = $event,
                            options: unref(zones),
                            "option-attribute": "name",
                            "value-attribute": "id",
                            placeholder: "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
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
                      })
                    ]),
                    createVNode(_component_UFormGroup, { label: "\u041A\u043E\u0434 \u0430\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440\u0430" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).tenant_code,
                          "onUpdate:modelValue": ($event) => unref(form).tenant_code = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      label: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
                      color: "white",
                      loading: unref(creating)
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
                onSubmit: withModifiers(createSingle, ["prevent"])
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                    createVNode(_component_UFormGroup, { label: "\u041B\u043E\u0433\u0438\u043D" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).username,
                          "onUpdate:modelValue": ($event) => unref(form).username = $event,
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Email" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).email,
                          "onUpdate:modelValue": ($event) => unref(form).email = $event,
                          type: "email",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                    createVNode(_component_UFormGroup, { label: "\u041F\u0430\u0440\u043E\u043B\u044C" }, {
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
                    createVNode(_component_UFormGroup, { label: "\u0420\u043E\u043B\u044C" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(form).role,
                          "onUpdate:modelValue": ($event) => unref(form).role = $event,
                          options: roleOptions,
                          "option-attribute": "label",
                          "value-attribute": "value"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "\u0417\u043E\u043D\u0430" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(form).zone_id,
                          "onUpdate:modelValue": ($event) => unref(form).zone_id = $event,
                          options: unref(zones),
                          "option-attribute": "name",
                          "value-attribute": "id",
                          placeholder: "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
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
                    })
                  ]),
                  createVNode(_component_UFormGroup, { label: "\u041A\u043E\u0434 \u0430\u0440\u0435\u043D\u0434\u0430\u0442\u043E\u0440\u0430" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).tenant_code,
                        "onUpdate:modelValue": ($event) => unref(form).tenant_code = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    label: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
                    color: "white",
                    loading: unref(creating)
                  }, null, 8, ["loading"])
                ]),
                _: 1
              }, 8, ["state"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold"${_scopeId}>\u041C\u0430\u0441\u0441\u043E\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 XLSX</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold" }, "\u041C\u0430\u0441\u0441\u043E\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 XLSX")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><p class="text-sm text-slate-500"${_scopeId}> \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0435 \u0444\u043E\u0440\u043C\u0430\u0442\u044B: .xlsx \u0438 .xls. \u041E\u0436\u0438\u0434\u0430\u0435\u043C\u044B\u0435 \u043A\u043E\u043B\u043E\u043D\u043A\u0438: email, password, role, full_name, phone, zone_name, tenant_code, username(\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E) </p>`);
            _push2(ssrRenderComponent(_component_UInput, {
              type: "file",
              accept: ".xlsx,.xls",
              onChange: (payload) => file.value = unref(getFirstFile)(payload)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C XLSX",
              loading: unref(bulkLoading),
              onClick: bulkUpload
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                createVNode("p", { class: "text-sm text-slate-500" }, " \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0435 \u0444\u043E\u0440\u043C\u0430\u0442\u044B: .xlsx \u0438 .xls. \u041E\u0436\u0438\u0434\u0430\u0435\u043C\u044B\u0435 \u043A\u043E\u043B\u043E\u043D\u043A\u0438: email, password, role, full_name, phone, zone_name, tenant_code, username(\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E) "),
                createVNode(_component_UInput, {
                  type: "file",
                  accept: ".xlsx,.xls",
                  onChange: (payload) => file.value = unref(getFirstFile)(payload)
                }, null, 8, ["onChange"]),
                createVNode(_component_UButton, {
                  label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C XLSX",
                  loading: unref(bulkLoading),
                  onClick: bulkUpload
                }, null, 8, ["loading"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(result)) {
        _push(ssrRenderComponent(_component_UAlert, {
          title: unref(result),
          color: "primary",
          variant: "subtle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              rows: unref(tenants),
              columns: [
                { key: "username", label: "\u041B\u043E\u0433\u0438\u043D" },
                { key: "email", label: "Email" },
                { key: "full_name", label: "\u0418\u043C\u044F" },
                { key: "role", label: "\u0420\u043E\u043B\u044C" },
                { key: "phone", label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" },
                { key: "tenant_code", label: "\u041A\u043E\u0434" }
              ]
            }, {
              "role-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(roleLabel)(row.role))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(roleLabel)(row.role)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                rows: unref(tenants),
                columns: [
                  { key: "username", label: "\u041B\u043E\u0433\u0438\u043D" },
                  { key: "email", label: "Email" },
                  { key: "full_name", label: "\u0418\u043C\u044F" },
                  { key: "role", label: "\u0420\u043E\u043B\u044C" },
                  { key: "phone", label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" },
                  { key: "tenant_code", label: "\u041A\u043E\u0434" }
                ]
              }, {
                "role-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(unref(roleLabel)(row.role)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=users-CkDeQB5o.mjs.map
