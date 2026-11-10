import type { Directive, DirectiveBinding } from 'vue';
import { useCal } from '../composables/useCal';

interface CalDirectiveValue {
  link: string;
  config?: Record<string, any>;
}

type CalElement = HTMLElement & {
  _calHandler?: (e: MouseEvent) => void;
  _calValue?: string | CalDirectiveValue;
};

export const vCal: Directive<HTMLElement, string | CalDirectiveValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | CalDirectiveValue>) {
    const handler = () => {
      const { openModal } = useCal();
      if (typeof binding.value === 'string') {
        openModal({ calLink: binding.value });
      } else if (binding.value && binding.value.link) {
        openModal({ calLink: binding.value.link, config: binding.value.config });
      }
    };

    (el as any)._calHandler = handler;
    el.addEventListener('click', handler);
  },
  updated(el: CalElement, binding: DirectiveBinding<string | CalDirectiveValue>) {
    el._calValue = binding.value;
  },
  unmounted(el: HTMLElement) {
    if ((el as any)._calHandler) {
      el.removeEventListener('click', (el as any)._calHandler);
      delete (el as any)._calHandler;
    }
  },
  getSSRProps() {
    return {};
  }
};
