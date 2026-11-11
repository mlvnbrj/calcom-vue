import { createCal } from 'calcom-vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createCal({
      cssVarsPerTheme: {
        light: { 'cal-brand': '#00DC82' },
        dark: { 'cal-brand': '#00DC82' }
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
      useSlotsViewOnSmallScreen: true
    })
  );
});
