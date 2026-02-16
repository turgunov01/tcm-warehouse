import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { _ as _sfc_main$1 } from './BookingFilters-D2T0XxJR.mjs';
import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_3, a as _sfc_main$1$1, b as _sfc_main$2 } from './BookingCalendar-BWxIqXQn.mjs';
import { _ as __nuxt_component_6 } from './Modal-pRgefxjN.mjs';
import { _ as __nuxt_component_2 } from './Form-B_6MfFER.mjs';
import { _ as __nuxt_component_3$1, a as __nuxt_component_4 } from './Input-CoU3nx0Q.mjs';
import { _ as __nuxt_component_6$1 } from './SelectMenu-CepcR2XP.mjs';
import { a as __nuxt_component_11 } from './Table-BxGkz4HY.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, isRef, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useSupabaseClient, f as useSupabaseUser, c as useAuthRbac } from './server.mjs';
import { u as useWarehouse } from './useWarehouse-DYq1S74A.mjs';
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
import 'tailwind-merge';
import './useRuLabels-B4xkMTP6.mjs';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './Badge-DxNY05Lj.mjs';
import './active-element-history-CsQcsyjA.mjs';
import '@vueuse/core';
import './useFormGroup-DqE91r20.mjs';
import '@tanstack/vue-virtual';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "bookings",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const { fetchBookings } = useWarehouse();
    const { profile } = useAuthRbac();
    const bookings = ref([]);
    const viewMode = ref("table");
    const filters = ref({
      from: "",
      to: "",
      statuses: []
    });
    const isCreateOpen = ref(false);
    const loading = ref(false);
    const formNotice = ref("");
    const settings = ref(null);
    const bookedSlotValues = ref([]);
    const form = reactive({
      driver_name: "",
      car_plate_text: "",
      requested_datetime: "",
      is_express: false,
      driver_passport_front: null,
      driver_passport_back: null,
      car_plate_photo: null
    });
    const pad2 = (value) => String(value).padStart(2, "0");
    const toDatetimeLocalValue = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    const formatSlotLabel = (date) => date.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const toDateKey = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
    const buildFreeSlotOptions = (targetDate) => {
      const startMinutes = 0;
      const endMinutes = 19 * 60;
      const slots = [];
      for (let cursor = startMinutes; cursor <= endMinutes; cursor += 30) {
        const minutesInDay = cursor;
        const slotDate = new Date(targetDate);
        slotDate.setHours(Math.floor(minutesInDay / 60), minutesInDay % 60, 0, 0);
        slots.push({
          label: formatSlotLabel(slotDate),
          value: toDatetimeLocalValue(slotDate)
        });
      }
      return slots;
    };
    const requestedBaseDate = computed(() => {
      const date = /* @__PURE__ */ new Date();
      date.setHours(0, 0, 0, 0);
      if (!form.is_express) {
        date.setDate(date.getDate() + 1);
      }
      return date;
    });
    const freeSlotOptions = computed(() => {
      const booked = new Set(bookedSlotValues.value);
      return buildFreeSlotOptions(requestedBaseDate.value).map((slot) => ({
        ...slot,
        disabled: booked.has(slot.value)
      }));
    });
    const hasAvailableSlots = computed(() => freeSlotOptions.value.some((slot) => !slot.disabled));
    const onFileChange = (field, payload) => {
      var _a, _b, _c, _d;
      let file = null;
      if (payload instanceof FileList) {
        file = payload.item(0);
      } else if (Array.isArray(payload)) {
        file = (_a = payload[0]) != null ? _a : null;
      } else if (payload && typeof payload === "object" && "target" in payload) {
        file = (_d = (_c = (_b = payload.target) == null ? void 0 : _b.files) == null ? void 0 : _c[0]) != null ? _d : null;
      }
      form[field] = file;
    };
    const loadBookedSlots = async () => {
      var _a;
      const dateKey = toDateKey(requestedBaseDate.value);
      let query = supabase.from("bookings").select("requested_datetime, status, zone_id").gte("requested_datetime", `${dateKey}T00:00:00`).lte("requested_datetime", `${dateKey}T23:59:59`).in("status", ["pending", "approved", "arrived", "left", "completed"]);
      if ((_a = profile.value) == null ? void 0 : _a.zone_id) {
        query = query.eq("zone_id", profile.value.zone_id);
      }
      const { data, error } = await query;
      if (error) {
        bookedSlotValues.value = [];
        return;
      }
      bookedSlotValues.value = Array.from(
        new Set((data != null ? data : []).map((row) => toDatetimeLocalValue(new Date(row.requested_datetime))))
      );
    };
    const uploadFile = async (file) => {
      if (!user.value) {
        throw new Error("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
      }
      const ext = file.name.split(".").pop() || "bin";
      const path = `${user.value.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
      if (error) {
        throw error;
      }
      return path;
    };
    const estimatedExpress = computed(() => {
      var _a;
      return Number(((_a = settings.value) == null ? void 0 : _a.hourly_penalty) || 0);
    });
    const createBooking = async () => {
      var _a;
      if (!form.requested_datetime) {
        formNotice.value = "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0439 \u0441\u043B\u043E\u0442 \u0434\u0430\u0442\u044B \u0438 \u0432\u0440\u0435\u043C\u0435\u043D\u0438.";
        return;
      }
      if ((_a = freeSlotOptions.value.find((slot) => slot.value === form.requested_datetime)) == null ? void 0 : _a.disabled) {
        formNotice.value = "\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u0441\u043B\u043E\u0442 \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439.";
        return;
      }
      if (!form.driver_passport_front || !form.driver_passport_back || !form.car_plate_photo) {
        formNotice.value = "\u041D\u0443\u0436\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0432\u0441\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B.";
        return;
      }
      loading.value = true;
      formNotice.value = "";
      try {
        const [front, back, platePhoto] = await Promise.all([
          uploadFile(form.driver_passport_front),
          uploadFile(form.driver_passport_back),
          uploadFile(form.car_plate_photo)
        ]);
        const { error } = await supabase.from("bookings").insert({
          driver_name: form.driver_name,
          driver_passport_front: front,
          driver_passport_back: back,
          car_plate_photo: platePhoto,
          car_plate_text: form.car_plate_text,
          requested_datetime: form.requested_datetime,
          is_express: form.is_express
        });
        if (error) {
          formNotice.value = error.message;
          loading.value = false;
          return;
        }
        formNotice.value = "\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u043E.";
        isCreateOpen.value = false;
        form.driver_name = "";
        form.car_plate_text = "";
        form.requested_datetime = "";
        form.is_express = false;
        form.driver_passport_front = null;
        form.driver_passport_back = null;
        form.car_plate_photo = null;
        await load();
      } catch (error) {
        formNotice.value = (error == null ? void 0 : error.message) || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435";
      } finally {
        loading.value = false;
      }
    };
    const load = async () => {
      var _a;
      if (!((_a = user.value) == null ? void 0 : _a.id)) {
        bookings.value = [];
        return;
      }
      bookings.value = await fetchBookings({
        from: filters.value.from ? `${filters.value.from}T00:00:00` : void 0,
        to: filters.value.to ? `${filters.value.to}T23:59:59` : void 0,
        statuses: filters.value.statuses,
        tenantIds: [user.value.id]
      });
    };
    watch(filters, load, { deep: true });
    watch(
      () => {
        var _a;
        return (_a = user.value) == null ? void 0 : _a.id;
      },
      () => {
        load();
      }
    );
    watch(
      freeSlotOptions,
      (options) => {
        const current = options.find((slot) => slot.value === form.requested_datetime);
        if (!current || current.disabled) {
          const firstAvailable = options.find((slot) => !slot.disabled);
          form.requested_datetime = (firstAvailable == null ? void 0 : firstAvailable.value) || "";
        }
      },
      { immediate: true }
    );
    watch(
      [requestedBaseDate, isCreateOpen, () => {
        var _a;
        return (_a = profile.value) == null ? void 0 : _a.zone_id;
      }],
      async ([, modalOpen]) => {
        if (!modalOpen) {
          return;
        }
        await loadBookedSlots();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_1;
      const _component_BookingFilters = _sfc_main$1;
      const _component_UCard = __nuxt_component_0$1;
      const _component_UButtonGroup = __nuxt_component_3;
      const _component_BookingTable = _sfc_main$1$1;
      const _component_BookingCalendar = _sfc_main$2;
      const _component_UModal = __nuxt_component_6;
      const _component_UForm = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_3$1;
      const _component_UInput = __nuxt_component_4;
      const _component_USelectMenu = __nuxt_component_6$1;
      const _component_UCheckbox = __nuxt_component_11;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3"><div><h1 class="text-2xl font-semibold">\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F</h1><p class="text-sm text-slate-500">\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0438 \u043E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0439 \u043F\u043E \u0437\u043E\u043D\u0435.</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        label: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
        color: "white",
        onClick: ($event) => isCreateOpen.value = true
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_BookingFilters, {
        modelValue: unref(filters),
        "onUpdate:modelValue": ($event) => isRef(filters) ? filters.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end"${_scopeId}>`);
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
              createVNode("div", { class: "flex justify-end" }, [
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
      if (unref(viewMode) === "table") {
        _push(ssrRenderComponent(_component_BookingTable, { rows: unref(bookings) }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_BookingCalendar, { rows: unref(bookings) }, null, _parent));
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(isCreateOpen),
        "onUpdate:modelValue": ($event) => isRef(isCreateOpen) ? isCreateOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="font-semibold"${_scopeId2}>\u041D\u043E\u0432\u043E\u0435 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435</p>`);
                } else {
                  return [
                    createVNode("p", { class: "font-semibold" }, "\u041D\u043E\u0432\u043E\u0435 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UForm, {
                    state: unref(form),
                    class: "space-y-3",
                    onSubmit: createBooking
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UFormGroup, { label: "\u0418\u043C\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).driver_name,
                                "onUpdate:modelValue": ($event) => unref(form).driver_name = $event,
                                required: ""
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).driver_name,
                                  "onUpdate:modelValue": ($event) => unref(form).driver_name = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, { label: "\u041D\u043E\u043C\u0435\u0440 \u043C\u0430\u0448\u0438\u043D\u044B" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                modelValue: unref(form).car_plate_text,
                                "onUpdate:modelValue": ($event) => unref(form).car_plate_text = $event,
                                required: ""
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  modelValue: unref(form).car_plate_text,
                                  "onUpdate:modelValue": ($event) => unref(form).car_plate_text = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, { label: "\u0416\u0435\u043B\u0430\u0435\u043C\u0430\u044F \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_USelectMenu, {
                                modelValue: unref(form).requested_datetime,
                                "onUpdate:modelValue": ($event) => unref(form).requested_datetime = $event,
                                options: unref(freeSlotOptions),
                                "option-attribute": "label",
                                "value-attribute": "value",
                                disabled: !unref(hasAvailableSlots),
                                searchable: false,
                                placeholder: "\u041D\u0435\u0442 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0445 \u0441\u043B\u043E\u0442\u043E\u0432",
                                required: ""
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_USelectMenu, {
                                  modelValue: unref(form).requested_datetime,
                                  "onUpdate:modelValue": ($event) => unref(form).requested_datetime = $event,
                                  options: unref(freeSlotOptions),
                                  "option-attribute": "label",
                                  "value-attribute": "value",
                                  disabled: !unref(hasAvailableSlots),
                                  searchable: false,
                                  placeholder: "\u041D\u0435\u0442 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0445 \u0441\u043B\u043E\u0442\u043E\u0432",
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UCheckbox, {
                          modelValue: unref(form).is_express,
                          "onUpdate:modelValue": ($event) => unref(form).is_express = $event,
                          label: "\u042D\u043A\u0441\u043F\u0440\u0435\u0441\u0441-\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 (\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043B\u044F \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F)"
                        }, null, _parent4, _scopeId3));
                        _push4(`<p class="text-xs text-slate-500"${_scopeId3}>\u041E\u0446\u0435\u043D\u043E\u0447\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u044D\u043A\u0441\u043F\u0440\u0435\u0441\u0441\u0430: ${ssrInterpolate(unref(estimatedExpress))}</p>`);
                        _push4(ssrRenderComponent(_component_UFormGroup, { label: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                type: "file",
                                accept: "image/*",
                                required: "",
                                onChange: (payload) => onFileChange("driver_passport_front", payload)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  type: "file",
                                  accept: "image/*",
                                  required: "",
                                  onChange: (payload) => onFileChange("driver_passport_front", payload)
                                }, null, 8, ["onChange"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, { label: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                type: "file",
                                accept: "image/*",
                                required: "",
                                onChange: (payload) => onFileChange("driver_passport_back", payload)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  type: "file",
                                  accept: "image/*",
                                  required: "",
                                  onChange: (payload) => onFileChange("driver_passport_back", payload)
                                }, null, 8, ["onChange"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UFormGroup, { label: "\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UInput, {
                                type: "file",
                                accept: "image/*",
                                required: "",
                                onChange: (payload) => onFileChange("car_plate_photo", payload)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UInput, {
                                  type: "file",
                                  accept: "image/*",
                                  required: "",
                                  onChange: (payload) => onFileChange("car_plate_photo", payload)
                                }, null, 8, ["onChange"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (unref(formNotice)) {
                          _push4(`<p class="text-sm text-slate-600"${_scopeId3}>${ssrInterpolate(unref(formNotice))}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="flex justify-end gap-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_UButton, {
                          label: "\u041E\u0442\u043C\u0435\u043D\u0430",
                          variant: "ghost",
                          onClick: ($event) => isCreateOpen.value = false
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_UButton, {
                          type: "submit",
                          label: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
                          color: "white",
                          loading: unref(loading)
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode(_component_UFormGroup, { label: "\u0418\u043C\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).driver_name,
                                "onUpdate:modelValue": ($event) => unref(form).driver_name = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "\u041D\u043E\u043C\u0435\u0440 \u043C\u0430\u0448\u0438\u043D\u044B" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(form).car_plate_text,
                                "onUpdate:modelValue": ($event) => unref(form).car_plate_text = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "\u0416\u0435\u043B\u0430\u0435\u043C\u0430\u044F \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F" }, {
                            default: withCtx(() => [
                              createVNode(_component_USelectMenu, {
                                modelValue: unref(form).requested_datetime,
                                "onUpdate:modelValue": ($event) => unref(form).requested_datetime = $event,
                                options: unref(freeSlotOptions),
                                "option-attribute": "label",
                                "value-attribute": "value",
                                disabled: !unref(hasAvailableSlots),
                                searchable: false,
                                placeholder: "\u041D\u0435\u0442 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0445 \u0441\u043B\u043E\u0442\u043E\u0432",
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UCheckbox, {
                            modelValue: unref(form).is_express,
                            "onUpdate:modelValue": ($event) => unref(form).is_express = $event,
                            label: "\u042D\u043A\u0441\u043F\u0440\u0435\u0441\u0441-\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 (\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043B\u044F \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F)"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode("p", { class: "text-xs text-slate-500" }, "\u041E\u0446\u0435\u043D\u043E\u0447\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u044D\u043A\u0441\u043F\u0440\u0435\u0441\u0441\u0430: " + toDisplayString(unref(estimatedExpress)), 1),
                          createVNode(_component_UFormGroup, { label: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                type: "file",
                                accept: "image/*",
                                required: "",
                                onChange: (payload) => onFileChange("driver_passport_front", payload)
                              }, null, 8, ["onChange"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                type: "file",
                                accept: "image/*",
                                required: "",
                                onChange: (payload) => onFileChange("driver_passport_back", payload)
                              }, null, 8, ["onChange"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                type: "file",
                                accept: "image/*",
                                required: "",
                                onChange: (payload) => onFileChange("car_plate_photo", payload)
                              }, null, 8, ["onChange"])
                            ]),
                            _: 1
                          }),
                          unref(formNotice) ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-slate-600"
                          }, toDisplayString(unref(formNotice)), 1)) : createCommentVNode("", true),
                          createVNode("div", { class: "flex justify-end gap-2" }, [
                            createVNode(_component_UButton, {
                              label: "\u041E\u0442\u043C\u0435\u043D\u0430",
                              variant: "ghost",
                              onClick: ($event) => isCreateOpen.value = false
                            }, null, 8, ["onClick"]),
                            createVNode(_component_UButton, {
                              type: "submit",
                              label: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
                              color: "white",
                              loading: unref(loading)
                            }, null, 8, ["loading"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UForm, {
                      state: unref(form),
                      class: "space-y-3",
                      onSubmit: withModifiers(createBooking, ["prevent"])
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UFormGroup, { label: "\u0418\u043C\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).driver_name,
                              "onUpdate:modelValue": ($event) => unref(form).driver_name = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, { label: "\u041D\u043E\u043C\u0435\u0440 \u043C\u0430\u0448\u0438\u043D\u044B" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(form).car_plate_text,
                              "onUpdate:modelValue": ($event) => unref(form).car_plate_text = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, { label: "\u0416\u0435\u043B\u0430\u0435\u043C\u0430\u044F \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(form).requested_datetime,
                              "onUpdate:modelValue": ($event) => unref(form).requested_datetime = $event,
                              options: unref(freeSlotOptions),
                              "option-attribute": "label",
                              "value-attribute": "value",
                              disabled: !unref(hasAvailableSlots),
                              searchable: false,
                              placeholder: "\u041D\u0435\u0442 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0445 \u0441\u043B\u043E\u0442\u043E\u0432",
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UCheckbox, {
                          modelValue: unref(form).is_express,
                          "onUpdate:modelValue": ($event) => unref(form).is_express = $event,
                          label: "\u042D\u043A\u0441\u043F\u0440\u0435\u0441\u0441-\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 (\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043B\u044F \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F)"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("p", { class: "text-xs text-slate-500" }, "\u041E\u0446\u0435\u043D\u043E\u0447\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u044D\u043A\u0441\u043F\u0440\u0435\u0441\u0441\u0430: " + toDisplayString(unref(estimatedExpress)), 1),
                        createVNode(_component_UFormGroup, { label: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              type: "file",
                              accept: "image/*",
                              required: "",
                              onChange: (payload) => onFileChange("driver_passport_front", payload)
                            }, null, 8, ["onChange"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, { label: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              type: "file",
                              accept: "image/*",
                              required: "",
                              onChange: (payload) => onFileChange("driver_passport_back", payload)
                            }, null, 8, ["onChange"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, { label: "\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              type: "file",
                              accept: "image/*",
                              required: "",
                              onChange: (payload) => onFileChange("car_plate_photo", payload)
                            }, null, 8, ["onChange"])
                          ]),
                          _: 1
                        }),
                        unref(formNotice) ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-slate-600"
                        }, toDisplayString(unref(formNotice)), 1)) : createCommentVNode("", true),
                        createVNode("div", { class: "flex justify-end gap-2" }, [
                          createVNode(_component_UButton, {
                            label: "\u041E\u0442\u043C\u0435\u043D\u0430",
                            variant: "ghost",
                            onClick: ($event) => isCreateOpen.value = false
                          }, null, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            type: "submit",
                            label: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
                            color: "white",
                            loading: unref(loading)
                          }, null, 8, ["loading"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["state"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("p", { class: "font-semibold" }, "\u041D\u043E\u0432\u043E\u0435 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435")
                ]),
                default: withCtx(() => [
                  createVNode(_component_UForm, {
                    state: unref(form),
                    class: "space-y-3",
                    onSubmit: withModifiers(createBooking, ["prevent"])
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UFormGroup, { label: "\u0418\u043C\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).driver_name,
                            "onUpdate:modelValue": ($event) => unref(form).driver_name = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "\u041D\u043E\u043C\u0435\u0440 \u043C\u0430\u0448\u0438\u043D\u044B" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(form).car_plate_text,
                            "onUpdate:modelValue": ($event) => unref(form).car_plate_text = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "\u0416\u0435\u043B\u0430\u0435\u043C\u0430\u044F \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(form).requested_datetime,
                            "onUpdate:modelValue": ($event) => unref(form).requested_datetime = $event,
                            options: unref(freeSlotOptions),
                            "option-attribute": "label",
                            "value-attribute": "value",
                            disabled: !unref(hasAvailableSlots),
                            searchable: false,
                            placeholder: "\u041D\u0435\u0442 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0445 \u0441\u043B\u043E\u0442\u043E\u0432",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "disabled"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UCheckbox, {
                        modelValue: unref(form).is_express,
                        "onUpdate:modelValue": ($event) => unref(form).is_express = $event,
                        label: "\u042D\u043A\u0441\u043F\u0440\u0435\u0441\u0441-\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 (\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043B\u044F \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F)"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("p", { class: "text-xs text-slate-500" }, "\u041E\u0446\u0435\u043D\u043E\u0447\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u044D\u043A\u0441\u043F\u0440\u0435\u0441\u0441\u0430: " + toDisplayString(unref(estimatedExpress)), 1),
                      createVNode(_component_UFormGroup, { label: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            type: "file",
                            accept: "image/*",
                            required: "",
                            onChange: (payload) => onFileChange("driver_passport_front", payload)
                          }, null, 8, ["onChange"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            type: "file",
                            accept: "image/*",
                            required: "",
                            onChange: (payload) => onFileChange("driver_passport_back", payload)
                          }, null, 8, ["onChange"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            type: "file",
                            accept: "image/*",
                            required: "",
                            onChange: (payload) => onFileChange("car_plate_photo", payload)
                          }, null, 8, ["onChange"])
                        ]),
                        _: 1
                      }),
                      unref(formNotice) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-slate-600"
                      }, toDisplayString(unref(formNotice)), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "flex justify-end gap-2" }, [
                        createVNode(_component_UButton, {
                          label: "\u041E\u0442\u043C\u0435\u043D\u0430",
                          variant: "ghost",
                          onClick: ($event) => isCreateOpen.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          type: "submit",
                          label: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
                          color: "white",
                          loading: unref(loading)
                        }, null, 8, ["loading"])
                      ])
                    ]),
                    _: 1
                  }, 8, ["state"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tenant/bookings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=bookings-BdObRlz_.mjs.map
