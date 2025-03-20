import { mqTests } from './testSuites/mq_tests.js';

describe('Media Query Special Tests (array css)', () => {
    mqTests({
        prefix: '[MQArrayCss]',
        criticalCssFileName: 'test_result_array_css.css',
        remainingCssFileName: 'test_result_array_css_remaining.css',
    });
});
