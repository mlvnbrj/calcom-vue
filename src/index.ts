import type { App, Plugin } from 'vue';
import { loadCalScript, getCalApi, setGlobalCalOptions, getGlobalCalOptions } from './loader';
import { useCal } from './composables/useCal';
import { vCal } from './directives/vCal';
import { CalButton } from './components/CalButton';
import { CalEmbed, Cal } from './components/CalEmbed';
import type { CalInitOptions } from './types/cal';

export const createCal = (options?: CalInitOptions): Plugin => ({
  install(app: App) {
    if (options) {
      setGlobalCalOptions(options);
    }
    if (typeof window !== 'undefined') {
      loadCalScript(options);
    }
    app.directive('cal', vCal);
    app.component('CalButton', CalButton);
    app.component('CalEmbed', CalEmbed);
    app.component('Cal', Cal);
  }
});

export default createCal;

export {
  useCal,
  vCal,
  CalButton,
  CalEmbed,
  Cal,
  loadCalScript,
  getCalApi,
  setGlobalCalOptions,
  getGlobalCalOptions
};
export * from './types/cal';
