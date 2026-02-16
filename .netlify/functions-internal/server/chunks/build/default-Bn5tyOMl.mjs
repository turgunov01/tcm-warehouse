import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { a as useRoute, c as useAuthRbac, b as useSupabaseClient, n as navigateTo } from './server.mjs';
import 'tailwind-merge';
import './index-CyWm_zZC.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import 'vue-router';
import '@vueuse/core';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { user, profile, roleHome } = useAuthRbac();
    const isLogin = computed(() => route.path === "/login");
    const links = computed(() => {
      var _a;
      const role = (_a = profile.value) == null ? void 0 : _a.role;
      if (role === "admin") {
        return [
          { label: "\u041F\u0430\u043D\u0435\u043B\u044C", to: "/admin" },
          { label: "\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F", to: "/admin/bookings" },
          { label: "\u0417\u043E\u043D\u044B", to: "/admin/zones" },
          { label: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438", to: "/admin/users" },
          { label: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438", to: "/admin/settings" },
          { label: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", to: "/admin/notifications" },
          { label: "\u0410\u0443\u0434\u0438\u0442", to: "/admin/audit" }
        ];
      }
      if (role === "tenant") {
        return [
          { label: "\u041F\u0430\u043D\u0435\u043B\u044C", to: "/tenant" },
          { label: "\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F", to: "/tenant/bookings" },
          { label: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F", to: "/tenant/history" },
          { label: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", to: "/tenant/profile" },
          { label: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", to: "/tenant/notifications" }
        ];
      }
      if (role === "guard") {
        return [
          { label: "\u0417\u043E\u043D\u044B", to: "/guard" },
          { label: "\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F", to: "/guard/bookings" }
        ];
      }
      return [];
    });
    const supabase = useSupabaseClient();
    const logout = async () => {
      await supabase.auth.signOut();
      await navigateTo("/login");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UCard = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-shell" }, _attrs))}>`);
      if (unref(isLogin)) {
        _push(`<div>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<div class="mx-auto flex max-w-[1440px] gap-4 p-4 lg:p-6"><aside class="hidden w-64 shrink-0 lg:block">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b, _c, _d, _e, _f;
            if (_push2) {
              _push2(`<div class="space-y-1"${_scopeId}><p class="text-sm text-slate-500"${_scopeId}>TCM Warehouse</p><p class="font-semibold"${_scopeId}>${ssrInterpolate(((_a2 = unref(profile)) == null ? void 0 : _a2.full_name) || ((_b = unref(profile)) == null ? void 0 : _b.username) || ((_c = unref(user)) == null ? void 0 : _c.email))}</p></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-1" }, [
                  createVNode("p", { class: "text-sm text-slate-500" }, "TCM Warehouse"),
                  createVNode("p", { class: "font-semibold" }, toDisplayString(((_d = unref(profile)) == null ? void 0 : _d.full_name) || ((_e = unref(profile)) == null ? void 0 : _e.username) || ((_f = unref(user)) == null ? void 0 : _f.email)), 1)
                ])
              ];
            }
          }),
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                label: "\u0412\u044B\u0439\u0442\u0438",
                color: "white",
                block: "",
                onClick: logout
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  label: "\u0412\u044B\u0439\u0442\u0438",
                  color: "white",
                  block: "",
                  onClick: logout
                })
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(links), (link) => {
                _push2(ssrRenderComponent(_component_UButton, {
                  key: link.to,
                  to: link.to,
                  block: "",
                  color: "white",
                  variant: "ghost",
                  label: link.label
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(links), (link) => {
                    return openBlock(), createBlock(_component_UButton, {
                      key: link.to,
                      to: link.to,
                      block: "",
                      color: "white",
                      variant: "ghost",
                      label: link.label
                    }, null, 8, ["to", "label"]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</aside><main class="w-full min-w-0"><div class="mb-4 flex items-center justify-between lg:hidden">`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-heroicons-arrow-top-right-on-square",
          to: unref(roleHome)((_a = unref(profile)) == null ? void 0 : _a.role),
          label: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          label: "\u0412\u044B\u0439\u0442\u0438",
          color: "white",
          variant: "outline",
          onClick: logout
        }, null, _parent));
        _push(`</div>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</main></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-Bn5tyOMl.mjs.map
