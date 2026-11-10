export interface CalThemeColors {
  'cal-brand'?: string;
  [key: string]: string | undefined;
}

export interface CalCssVarsPerTheme {
  light?: CalThemeColors;
  dark?: CalThemeColors;
  [theme: string]: CalThemeColors | undefined;
}

export interface CalInitOptions {
  origin?: string;
  namespace?: string;
  forwardQueryParams?: boolean;
  cssVarsPerTheme?: CalCssVarsPerTheme;
  styles?: {
    branding?: {
      brandColor?: string;
    };
    [key: string]: any;
  };
  layout?: 'month_view' | 'week_view' | 'column_view';
  theme?: 'light' | 'dark' | 'auto';
  hideEventTypeDetails?: boolean;
  useSlotsViewOnSmallScreen?: boolean | string;
}

export interface CalModalOptions {
  calLink: string;
  namespace?: string;
  config?: Record<string, any>;
}

export interface CalEventCallback {
  action: string;
  namespace?: string;
  callback: (event: CustomEvent<any>) => void;
}

declare global {
  interface Window {
    Cal: any;
  }
}
