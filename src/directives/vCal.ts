import type { Directive, DirectiveBinding } from 'vue';
import { useCal } from '../composables/useCal';

export interface CalDirectiveBinding {
  link?: string;
  namespace?: string;
  config?: Record<string, any>;
}

type CalElement = HTMLElement & {
  _calHandler?: (e: MouseEvent) => void;
  _calValue?: string | CalDirectiveBinding;
};

function parseConfigAttribute(attr: string | null): Record<string, any> | undefined {
  if (!attr) return undefined;
  try {
    return JSON.parse(attr);
  } catch {
    return undefined;
  }
}

export const vCal: Directive<HTMLElement, string | CalDirectiveBinding | undefined> = {
  mounted(el: CalElement, binding: DirectiveBinding<string | CalDirectiveBinding | undefined>) {
    el._calValue = binding.value;

    const handler = (e: MouseEvent) => {
      const val = el._calValue ?? binding.value;
      const { openModal } = useCal();

      if (typeof val === 'string') {
        const namespace = el.getAttribute('data-cal-namespace') || undefined;
        const config = parseConfigAttribute(el.getAttribute('data-cal-config'));
        openModal({ calLink: val, namespace, config });
      } else if (val && typeof val === 'object' && val.link) {
        const namespace = val.namespace || el.getAttribute('data-cal-namespace') || undefined;
        const config = val.config || parseConfigAttribute(el.getAttribute('data-cal-config'));
        openModal({ calLink: val.link, namespace, config });
      } else {
        // Fallback to data attributes if no directive value was passed
        const calLink = el.getAttribute('data-cal-link');
        if (calLink) {
          const namespace = el.getAttribute('data-cal-namespace') || undefined;
          const config = parseConfigAttribute(el.getAttribute('data-cal-config'));
          openModal({ calLink, namespace, config });
        }
      }
    };

    el._calHandler = handler;
    el.addEventListener('click', handler);
  },
  updated(el: CalElement, binding: DirectiveBinding<string | CalDirectiveBinding | undefined>) {
    el._calValue = binding.value;
  },
  unmounted(el: CalElement) {
    if (el._calHandler) {
      el.removeEventListener('click', el._calHandler);
      delete el._calHandler;
    }
    delete el._calValue;
  },
  getSSRProps() {
    return {};
  }
};
