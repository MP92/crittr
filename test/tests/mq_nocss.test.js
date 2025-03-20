import { mqTests } from './testSuites/mq_tests.js';

describe('Media Query Special Tests (no css)', () => {
    mqTests({
        prefix: '[MQNoCSS]',
        criticalCssFileName: 'test_result_noCss.css',
        remainingCssFileName: 'test_result_noCss_remaining.css',
    });
});
