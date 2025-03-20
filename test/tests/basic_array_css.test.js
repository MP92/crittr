import { basicTests } from './testSuites/basis_tests.js';

describe('Basic Array CSS Test', () => {
    basicTests({
        prefix: '[BasicArrayCss]',
        criticalCssFileName: 'test_result_array_css.css',
        remainingCssFileName: 'test_result_array_css_remaining.css',
    });
});
