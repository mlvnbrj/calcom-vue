export interface CalInitOptions {
  origin?: string;
  namespace?: string;
  styles?: {
    branding?: {
      brandColor?: string;
    };
    [key: string]: any;
  };
  layout?: 'month_view' | 'week_view' | 'column_view';
  theme?: 'light' | 'dark' | 'auto';
  hideEventTypeDetails?: boolean;
}

export interface CalModalOptions {
  calLink: string;
  config?: Record<string, any>;
}

export interface CalEventCallback {
  action: string;
  callback: (event: CustomEvent<any>) => void;
}

declare global {
  interface Window {
    Cal: any;
  }
}
