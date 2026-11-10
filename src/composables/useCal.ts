import { loadCalScript } from '../loader';
import type { CalModalOptions, CalEventCallback } from '../types/cal';

export function useCal() {
  const getApi = (namespace?: string) => {
    if (typeof window === 'undefined' || !window.Cal) return null;
    return namespace && window.Cal.ns?.[namespace] ? window.Cal.ns[namespace] : window.Cal;
  };

  const openModal = async ({ calLink, namespace, config }: CalModalOptions) => {
    await loadCalScript();
    const api = getApi(namespace);
    if (api) {
      api('modal', { calLink, config });
    }
  };

  const on = async ({ action, namespace, callback }: CalEventCallback) => {
    await loadCalScript();
    const api = getApi(namespace);
    if (api) {
      api('on', { action, callback });
    }
  };

  const setUI = async (uiOptions: Record<string, any>, namespace?: string) => {
    await loadCalScript();
    const api = getApi(namespace);
    if (api) {
      api('ui', uiOptions);
    }
  };

  return {
    openModal,
    on,
    setUI
  };
}