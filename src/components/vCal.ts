import { defineComponent, h } from 'vue';
import { useCal } from '../composables/useCal';

export const CalButton = defineComponent({
  name: 'CalButton',
  props: {
    calLink: {
      type: String,
      required: true
    },
    config: {
      type: Object,
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
        config: props.config
      });
    };

    return () => h(
      props.tag,
      { onClick: handleClick },
      slots.default ? slots.default() : 'Book Meeting'
    );
  }
});
