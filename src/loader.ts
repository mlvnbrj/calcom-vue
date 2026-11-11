import type { CalApi, CalInitOptions } from './types/cal';

let globalOptions: CalInitOptions = {};
const initializedNamespaces = new Set<string>();

export function setGlobalCalOptions(options?: CalInitOptions) {
  if (options) {
    globalOptions = { ...globalOptions, ...options };
  }
}

export function getGlobalCalOptions(): CalInitOptions {
  return globalOptions;
}

export function loadCalScript(options?: CalInitOptions): Promise<CalApi | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);

    if (options) {
      setGlobalCalOptions(options);
    }

    const mergedOptions = { ...globalOptions, ...options };
    const origin = mergedOptions.origin || 'https://app.cal.com';
    const embedJsUrl = mergedOptions.embedJsUrl || `${origin}/embed/embed.js`;

    if (!window.Cal || !window.Cal.loaded) {
      (function (C: any, A: string, L: string) {
        const p = function (a: any, ar: any) { a.q.push(ar); };
        const d = C.document;
        C.Cal = C.Cal || function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
      })(window, embedJsUrl, 'init');
    }

    const targetNamespace = mergedOptions.namespace;
    const nsKey = targetNamespace || '__root__';

    // Only run init and initial UI config once per namespace unless explicitly asked
    if (!initializedNamespaces.has(nsKey)) {
      if (targetNamespace) {
        window.Cal('init', targetNamespace, { origin });
      } else {
        window.Cal('init', { origin });
      }

      window.Cal.config = window.Cal.config || {};
      if (mergedOptions.forwardQueryParams !== undefined) {
        window.Cal.config.forwardQueryParams = mergedOptions.forwardQueryParams;
      }

      const api = targetNamespace && window.Cal.ns ? window.Cal.ns[targetNamespace] : window.Cal;

      const uiConfig: Record<string, any> = {};
      if (mergedOptions.layout !== undefined) uiConfig.layout = mergedOptions.layout;
      if (mergedOptions.hideEventTypeDetails !== undefined) uiConfig.hideEventTypeDetails = mergedOptions.hideEventTypeDetails;
      if (mergedOptions.cssVarsPerTheme !== undefined) uiConfig.cssVarsPerTheme = mergedOptions.cssVarsPerTheme;
      if (mergedOptions.styles !== undefined) uiConfig.styles = mergedOptions.styles;
      if (mergedOptions.theme !== undefined) uiConfig.theme = mergedOptions.theme;
      if (mergedOptions.useSlotsViewOnSmallScreen !== undefined) {
        uiConfig.useSlotsViewOnSmallScreen = mergedOptions.useSlotsViewOnSmallScreen;
      }

      if (Object.keys(uiConfig).length > 0 && typeof api === 'function') {
        api('ui', uiConfig);
      }

      initializedNamespaces.add(nsKey);
    }

    resolve(window.Cal);
  });
}

export async function getCalApi(namespace?: string): Promise<CalApi | null> {
  await loadCalScript();
  if (typeof window === 'undefined' || !window.Cal) return null;

  const targetNs = namespace ?? globalOptions.namespace;
  if (targetNs && window.Cal.ns?.[targetNs]) {
    return window.Cal.ns[targetNs];
  }
  return window.Cal;
}
