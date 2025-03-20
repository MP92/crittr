import { mqTests } from './testSuites/mq_tests.js';

describe('Media Query Special Tests', () => {
    mqTests({
        prefix: '[MQ]',
        criticalCssFileName: 'test_result.css',
        remainingCssFileName: 'test_result_remaining.css',
    });
});
