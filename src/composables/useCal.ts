import { loadCalScript } from '../loader';
import type { CalModalOptions, CalEventCallback } from '../types/cal';

export function useCal() {
  const openModal = async ({ calLink, config }: CalModalOptions) => {
    const Cal = await loadCalScript();
    if (Cal) {
      Cal('modal', { calLink, config });
    }
  };

  const on = async ({ action, callback }: CalEventCallback) => {
    const Cal = await loadCalScript();
    if (Cal) {
      Cal('on', { action, callback });
    }
  };

  const setUI = async (uiOptions: Record<string, any>) => {
    const Cal = await loadCalScript();
    if (Cal) {
      Cal('ui', uiOptions);
    }
  };

  return {
    openModal,
    on,
    setUI
  };
}