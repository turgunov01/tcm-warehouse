import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_8 } from './Table-BxGkz4HY.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { _ as __nuxt_component_6 } from './Modal-pRgefxjN.mjs';
import { defineComponent, ref, reactive, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, isRef, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { b as useSupabaseClient, f as useSupabaseUser } from './server.mjs';
import { u as useWarehouse } from './useWarehouse-DYq1S74A.mjs';
import { u as useRuLabels } from './useRuLabels-B4xkMTP6.mjs';
import 'tailwind-merge';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './useFormGroup-DqE91r20.mjs';
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
import './nuxt-link-Bv1Nr2cZ.mjs';
import './active-element-history-CsQcsyjA.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "history",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const { fetchBookings } = useWarehouse();
    const { bookingStatusLabel } = useRuLabels();
    const rows = ref([]);
    const selected = ref(null);
    const open = ref(false);
    const loadingDocs = ref(false);
    const docsError = ref("");
    const docUrls = reactive({
      passportFront: "",
      passportBack: "",
      platePhoto: ""
    });
    const load = async () => {
      var _a;
      if (!((_a = user.value) == null ? void 0 : _a.id)) {
        rows.value = [];
        return;
      }
      rows.value = await fetchBookings({ tenantIds: [user.value.id] });
    };
    const createSignedDocumentUrl = async (path) => {
      if (!path) {
        return "";
      }
      const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 60 * 30);
      if (error) {
        return "";
      }
      return (data == null ? void 0 : data.signedUrl) || "";
    };
    const showDetails = async (row) => {
      selected.value = row;
      open.value = true;
      docsError.value = "";
      loadingDocs.value = true;
      try {
        const [passportFront, passportBack, platePhoto] = await Promise.all([
          createSignedDocumentUrl(row.driver_passport_front),
          createSignedDocumentUrl(row.driver_passport_back),
          createSignedDocumentUrl(row.car_plate_photo)
        ]);
        docUrls.passportFront = passportFront;
        docUrls.passportBack = passportBack;
        docUrls.platePhoto = platePhoto;
      } catch {
        docsError.value = "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432.";
        docUrls.passportFront = "";
        docUrls.passportBack = "";
        docUrls.platePhoto = "";
      } finally {
        loadingDocs.value = false;
      }
    };
    watch(open, (isOpen) => {
      if (isOpen) {
        return;
      }
      docsError.value = "";
      docUrls.passportFront = "";
      docUrls.passportBack = "";
      docUrls.platePhoto = "";
    });
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
      const _component_UCard = __nuxt_component_0$1;
      const _component_UTable = __nuxt_component_8;
      const _component_UButton = __nuxt_component_1;
      const _component_UModal = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u0418\u0441\u0442\u043E\u0440\u0438\u044F</h1><p class="text-sm text-slate-500">\u0412\u0441\u0435 \u043F\u0440\u043E\u0448\u043B\u044B\u0435 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0438 \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F.</p></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTable, {
              rows: unref(rows),
              columns: [
                { key: "requested_datetime", label: "\u0414\u0430\u0442\u0430" },
                { key: "status", label: "\u0421\u0442\u0430\u0442\u0443\u0441" },
                { key: "driver_name", label: "\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C" },
                { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
              ]
            }, {
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(bookingStatusLabel)(row.status))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(bookingStatusLabel)(row.status)), 1)
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
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    label: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",
                    onClick: ($event) => showDetails(row)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      size: "xs",
                      label: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",
                      onClick: ($event) => showDetails(row)
                    }, null, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTable, {
                rows: unref(rows),
                columns: [
                  { key: "requested_datetime", label: "\u0414\u0430\u0442\u0430" },
                  { key: "status", label: "\u0421\u0442\u0430\u0442\u0443\u0441" },
                  { key: "driver_name", label: "\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C" },
                  { key: "actions", label: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" }
                ]
              }, {
                "status-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(unref(bookingStatusLabel)(row.status)), 1)
                ]),
                "requested_datetime-data": withCtx(({ row }) => [
                  createTextVNode(toDisplayString(new Date(row.requested_datetime).toLocaleString()), 1)
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode(_component_UButton, {
                    size: "xs",
                    label: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",
                    onClick: ($event) => showDetails(row)
                  }, null, 8, ["onClick"])
                ]),
                _: 2
              }, 1032, ["rows"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(open),
        "onUpdate:modelValue": ($event) => isRef(open) ? open.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="font-semibold"${_scopeId2}>\u0414\u0430\u043D\u043D\u044B\u0435 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F</p>`);
                } else {
                  return [
                    createVNode("p", { class: "font-semibold" }, "\u0414\u0430\u043D\u043D\u044B\u0435 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(selected)) {
                    _push3(`<div class="space-y-3 text-sm"${_scopeId2}><p${_scopeId2}><strong${_scopeId2}>\u0418\u043C\u044F:</strong> ${ssrInterpolate(unref(selected).driver_name)}</p><p${_scopeId2}><strong${_scopeId2}>\u041D\u043E\u043C\u0435\u0440 \u043C\u0430\u0448\u0438\u043D\u044B:</strong> ${ssrInterpolate(unref(selected).car_plate_text)}</p><div class="grid gap-3 md:grid-cols-2"${_scopeId2}><div${_scopeId2}><p class="mb-1 font-semibold"${_scopeId2}>\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)</p>`);
                    if (unref(docUrls).passportFront) {
                      _push3(`<img${ssrRenderAttr("src", unref(docUrls).passportFront)} alt="\u041F\u0430\u0441\u043F\u043E\u0440\u0442 \u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430" class="h-44 w-full rounded border border-[#eeeeee] object-cover"${_scopeId2}>`);
                    } else if (unref(loadingDocs)) {
                      _push3(`<p${_scopeId2}>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...</p>`);
                    } else {
                      _push3(`<p${_scopeId2}>\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D.</p>`);
                    }
                    _push3(`</div><div${_scopeId2}><p class="mb-1 font-semibold"${_scopeId2}>\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)</p>`);
                    if (unref(docUrls).passportBack) {
                      _push3(`<img${ssrRenderAttr("src", unref(docUrls).passportBack)} alt="\u041F\u0430\u0441\u043F\u043E\u0440\u0442 \u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430" class="h-44 w-full rounded border border-[#eeeeee] object-cover"${_scopeId2}>`);
                    } else if (unref(loadingDocs)) {
                      _push3(`<p${_scopeId2}>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...</p>`);
                    } else {
                      _push3(`<p${_scopeId2}>\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D.</p>`);
                    }
                    _push3(`</div></div><div${_scopeId2}><p class="mb-1 font-semibold"${_scopeId2}>\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430</p>`);
                    if (unref(docUrls).platePhoto) {
                      _push3(`<img${ssrRenderAttr("src", unref(docUrls).platePhoto)} alt="\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430" class="h-44 w-full rounded border border-[#eeeeee] object-cover"${_scopeId2}>`);
                    } else if (unref(loadingDocs)) {
                      _push3(`<p${_scopeId2}>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...</p>`);
                    } else {
                      _push3(`<p${_scopeId2}>\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D.</p>`);
                    }
                    _push3(`</div>`);
                    if (unref(docsError)) {
                      _push3(`<p class="text-red-600"${_scopeId2}>${ssrInterpolate(unref(docsError))}</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(selected) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-3 text-sm"
                    }, [
                      createVNode("p", null, [
                        createVNode("strong", null, "\u0418\u043C\u044F:"),
                        createTextVNode(" " + toDisplayString(unref(selected).driver_name), 1)
                      ]),
                      createVNode("p", null, [
                        createVNode("strong", null, "\u041D\u043E\u043C\u0435\u0440 \u043C\u0430\u0448\u0438\u043D\u044B:"),
                        createTextVNode(" " + toDisplayString(unref(selected).car_plate_text), 1)
                      ]),
                      createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "mb-1 font-semibold" }, "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)"),
                          unref(docUrls).passportFront ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: unref(docUrls).passportFront,
                            alt: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 \u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430",
                            class: "h-44 w-full rounded border border-[#eeeeee] object-cover"
                          }, null, 8, ["src"])) : unref(loadingDocs) ? (openBlock(), createBlock("p", { key: 1 }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...")) : (openBlock(), createBlock("p", { key: 2 }, "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D."))
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "mb-1 font-semibold" }, "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)"),
                          unref(docUrls).passportBack ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: unref(docUrls).passportBack,
                            alt: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 \u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430",
                            class: "h-44 w-full rounded border border-[#eeeeee] object-cover"
                          }, null, 8, ["src"])) : unref(loadingDocs) ? (openBlock(), createBlock("p", { key: 1 }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...")) : (openBlock(), createBlock("p", { key: 2 }, "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D."))
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "mb-1 font-semibold" }, "\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430"),
                        unref(docUrls).platePhoto ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: unref(docUrls).platePhoto,
                          alt: "\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430",
                          class: "h-44 w-full rounded border border-[#eeeeee] object-cover"
                        }, null, 8, ["src"])) : unref(loadingDocs) ? (openBlock(), createBlock("p", { key: 1 }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...")) : (openBlock(), createBlock("p", { key: 2 }, "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D."))
                      ]),
                      unref(docsError) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-red-600"
                      }, toDisplayString(unref(docsError)), 1)) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("p", { class: "font-semibold" }, "\u0414\u0430\u043D\u043D\u044B\u0435 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F")
                ]),
                default: withCtx(() => [
                  unref(selected) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "space-y-3 text-sm"
                  }, [
                    createVNode("p", null, [
                      createVNode("strong", null, "\u0418\u043C\u044F:"),
                      createTextVNode(" " + toDisplayString(unref(selected).driver_name), 1)
                    ]),
                    createVNode("p", null, [
                      createVNode("strong", null, "\u041D\u043E\u043C\u0435\u0440 \u043C\u0430\u0448\u0438\u043D\u044B:"),
                      createTextVNode(" " + toDisplayString(unref(selected).car_plate_text), 1)
                    ]),
                    createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "mb-1 font-semibold" }, "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)"),
                        unref(docUrls).passportFront ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: unref(docUrls).passportFront,
                          alt: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 \u043B\u0438\u0446\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430",
                          class: "h-44 w-full rounded border border-[#eeeeee] object-cover"
                        }, null, 8, ["src"])) : unref(loadingDocs) ? (openBlock(), createBlock("p", { key: 1 }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...")) : (openBlock(), createBlock("p", { key: 2 }, "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D."))
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "mb-1 font-semibold" }, "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 (\u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430)"),
                        unref(docUrls).passportBack ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: unref(docUrls).passportBack,
                          alt: "\u041F\u0430\u0441\u043F\u043E\u0440\u0442 \u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430",
                          class: "h-44 w-full rounded border border-[#eeeeee] object-cover"
                        }, null, 8, ["src"])) : unref(loadingDocs) ? (openBlock(), createBlock("p", { key: 1 }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...")) : (openBlock(), createBlock("p", { key: 2 }, "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D."))
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("p", { class: "mb-1 font-semibold" }, "\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430"),
                      unref(docUrls).platePhoto ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: unref(docUrls).platePhoto,
                        alt: "\u0424\u043E\u0442\u043E \u0433\u043E\u0441\u043D\u043E\u043C\u0435\u0440\u0430",
                        class: "h-44 w-full rounded border border-[#eeeeee] object-cover"
                      }, null, 8, ["src"])) : unref(loadingDocs) ? (openBlock(), createBlock("p", { key: 1 }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...")) : (openBlock(), createBlock("p", { key: 2 }, "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D."))
                    ]),
                    unref(docsError) ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-red-600"
                    }, toDisplayString(unref(docsError)), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tenant/history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=history-CU-6C_tH.mjs.map
