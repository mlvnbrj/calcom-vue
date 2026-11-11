import { getCurrentScope, onScopeDispose } from 'vue';
import { loadCalScript, getCalApi, getGlobalCalOptions } from '../loader';
import type {
  CalModalOptions,
  CalInlineOptions,
  CalPreloadOptions,
  CalEventCallback,
  CalOffCallback,
  CalApi
} from '../types/cal';

export function useCal(defaultNamespace?: string) {
  const resolveNamespace = (ns?: string) => {
    return ns ?? defaultNamespace ?? getGlobalCalOptions().namespace;
  };

  const getApi = async (namespace?: string): Promise<CalApi | null> => {
    return getCalApi(resolveNamespace(namespace));
  };

  const openModal = async ({ calLink, namespace, config }: CalModalOptions) => {
    await loadCalScript();
    const api = await getApi(namespace);
    if (api) {
      api('modal', { calLink, config });
    }
  };

  const inline = async ({ elementOrSelector, calLink, namespace, config }: CalInlineOptions) => {
    await loadCalScript();
    const api = await getApi(namespace);
    if (api) {
      api('inline', { elementOrSelector, calLink, config });
    }
  };

  const preload = async ({ calLink, namespace }: CalPreloadOptions) => {
    await loadCalScript();
    const api = await getApi(namespace);
    if (api) {
      api('preload', { calLink });
    }
  };

  const on = async ({ action, namespace, callback }: CalEventCallback, autoCleanup = false) => {
    await loadCalScript();
    const api = await getApi(namespace);
    if (api) {
      api('on', { action, callback });
    }

    if (autoCleanup && getCurrentScope()) {
      onScopeDispose(() => {
        off({ action, namespace, callback });
      });
    }
  };

  const off = async ({ action, namespace, callback }: CalOffCallback) => {
    await loadCalScript();
    const api = await getApi(namespace);
    if (api) {
      api('off', { action, callback });
    }
  };

  const setUI = async (uiOptions: Record<string, any>, namespace?: string) => {
    await loadCalScript();
    const api = await getApi(namespace);
    if (api) {
      api('ui', uiOptions);
    }
  };

  return {
    getApi,
    openModal,
    inline,
    preload,
    on,
    off,
    setUI
  };
}
