import type { App, Plugin } from 'vue';
import { loadCalScript } from './loader';
import { useCal } from './composables/useCal';
import { vCal } from './directives/vCal';
import { CalButton } from './components/vCal';
import type { CalInitOptions } from './types/cal';

export const createCal = (options?: CalInitOptions): Plugin => ({
  install(app: App) {
    if (typeof window !== 'undefined') {
      loadCalScript(options);
    }
    app.directive('cal', vCal);
    app.component('CalButton', CalButton);
  }
});

export { useCal, vCal, CalButton, loadCalScript };
export * from './types/cal';
