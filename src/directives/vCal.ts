import type { Directive, DirectiveBinding } from 'vue';
import { useCal } from '../composables/useCal';

interface CalDirectiveBinding {
  link: string;
  namespace?: string;
  config?: Record<string, any>;
}

type CalElement = HTMLElement & {
  _calHandler?: (e: MouseEvent) => void;
  _calValue?: string | CalDirectiveBinding;
};

export const vCal: Directive<HTMLElement, string | CalDirectiveBinding> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | CalDirectiveBinding>) {
    const handler = () => {
      const { openModal } = useCal();
      if (typeof binding.value === 'string') {
        const namespace = el.getAttribute('data-cal-namespace') || undefined;
        openModal({ calLink: binding.value, namespace });
      } else if (binding.value && binding.value.link) {
        openModal({
          calLink: binding.value.link,
          namespace: binding.value.namespace || el.getAttribute('data-cal-namespace') || undefined,
          config: binding.value.config
        });
      }
    };

    (el as any)._calHandler = handler;
    el.addEventListener('click', handler);
  },
  updated(el: CalElement, binding: DirectiveBinding<string | CalDirectiveBinding>) {
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
