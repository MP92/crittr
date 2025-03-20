import { basicNoCSSTests } from './testSuites/basis_nocss_tests.js';

describe('Basic NoCSS Test', () => {
    basicNoCSSTests({
        prefix: '[BasicNoCSS]',
        criticalCssFileName: 'test_result_noCss.css',
        remainingCssFileName: 'test_result_noCss_remaining.css',
    });
});
