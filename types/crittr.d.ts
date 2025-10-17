declare module 'crittr' {
    import { PuppeteerNode } from 'puppeteer';

    interface BrowserOptions {
        userAgent?: string;
        isCacheEnabled?: boolean;
        isJsEnabled?: boolean;
        concurrentTabs?: number;
    }

    interface DeviceOptions {
        width?: number;
        height?: number;
        scaleFactor?: number;
        isMobile?: boolean;
        hasTouch?: boolean;
        isLandscape?: boolean;
    }

    interface PuppeteerOptions {
        browser?: ReturnType<PuppeteerNode['launch']>;
        chromePath?: string | null;
        headless?: boolean;
    }

    interface CrittrOptions {
        css?: string | string[] | null;
        urls: string[];
        minifyCriticalCss?: boolean;
        timeout?: number;
        pageLoadTimeout?: number;
        outputRemainingCss?: boolean;
        browser?: BrowserOptions;
        device?: string | DeviceOptions;
        puppeteer?: PuppeteerOptions;
        printBrowserConsole?: boolean;
        dropKeyframes?: boolean;
        takeScreenshots?: boolean;
        screenshotPath?: string;
        screenshotNameGenerator?: (url: string) => string | Promise<string>;
        keepSelectors?: string[];
        removeSelectors?: string[];
        blockRequests?: string[];
    }

    interface CrittrResult {
        critical: string;
        rest: string;
    }

    function Crittr(options: CrittrOptions): Promise<CrittrResult>;

    export default Crittr;
}
