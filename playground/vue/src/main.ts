import { createApp } from 'vue';
import App from './App.vue';
import { createCal } from 'calcom-vue';

const app = createApp(App);

app.use(
  createCal({
    namespace: 'discovery',
    origin: 'https://app.cal.com',
    forwardQueryParams: true,
    cssVarsPerTheme: {
      light: { 'cal-brand': '#FF5C37' },
      dark: { 'cal-brand': '#fafafa' }
    },
    hideEventTypeDetails: false,
    layout: 'month_view',
    useSlotsViewOnSmallScreen: true
  })
);

app.mount('#app');