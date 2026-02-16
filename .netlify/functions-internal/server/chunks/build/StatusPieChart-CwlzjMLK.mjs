import { _ as __nuxt_component_0$1 } from './useButtonGroup-Od5NeROe.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_1 } from './index-CyWm_zZC.mjs';
import { Pie } from 'vue-chartjs';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

const getEl = (target) => {
  if (typeof target === "string") {
    return (void 0).querySelector(target);
  }
  return target;
};
const useGsap = () => {
  const getGsap = async () => {
    {
      return null;
    }
  };
  const animateCount = async (target, from, to, duration = 0.9) => {
    const el = getEl(target);
    const gsap = await getGsap();
    if (!el || !gsap) {
      return;
    }
    const state = { value: from };
    gsap.to(state, {
      value: to,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Number(state.value).toFixed(0);
      }
    });
  };
  const animateIn = async (target, options = {}) => {
    var _a, _b, _c, _d, _e, _f;
    const el = getEl(target);
    const gsap = await getGsap();
    if (!el || !gsap) {
      return;
    }
    gsap.fromTo(
      el,
      {
        opacity: (_a = options.opacity) != null ? _a : 0,
        y: (_b = options.y) != null ? _b : 12,
        x: (_c = options.x) != null ? _c : 0,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: (_d = options.duration) != null ? _d : 0.45,
        delay: (_e = options.delay) != null ? _e : 0,
        ease: (_f = options.ease) != null ? _f : "power2.out"
      }
    );
  };
  const staggerList = async (container, itemSelector, options = {}) => {
    var _a, _b, _c, _d, _e;
    const root = getEl(container);
    const gsap = await getGsap();
    if (!root || !gsap) {
      return;
    }
    const items = root.querySelectorAll(itemSelector);
    if (!items.length) {
      return;
    }
    gsap.fromTo(
      items,
      {
        opacity: (_a = options.opacity) != null ? _a : 0,
        y: (_b = options.y) != null ? _b : 8
      },
      {
        opacity: 1,
        y: 0,
        duration: (_c = options.duration) != null ? _c : 0.35,
        stagger: (_d = options.stagger) != null ? _d : 0.06,
        ease: (_e = options.ease) != null ? _e : "power2.out"
      }
    );
  };
  return {
    animateCount,
    animateIn,
    staggerList
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DashboardStatCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    tone: {}
  },
  setup(__props) {
    const props = __props;
    const valueEl = ref(null);
    const { animateCount } = useGsap();
    const toneClass = computed(() => {
      if (props.tone === "success") return "text-emerald-600";
      if (props.tone === "warning") return "text-amber-600";
      if (props.tone === "danger") return "text-rose-600";
      return "text-slate-900";
    });
    watch(
      () => props.value,
      async (next, prev) => {
        if (!valueEl.value) {
          return;
        }
        await animateCount(valueEl.value, prev != null ? prev : 0, next, 0.8);
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "stat-card" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-xs uppercase tracking-wide text-slate-500"${_scopeId}>${ssrInterpolate(__props.label)}</p><p class="${ssrRenderClass([unref(toneClass), "mt-2 text-3xl font-semibold"])}"${_scopeId}>0</p>`);
          } else {
            return [
              createVNode("p", { class: "text-xs uppercase tracking-wide text-slate-500" }, toDisplayString(__props.label), 1),
              createVNode("p", {
                ref_key: "valueEl",
                ref: valueEl,
                class: ["mt-2 text-3xl font-semibold", unref(toneClass)]
              }, "0", 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DashboardStatCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StatusPieChart",
  __ssrInlineRender: true,
  props: {
    title: {},
    labels: {},
    values: {}
  },
  setup(__props) {
    Chart.register(ArcElement, Tooltip, Legend);
    const props = __props;
    const chartData = computed(() => ({
      labels: props.labels,
      datasets: [
        {
          data: props.values,
          backgroundColor: ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1"]
        }
      ]
    }));
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      },
      animation: {
        duration: 650
      }
    };
    const wrapper = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_ClientOnly = __nuxt_component_1;
      _push(ssrRenderComponent(_component_UCard, mergeProps({
        ref_key: "wrapper",
        ref: wrapper
      }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold"${_scopeId}>${ssrInterpolate(__props.title)}</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold" }, toDisplayString(__props.title), 1)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ClientOnly, null, {}, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ClientOnly, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "h-72" }, [
                    createVNode(unref(Pie), {
                      data: unref(chartData),
                      options: chartOptions
                    }, null, 8, ["data"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatusPieChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$1 as _, _sfc_main as a };
//# sourceMappingURL=StatusPieChart-CwlzjMLK.mjs.map
