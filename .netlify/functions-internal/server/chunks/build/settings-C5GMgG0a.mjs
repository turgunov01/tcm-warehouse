import { _ as __nuxt_component_0 } from './Alert-CEW1Bd40.mjs';
import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_3, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { _ as __nuxt_component_2 } from './Form-B_6MfFER.mjs';
import { _ as __nuxt_component_6 } from './SelectMenu-CepcR2XP.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { _ as __nuxt_component_8$1 } from './Badge-DxNY05Lj.mjs';
import { defineComponent, ref, reactive, mergeProps, unref, withCtx, createVNode, withModifiers, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useSupabaseClient } from './server.mjs';
import { u as useFileInput } from './useFileInput-CMaEUmS3.mjs';
import 'tailwind-merge';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import './nuxt-link-Bv1Nr2cZ.mjs';
import '@tanstack/vue-virtual';
import './active-element-history-CsQcsyjA.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const { getFirstFile } = useFileInput();
    const settings = ref(null);
    const closures = ref([]);
    const zones = ref([]);
    const notice = ref("");
    const closureForm = reactive({
      zone_id: "",
      starts_at: "",
      ends_at: "",
      reason: ""
    });
    const templateFile = ref(null);
    const load = async () => {
      var _a, _b;
      const [settingsResp, closuresResp, zonesResp] = await Promise.all([
        supabase.from("settings").select("*").eq("id", 1).single(),
        supabase.from("closures").select("*").order("starts_at", { ascending: false }),
        supabase.from("zones").select("*").order("name")
      ]);
      settings.value = settingsResp.data ? {
        ...settingsResp.data,
        break_start: settingsResp.data.break_start || "",
        break_end: settingsResp.data.break_end || ""
      } : null;
      closures.value = (_a = closuresResp.data) != null ? _a : [];
      zones.value = (_b = zonesResp.data) != null ? _b : [];
    };
    const saveSettings = async () => {
      if (!settings.value) {
        return;
      }
      const { error } = await supabase.from("settings").update({
        free_start: settings.value.free_start,
        free_end: settings.value.free_end,
        work_start: settings.value.work_start,
        work_end: settings.value.work_end,
        break_start: settings.value.break_start || null,
        break_end: settings.value.break_end || null,
        hourly_penalty: settings.value.hourly_penalty,
        debt_block_hours: settings.value.debt_block_hours
      }).eq("id", 1);
      notice.value = error ? error.message : "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B.";
      await load();
    };
    const createClosure = async () => {
      const { error } = await supabase.from("closures").insert({
        zone_id: closureForm.zone_id || null,
        starts_at: closureForm.starts_at,
        ends_at: closureForm.ends_at,
        reason: closureForm.reason
      });
      notice.value = error ? error.message : "\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E.";
      closureForm.zone_id = "";
      closureForm.starts_at = "";
      closureForm.ends_at = "";
      closureForm.reason = "";
      await load();
    };
    const toggleClosure = async (row) => {
      await supabase.from("closures").update({ is_active: !row.is_active }).eq("id", row.id);
      await load();
    };
    const uploadTemplate = async () => {
      if (!templateFile.value) {
        return;
      }
      const name = `${Date.now()}-${templateFile.value.name}`;
      const { error } = await supabase.storage.from("templates").upload(name, templateFile.value, { upsert: true });
      notice.value = error ? error.message : "\u0428\u0430\u0431\u043B\u043E\u043D \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D \u0432 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 templates.";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAlert = __nuxt_component_0;
      const _component_UCard = __nuxt_component_0$1;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_UButton = __nuxt_component_1;
      const _component_UForm = __nuxt_component_2;
      const _component_USelectMenu = __nuxt_component_6;
      const _component_UTable = __nuxt_component_8;
      const _component_UBadge = __nuxt_component_8$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h1><p class="text-sm text-slate-500">\u0412\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u043E\u043A\u043D\u0430, \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F, \u0448\u0442\u0440\u0430\u0444\u044B \u0438 \u043B\u0438\u043C\u0438\u0442\u044B \u0434\u043E\u043B\u0433\u0430.</p></div>`);
      if (unref(notice)) {
        _push(ssrRenderComponent(_component_UAlert, {
          title: unref(notice),
          color: "primary",
          variant: "subtle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(settings)) {
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="font-semibold"${_scopeId}>\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u0432\u0440\u0435\u043C\u0435\u043D\u0438</p>`);
            } else {
              return [
                createVNode("p", { class: "font-semibold" }, "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u0432\u0440\u0435\u043C\u0435\u043D\u0438")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E\u0433\u043E \u043E\u043A\u043D\u0430" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(settings).free_start,
                      "onUpdate:modelValue": ($event) => unref(settings).free_start = $event,
                      type: "time"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).free_start,
                        "onUpdate:modelValue": ($event) => unref(settings).free_start = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E\u0433\u043E \u043E\u043A\u043D\u0430" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(settings).free_end,
                      "onUpdate:modelValue": ($event) => unref(settings).free_end = $event,
                      type: "time"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).free_end,
                        "onUpdate:modelValue": ($event) => unref(settings).free_end = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E \u0440\u0430\u0431\u043E\u0447\u0435\u0433\u043E \u043E\u043A\u043D\u0430" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(settings).work_start,
                      "onUpdate:modelValue": ($event) => unref(settings).work_start = $event,
                      type: "time"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).work_start,
                        "onUpdate:modelValue": ($event) => unref(settings).work_start = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446 \u0440\u0430\u0431\u043E\u0447\u0435\u0433\u043E \u043E\u043A\u043D\u0430" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(settings).work_end,
                      "onUpdate:modelValue": ($event) => unref(settings).work_end = $event,
                      type: "time"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).work_end,
                        "onUpdate:modelValue": ($event) => unref(settings).work_end = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E \u043F\u0435\u0440\u0435\u0440\u044B\u0432\u0430" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(settings).break_start,
                      "onUpdate:modelValue": ($event) => unref(settings).break_start = $event,
                      type: "time"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).break_start,
                        "onUpdate:modelValue": ($event) => unref(settings).break_start = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446 \u043F\u0435\u0440\u0435\u0440\u044B\u0432\u0430" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(settings).break_end,
                      "onUpdate:modelValue": ($event) => unref(settings).break_end = $event,
                      type: "time"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).break_end,
                        "onUpdate:modelValue": ($event) => unref(settings).break_end = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041F\u043E\u0447\u0430\u0441\u043E\u0432\u043E\u0439 \u0448\u0442\u0440\u0430\u0444" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(settings).hourly_penalty,
                      "onUpdate:modelValue": ($event) => unref(settings).hourly_penalty = $event,
                      modelModifiers: { number: true },
                      type: "number"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).hourly_penalty,
                        "onUpdate:modelValue": ($event) => unref(settings).hourly_penalty = $event,
                        modelModifiers: { number: true },
                        type: "number"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormGroup, { label: "\u041B\u0438\u043C\u0438\u0442 \u0434\u043E\u043B\u0433\u0430 (\u0432 \u0447\u0430\u0441\u0430\u0445)" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(settings).debt_block_hours,
                      "onUpdate:modelValue": ($event) => unref(settings).debt_block_hours = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      step: "0.5"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).debt_block_hours,
                        "onUpdate:modelValue": ($event) => unref(settings).debt_block_hours = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        step: "0.5"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="mt-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                label: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
                color: "white",
                onClick: saveSettings
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "grid gap-3 md:grid-cols-2 xl:grid-cols-4" }, [
                  createVNode(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E\u0433\u043E \u043E\u043A\u043D\u0430" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).free_start,
                        "onUpdate:modelValue": ($event) => unref(settings).free_start = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E\u0433\u043E \u043E\u043A\u043D\u0430" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).free_end,
                        "onUpdate:modelValue": ($event) => unref(settings).free_end = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E \u0440\u0430\u0431\u043E\u0447\u0435\u0433\u043E \u043E\u043A\u043D\u0430" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).work_start,
                        "onUpdate:modelValue": ($event) => unref(settings).work_start = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446 \u0440\u0430\u0431\u043E\u0447\u0435\u0433\u043E \u043E\u043A\u043D\u0430" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).work_end,
                        "onUpdate:modelValue": ($event) => unref(settings).work_end = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E \u043F\u0435\u0440\u0435\u0440\u044B\u0432\u0430" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).break_start,
                        "onUpdate:modelValue": ($event) => unref(settings).break_start = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446 \u043F\u0435\u0440\u0435\u0440\u044B\u0432\u0430" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).break_end,
                        "onUpdate:modelValue": ($event) => unref(settings).break_end = $event,
                        type: "time"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041F\u043E\u0447\u0430\u0441\u043E\u0432\u043E\u0439 \u0448\u0442\u0440\u0430\u0444" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).hourly_penalty,
                        "onUpdate:modelValue": ($event) => unref(settings).hourly_penalty = $event,
                        modelModifiers: { number: true },
                        type: "number"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormGroup, { label: "\u041B\u0438\u043C\u0438\u0442 \u0434\u043E\u043B\u0433\u0430 (\u0432 \u0447\u0430\u0441\u0430\u0445)" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(settings).debt_block_hours,
                        "onUpdate:modelValue": ($event) => unref(settings).debt_block_hours = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        step: "0.5"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "mt-3" }, [
                  createVNode(_component_UButton, {
                    label: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
                    color: "white",
                    onClick: saveSettings
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-4 xl:grid-cols-2">`);
      _push(ssrRenderComponent(_component_UCard, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold"${_scopeId}>\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold" }, "\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              state: unref(closureForm),
              class: "space-y-3",
              onSubmit: createClosure
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u0417\u043E\u043D\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(closureForm).zone_id,
                          "onUpdate:modelValue": ($event) => unref(closureForm).zone_id = $event,
                          options: unref(zones),
                          "option-attribute": "name",
                          "value-attribute": "id"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(closureForm).zone_id,
                            "onUpdate:modelValue": ($event) => unref(closureForm).zone_id = $event,
                            options: unref(zones),
                            "option-attribute": "name",
                            "value-attribute": "id"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid gap-3 md:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(closureForm).starts_at,
                          "onUpdate:modelValue": ($event) => unref(closureForm).starts_at = $event,
                          type: "datetime-local",
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(closureForm).starts_at,
                            "onUpdate:modelValue": ($event) => unref(closureForm).starts_at = $event,
                            type: "datetime-local",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(closureForm).ends_at,
                          "onUpdate:modelValue": ($event) => unref(closureForm).ends_at = $event,
                          type: "datetime-local",
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(closureForm).ends_at,
                            "onUpdate:modelValue": ($event) => unref(closureForm).ends_at = $event,
                            type: "datetime-local",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(closureForm).reason,
                          "onUpdate:modelValue": ($event) => unref(closureForm).reason = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(closureForm).reason,
                            "onUpdate:modelValue": ($event) => unref(closureForm).reason = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    label: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UFormGroup, { label: "\u0417\u043E\u043D\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(closureForm).zone_id,
                          "onUpdate:modelValue": ($event) => unref(closureForm).zone_id = $event,
                          options: unref(zones),
                          "option-attribute": "name",
                          "value-attribute": "id"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                      createVNode(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(closureForm).starts_at,
                            "onUpdate:modelValue": ($event) => unref(closureForm).starts_at = $event,
                            type: "datetime-local",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(closureForm).ends_at,
                            "onUpdate:modelValue": ($event) => unref(closureForm).ends_at = $event,
                            type: "datetime-local",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormGroup, { label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(closureForm).reason,
                          "onUpdate:modelValue": ($event) => unref(closureForm).reason = $event,
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      label: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UForm, {
                state: unref(closureForm),
                class: "space-y-3",
                onSubmit: withModifiers(createClosure, ["prevent"])
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormGroup, { label: "\u0417\u043E\u043D\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(closureForm).zone_id,
                        "onUpdate:modelValue": ($event) => unref(closureForm).zone_id = $event,
                        options: unref(zones),
                        "option-attribute": "name",
                        "value-attribute": "id"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                    createVNode(_component_UFormGroup, { label: "\u041D\u0430\u0447\u0430\u043B\u043E" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(closureForm).starts_at,
                          "onUpdate:modelValue": ($event) => unref(closureForm).starts_at = $event,
                          type: "datetime-local",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "\u041A\u043E\u043D\u0435\u0446" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(closureForm).ends_at,
                          "onUpdate:modelValue": ($event) => unref(closureForm).ends_at = $event,
                          type: "datetime-local",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_UFormGroup, { label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(closureForm).reason,
                        "onUpdate:modelValue": ($event) => unref(closureForm).reason = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    label: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435"
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
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold"${_scopeId}>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0430</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0430")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><p class="text-sm text-slate-500"${_scopeId}>\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 Excel-\u0448\u0430\u0431\u043B\u043E\u043D \u0432 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 <code${_scopeId}>templates</code>.</p>`);
            _push2(ssrRenderComponent(_component_UInput, {
              type: "file",
              accept: ".xlsx,.xls",
              onChange: (payload) => templateFile.value = unref(getFirstFile)(payload)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D",
              onClick: uploadTemplate
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                createVNode("p", { class: "text-sm text-slate-500" }, [
                  createTextVNode("\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 Excel-\u0448\u0430\u0431\u043B\u043E\u043D \u0432 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 "),
                  createVNode("code", null, "templates"),
                  createTextVNode(".")
                ]),
                createVNode(_component_UInput, {
                  type: "file",
                  accept: ".xlsx,.xls",
                  onChange: (payload) => templateFile.value = unref(getFirstFile)(payload)
                }, null, 8, ["onChange"]),
                createVNode(_component_UButton, {
                  label: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D",
                  onClick: uploadTemplate
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              rows: unref(closures),
              columns: [
                { key: "starts_at", label: "\u041D\u0430\u0447\u0430\u043B\u043E" },
                { key: "ends_at", label: "\u041A\u043E\u043D\u0435\u0446" },
                { key: "reason", label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430" },
                { key: "is_active", label: "\u0410\u043A\u0442\u0438\u0432\u043D\u043E" },
                { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
              ]
            }, {
              "starts_at-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(new Date(row.starts_at).toLocaleString())}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(new Date(row.starts_at).toLocaleString()), 1)
                  ];
                }
              }),
              "ends_at-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(new Date(row.ends_at).toLocaleString())}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(new Date(row.ends_at).toLocaleString()), 1)
                  ];
                }
              }),
              "is_active-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    label: row.is_active ? "\u0414\u0430" : "\u041D\u0435\u0442",
                    color: row.is_active ? "green" : "gray"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UBadge, {
                      label: row.is_active ? "\u0414\u0430" : "\u041D\u0435\u0442",
                      color: row.is_active ? "green" : "gray"
                    }, null, 8, ["label", "color"])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    label: row.is_active ? "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C" : "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
                    onClick: ($event) => toggleClosure(row)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      size: "xs",
                      label: row.is_active ? "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C" : "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
                      onClick: ($event) => toggleClosure(row)
                    }, null, 8, ["label", "onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                rows: unref(closures),
                columns: [
                  { key: "starts_at", label: "\u041D\u0430\u0447\u0430\u043B\u043E" },
                  { key: "ends_at", label: "\u041A\u043E\u043D\u0435\u0446" },
                  { key: "reason", label: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430" },
                  { key: "is_active", label: "\u0410\u043A\u0442\u0438\u0432\u043D\u043E" },
                  { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
                ]
              }, {
                "starts_at-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(new Date(row.starts_at).toLocaleString()), 1)
                ]),
                "ends_at-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(new Date(row.ends_at).toLocaleString()), 1)
                ]),
                "is_active-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    label: row.is_active ? "\u0414\u0430" : "\u041D\u0435\u0442",
                    color: row.is_active ? "green" : "gray"
                  }, null, 8, ["label", "color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode(_component_UButton, {
                    size: "xs",
                    label: row.is_active ? "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C" : "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
                    onClick: ($event) => toggleClosure(row)
                  }, null, 8, ["label", "onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-C5GMgG0a.mjs.map
