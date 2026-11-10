import type { CalInitOptions } from './types/cal';

export function loadCalScript(options: CalInitOptions = {}): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);

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
      })(window, 'https://app.cal.com/embed/embed.js', 'init');
    }

    const origin = options.origin || 'https://app.cal.com';

    // Initialize with optional namespace
    if (options.namespace) {
      window.Cal('init', options.namespace, { origin });
    } else {
      window.Cal('init', { origin });
    }

    // Configure query param forwarding
    window.Cal.config = window.Cal.config || {};
    window.Cal.config.forwardQueryParams = options.forwardQueryParams ?? true;

    // Direct UI commands to the target namespace if provided, otherwise root Cal
    const api = options.namespace ? window.Cal.ns[options.namespace] : window.Cal;

    const uiConfig: Record<string, any> = {
      hideEventTypeDetails: options.hideEventTypeDetails ?? false,
      layout: options.layout ?? 'month_view'
    };

    if (options.cssVarsPerTheme) {
      uiConfig.cssVarsPerTheme = options.cssVarsPerTheme;
    }
    if (options.styles) {
      uiConfig.styles = options.styles; // deprecated
    }
    if (options.theme) {
      uiConfig.theme = options.theme;
    }
    if (options.useSlotsViewOnSmallScreen !== undefined) {
      uiConfig.useSlotsViewOnSmallScreen = options.useSlotsViewOnSmallScreen;
    }

    api('ui', uiConfig);

    resolve(window.Cal);
  });
}