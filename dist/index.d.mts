import * as vue from 'vue';
import { Directive, Plugin } from 'vue';

interface CalInitOptions {
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
interface CalModalOptions {
    calLink: string;
    config?: Record<string, any>;
}
interface CalEventCallback {
    action: string;
    callback: (event: CustomEvent<any>) => void;
}
declare global {
    interface Window {
        Cal: any;
    }
}

declare function loadCalScript(options?: CalInitOptions): Promise<any>;

declare function useCal(): {
    openModal: ({ calLink, config }: CalModalOptions) => Promise<void>;
    on: ({ action, callback }: CalEventCallback) => Promise<void>;
    setUI: (uiOptions: Record<string, any>) => Promise<void>;
};

interface CalDirectiveValue {
    link: string;
    config?: Record<string, any>;
}
declare const vCal: Directive<HTMLElement, string | CalDirectiveValue>;

declare const CalButton: vue.DefineComponent<vue.ExtractPropTypes<{
    calLink: {
        type: StringConstructor;
        required: true;
    };
    config: {
        type: ObjectConstructor;
        default: () => {};
    };
    tag: {
        type: StringConstructor;
        default: string;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    calLink: {
        type: StringConstructor;
        required: true;
    };
    config: {
        type: ObjectConstructor;
        default: () => {};
    };
    tag: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{}>, {
    config: Record<string, any>;
    tag: string;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const createCal: (options?: CalInitOptions) => Plugin;

export { CalButton, createCal, loadCalScript, useCal, vCal };
export type { CalEventCallback, CalInitOptions, CalModalOptions };
