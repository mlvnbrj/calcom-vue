import type { CalInitOptions } from './types/cal';

export function loadCalScript(options: CalInitOptions = {}): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);

    if (window.Cal && window.Cal.loaded) {
      return resolve(window.Cal);
    }

    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const s = d.createElement('script');
          s.src = A;
          s.async = true;
          d.head.appendChild(s);
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

    const origin = options.origin || 'https://app.cal.com';
    window.Cal('init', { origin });

    if (options.styles || options.layout || options.theme !== undefined) {
      window.Cal('ui', {
        styles: options.styles,
        layout: options.layout,
        theme: options.theme,
        hideEventTypeDetails: options.hideEventTypeDetails
      });
    }

    resolve(window.Cal);
  });
}
