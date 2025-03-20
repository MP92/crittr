import { basicNoCSSTests } from './basis_nocss_tests.js';

export const basicTests = ({ prefix, criticalCssFileName, remainingCssFileName }) => {
    const { criticalSelectorRules } = basicNoCSSTests({
        prefix,
        criticalCssFileName,
        remainingCssFileName,
    });

    const mustHaveSelectors = {
        supports: ['.supports-selector'],
        media800_supports: ['.supports-selector'],
    };

    const mustMissSelectors = {
        supports: ['.supports-selector-not-included'],
        media800_supports: ['.supports-selector-not-included'],
    };

    describe(`${prefix} Check Results Extra`, () => {
        test(`${prefix} Supports selectors should be included`, () => {
            const missingSelectors = [];
            const selectorPrefix = 'supports (display: flex)===';
            for (const selector of mustHaveSelectors.supports) {
                const selectorStr = selectorPrefix + selector;
                if (!criticalSelectorRules.has(selectorStr)) {
                    missingSelectors.push(selectorStr);
                }
            }
            expect(missingSelectors).toHaveLength(0);
        });

        test(`${prefix} Supports selectors should NOT be included`, () => {
            const selectorPrefix = 'supports (display: flex)===';
            const falseIncludedSelectors = [];
            for (const selector of mustMissSelectors.supports) {
                const selectorStr = selectorPrefix + selector;
                if (criticalSelectorRules.has(selectorStr)) {
                    falseIncludedSelectors.push(selectorStr);
                }
            }
            expect(falseIncludedSelectors).toHaveLength(0);
        });

        test(`${prefix} MediaQuery 800 @supports should be included`, () => {
            const missingSelectors = [];
            const selectorPrefix = 'media (min-width: 800px)===supports (display: flex)===';
            for (const selector of mustHaveSelectors.media800_supports) {
                if (!criticalSelectorRules.has(selectorPrefix + selector)) {
                    missingSelectors.push(selectorPrefix + selector);
                }
            }
            expect(missingSelectors).toHaveLength(0);
        });

        test(`${prefix} MediaQuery 800 @supports should NOT be included`, () => {
            const falseIncludedSelectors = [];
            const selectorPrefix = 'media (min-width: 800px)===supports (display: flex)===';
            for (const selector of mustMissSelectors.media800_supports) {
                if (criticalSelectorRules.has(selectorPrefix + selector)) {
                    falseIncludedSelectors.push(selectorPrefix + selector);
                }
            }
            expect(falseIncludedSelectors).toHaveLength(0);
        });
    });

    return { criticalSelectorRules };
};
