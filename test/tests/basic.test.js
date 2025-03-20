import { basicTests } from './testSuites/basis_tests.js';

describe('Basic Test', () => {
    basicTests({
        prefix: '[Basic]',
        criticalCssFileName: 'test_result.css',
        remainingCssFileName: 'test_result_remaining.css',
    });
});
