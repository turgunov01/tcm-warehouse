import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { _ as __nuxt_component_1 } from './Button-CrgxThWw.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { b as useSupabaseClient, c as useAuthRbac, d as useState, n as navigateTo } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const { user } = useAuthRbac();
    const selectedZone = useState("guard-zone", () => null);
    const zones = ref([]);
    const chooseZone = async (id) => {
      selectedZone.value = id;
      if (user.value) {
        await supabase.from("profiles").update({ zone_id: id }).eq("id", user.value.id);
      }
      navigateTo("/guard/bookings");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><h1 class="text-2xl font-semibold">\u0412\u044B\u0431\u043E\u0440 \u0437\u043E\u043D\u044B \u043E\u0445\u0440\u0430\u043D\u044B</h1><p class="text-sm text-slate-500">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u043E\u043D\u0443 \u0434\u043B\u044F \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044F \u043E\u0447\u0435\u0440\u0435\u0434\u0438 \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F.</p></div><div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(zones), (zone) => {
        _push(ssrRenderComponent(_component_UCard, {
          key: zone.id
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-3"${_scopeId}><p class="text-lg font-semibold"${_scopeId}>${ssrInterpolate(zone.name)}</p><p class="text-sm text-slate-500"${_scopeId}>${ssrInterpolate(zone.description || "\u0411\u0435\u0437 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F")}</p>`);
              _push2(ssrRenderComponent(_component_UButton, {
                label: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0437\u043E\u043D\u0443",
                color: "white",
                block: "",
                onClick: ($event) => chooseZone(zone.id)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-3" }, [
                  createVNode("p", { class: "text-lg font-semibold" }, toDisplayString(zone.name), 1),
                  createVNode("p", { class: "text-sm text-slate-500" }, toDisplayString(zone.description || "\u0411\u0435\u0437 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F"), 1),
                  createVNode(_component_UButton, {
                    label: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0437\u043E\u043D\u0443",
                    color: "white",
                    block: "",
                    onClick: ($event) => chooseZone(zone.id)
                  }, null, 8, ["onClick"])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/guard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D7_SHnz_.mjs.map
