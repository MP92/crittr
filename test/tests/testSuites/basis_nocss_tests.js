import fs from 'fs-extra';
import path from 'path';
import { parse } from '@adobe/css-tools';
import helpers from '../../helpers.js';
import Rule from '../../../lib/classes/Rule.class.js';
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.join(__dirname, '..', '..', '..');
const testResultDir = path.join(rootDir, 'test', 'results');

export const basicNoCSSTests = ({ prefix, criticalCssFileName, remainingCssFileName }) => {
    const resultCSS = fs.readFileSync(path.join(testResultDir, criticalCssFileName), 'utf8');

    const remainingCSS = fs.readFileSync(path.join(testResultDir, remainingCssFileName), 'utf8');

    const resultAstRules = parse(resultCSS).stylesheet.rules;
    const remainingAstRules = parse(remainingCSS).stylesheet.rules;

    const criticalSelectorRules = helpers.getAstRules(resultAstRules);

    // Selectors to search for
    const mustHaveSelectors = {
        standard: [
            '.standard-selector',
            '#id-selector',
            'address',
            '.child-selector > *',
            '.sibling-selector + .sibling',
            '.sibling-general-selector ~ .sibling',
            `.property-selector[data-test="test"]`,
            '.group-selector .deep1 .deep2',
            '.multi-selector,.multi-selector-1,.multi-selector-2',
            '.forceInclude',
            'h1',
            '.vendor_prefix',
            '.pseudo-selector::after',
            '.pseudo-selector::before',
            '.pre .wildcard_test_1 .post',
            '.display-contents',
        ],
        functionalPseudoClasses: [
            // :is selectors
            ':is(.critical-is)',
            ':is(.critical-is) > b',
            '.critical-is :is(header, footer) > span',
            '.critical-is :is(button, a)',
            ':is(.critical-is, .critical-is-2) :is(button, a)',
            ':is(.critical-is, .critical-is-2):is(section, div)',
            '.critical-is:is(section, div, :is(.section, .div))',
            // :where selectors
            ':where(.critical-where)',
            ':where(.critical-where) > b',
            '.critical-where :where(header, footer) > span',
            '.critical-where :where(button, a)',
            ':where(.critical-where, .critical-where-2) :where(button, a)',
            ':where(.critical-where, .critical-where-2):where(section, div)',
            '.critical-where:where(section, div, :where(.section, .div))',
            // :not selectors
            ':not(:not(.critical-not))',
            '.critical-not:not([id])',
            '.critical-not input:not(:required, [type="button"])',
            '.critical-not input:not(div > input)',
            '.critical-not span:not([class]):not(:last-child)',
            // :has selectors
            ':has(> .critical-has-inner)',
            '.critical-has-inner:has(+ span)',
            '.critical-has:has(.critical-has-inner):has(a) span',
        ],
        media1024: ['.standard-selector', '#id-selector', 'address', '.forceInclude', '.pseudo-selector::after', '.pseudo-selector::before'],
        media800: ['.standard-selector', '#id-selector', '.forceInclude'],
    };

    const mustMissSelectors = {
        standard: [
            '.forceExclude',
            '.no-atf-css-default',
            ':root .not-existing-selector',
            'h2,h3,h4,h5,h6',
            '.pre .wildcard_test_2 .post',
            '.wildcard_test_3.space',
            '.btf-display-contents',
        ],
        functionalPseudoClasses: [
            // :is selectors
            ':is(.btf-is) > b',
            '.btf-is:is(section, div, :is(.section, .div))',
            // :where selectors
            ':where(.btf-where) > b',
            '.btf-where:where(section, div, :where(.section, .div))',
            // :not selectors
            ':not(:not(.btf-not))',
            '.btf-not span:not([class]):not(:last-child)',
            // :has selectors
            ':has(> .btf-has-inner)',
            '.btf-has:has(> span)',
        ],
        media1024: ['.forceExclude', '.no-atf-css-default-1024'],
        media800: ['.forceExclude', '.no-atf-css-default-800'],
    };

    describe(`${prefix} Check Results`, () => {
        test(`${prefix} Standard selectors should be included`, () => {
            const missingSelectors = [];
            for (const selector of mustHaveSelectors.standard) {
                if (!criticalSelectorRules.has(selector)) {
                    missingSelectors.push(selector);
                }
            }
            expect(missingSelectors).toHaveLength(0);
        });

        test(`${prefix} Standard selectors should NOT be included`, () => {
            const falseIncludedSelectors = [];
            for (const selector of mustMissSelectors.standard) {
                if (criticalSelectorRules.has(selector)) {
                    falseIncludedSelectors.push(selector);
                }
            }
            expect(falseIncludedSelectors).toHaveLength(0);
        });

        test(`${prefix} :is, :where, :has, :not selectors should be included`, () => {
            const missingSelectors = [];
            for (const selector of mustHaveSelectors.functionalPseudoClasses) {
                if (!criticalSelectorRules.has(selector)) {
                    missingSelectors.push(selector);
                }
            }
            expect(missingSelectors).toHaveLength(0);
        });

        test(`${prefix} Non critical :is, :where, :has, :not selectors should NOT be included`, () => {
            const falseIncludedSelectors = [];
            for (const selector of mustMissSelectors.functionalPseudoClasses) {
                if (criticalSelectorRules.has(selector)) {
                    falseIncludedSelectors.push(selector);
                }
            }
            expect(falseIncludedSelectors).toHaveLength(0);
        });

        test(`${prefix} There shouldn't be any duplicate media query delcarations`, () => {
            const duplicateMediaQuery = [];
            const mqCounter = [];
            for (const rule of resultAstRules) {
                if (rule.type === 'media') {
                    if (mqCounter.includes(rule.media)) {
                        duplicateMediaQuery.push(rule.media);
                    } else {
                        mqCounter.push(rule.media);
                    }
                }
            }
            expect(duplicateMediaQuery).toHaveLength(0);
        });

        test(`${prefix} MediaQuery 1024 selectors should be included`, () => {
            const missingSelectors = [];
            const selectorPrefix = 'media (min-width: 1024px)===';
            for (const selector of mustHaveSelectors.media1024) {
                if (!criticalSelectorRules.has(selectorPrefix + selector)) {
                    missingSelectors.push(selectorPrefix + selector);
                }
            }
            expect(missingSelectors).toHaveLength(0);
        });

        test(`${prefix} MediaQuery 1024 selectors should NOT be included`, () => {
            const falseIncludedSelectors = [];
            const selectorPrefix = 'media (min-width: 1024px)===';
            for (const selector of mustMissSelectors.media1024) {
                if (criticalSelectorRules.has(selectorPrefix + selector)) {
                    falseIncludedSelectors.push(selectorPrefix + selector);
                }
            }
            expect(falseIncludedSelectors).toHaveLength(0);
        });

        test(`${prefix} MediaQuery 800 selectors should be included`, () => {
            const missingSelectors = [];
            const selectorPrefix = 'media (min-width: 800px)===';
            for (const selector of mustHaveSelectors.media800) {
                if (!criticalSelectorRules.has(selectorPrefix + selector)) {
                    missingSelectors.push(selectorPrefix + selector);
                }
            }
            expect(missingSelectors).toHaveLength(0);
        });

        test(`${prefix} MediaQuery 800 selectors should NOT be included`, () => {
            const falseIncludedSelectors = [];
            const selectorPrefix = 'media (min-width: 800px)===';
            for (const selector of mustMissSelectors.media800) {
                if (criticalSelectorRules.has(selectorPrefix + selector)) {
                    falseIncludedSelectors.push(selectorPrefix + selector);
                }
            }
            expect(falseIncludedSelectors).toHaveLength(0);
        });

        test(`${prefix} There should not be duplicates of rules`, () => {
            const getDeepDuplicates = (rules, excludedProps, media) => {
                let duplicatedRules = [];
                media = media || '';

                for (const rule of rules) {
                    if (Rule.isMediaRule(rule)) {
                        duplicatedRules = duplicatedRules.concat(getDeepDuplicates(rule.rules, excludedProps, rule.media));
                    } else {
                        let duplicateCount = 0;
                        for (const innerRule of rules) {
                            if (Rule.isRuleDuplicate(rule, innerRule, excludedProps)) {
                                duplicateCount++;
                            }
                        }
                        if (duplicateCount > 1) {
                            // Put the rule into the duplicate Array but reduce the count by one because one is still needed :)
                            const index = rule.type + (media ? ' ' + media + ' ' : '') + (rule.selectors ? rule.selectors.join(' ') : '');
                            if (!duplicatedRules.includes(index)) {
                                duplicatedRules.push(index);
                            }
                        }
                    }
                }

                return duplicatedRules;
            };

            const excludedProps = ['position'];
            const duplicateRules = getDeepDuplicates(resultAstRules, excludedProps);
            expect(duplicateRules).toHaveLength(0);
        });

        test(`${prefix} There should not exist any empty selectors`, () => {
            const emptyRules = [];
            for (const rule of resultAstRules) {
                if (Rule.isMediaRule(rule)) {
                    if (rule.rules && rule.rules.length === 0) {
                        emptyRules.push(rule.media);
                    }
                } else {
                    if (rule.declarations && rule.declarations.length === 0) {
                        emptyRules.push(rule.selectors.join(' '));
                    }
                }
            }

            expect(emptyRules).toHaveLength(0);
        });

        test(`${prefix} There should not exist any non critical partial selectors in critical css`, () => {
            let exists = resultAstRules.some(rule => {
                return rule.selectors && rule.selectors.includes('.not-exists .remaining-css');
            });

            expect(exists).not.toBeTruthy();
        });

        test(`${prefix} There should not exist any non critical partial mq rule selectors in remaining css`, () => {
            let exists = resultAstRules.some(rule => {
                if (rule.type === 'media') {
                    return rule.rules.some(rule => rule.selectors && rule.selectors.includes('.not-exists-mq-1024 .remaining-css'));
                }
            });

            expect(exists).not.toBeTruthy();
        });

        test(`${prefix} There should exist any non critical partial selectors in remaining css`, () => {
            let exists = remainingAstRules.some(rule => rule.selectors && rule.selectors.includes('.not-exists .remaining-css'));
            expect(exists).toBeTruthy();
        });

        test(`${prefix} There should exist any non critical partial mq rule selectors in remaining css`, () => {
            let exists = remainingAstRules.some(rule => {
                if (rule.type === 'media') {
                    return rule.rules.some(rule => rule.selectors && rule.selectors.includes('.not-exists-mq-1024 .remaining-css'));
                }
            });

            expect(exists).toBeTruthy();
        });

        test(`${prefix} Font-Face should be in critical css`, () => {
            const exists = criticalSelectorRules.has('font-face');
            expect(exists).toBeTruthy();
        });
    });

    return {
        criticalSelectorRules,
    };
};
