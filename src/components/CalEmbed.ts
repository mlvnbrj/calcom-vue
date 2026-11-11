import { defineComponent, h, ref, onMounted, onUnmounted, watch, type PropType } from 'vue';
import { useCal } from '../composables/useCal';

export const CalEmbed = defineComponent({
  name: 'CalEmbed',
  props: {
    calLink: {
      type: String,
      required: true
    },
    namespace: {
      type: String,
      default: undefined
    },
    config: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    }
  },
  setup(props, { attrs }) {
    const containerRef = ref<HTMLDivElement | null>(null);
    const { inline } = useCal();

    const mountEmbed = () => {
      if (!containerRef.value) return;
      inline({
        elementOrSelector: containerRef.value,
        calLink: props.calLink,
        namespace: props.namespace,
        config: props.config
      });
    };

    onMounted(() => {
      mountEmbed();
    });

    watch(
      () => [props.calLink, props.namespace, props.config],
      () => {
        mountEmbed();
      },
      { deep: true }
    );

    onUnmounted(() => {
      if (containerRef.value) {
        containerRef.value.innerHTML = '';
      }
    });

    return () =>
      h('div', {
        ref: containerRef,
        style: {
          width: '100%',
          height: '100%',
          overflow: 'scroll',
          ...(typeof attrs.style === 'object' && attrs.style !== null ? attrs.style : {})
        }
      });
  }
});

export const Cal = CalEmbed;
