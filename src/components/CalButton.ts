import { defineComponent, h, type PropType } from 'vue';
import { useCal } from '../composables/useCal';

export const CalButton = defineComponent({
  name: 'CalButton',
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
    },
    tag: {
      type: String,
      default: 'button'
    }
  },
  setup(props, { slots }) {
    const { openModal } = useCal();

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      openModal({
        calLink: props.calLink,
        namespace: props.namespace,
        config: props.config
      });
    };

    return () =>
      h(
        props.tag,
        { onClick: handleClick },
        slots.default ? slots.default() : 'Book Meeting'
      );
  }
});
