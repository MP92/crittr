import fs from 'fs-extra';
import path from 'path';
import { parse } from '@adobe/css-tools';
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.join(__dirname, '..', '..', '..');
const testResultDir = path.join(rootDir, 'test', 'results');

export const mqTests = ({ prefix, criticalCssFileName, remainingCssFileName }) => {
    const resultCSS = fs.readFileSync(path.join(testResultDir, criticalCssFileName), 'utf8');
    const remainingCSS = fs.readFileSync(path.join(testResultDir, remainingCssFileName), 'utf8');
    const resultAstRules = parse(resultCSS).stylesheet.rules;
    const remainingAstRules = parse(remainingCSS).stylesheet.rules;

    let mediaRulesArr = [];
    for (const rule of resultAstRules) {
        if (rule.type === 'media') {
            mediaRulesArr.push(rule.media);
        }
    }

    describe(`${prefix} Media Query Order`, () => {
        test(`${prefix} Media Queries exists`, () => {
            const rule = mediaRulesArr[0] || null;
            expect(rule).not.toBeNull();
        });

        test(`${prefix} First Media Query is 800px`, () => {
            const rule = mediaRulesArr[0] || null;
            expect(rule).toContain('800px');
        });

        test(`${prefix} Second Media Query is 900px`, () => {
            const rule = mediaRulesArr[1] || null;
            expect(rule).toContain('900px');
        });

        test(`${prefix} Third Media Query is 1024px`, () => {
            const rule = mediaRulesArr[2] || null;
            expect(rule).toContain('1024px');
        });

        test(`${prefix} Last Media Query is MaxWidth 1337px`, () => {
            const rule = mediaRulesArr[mediaRulesArr.length - 1] || null;
            expect(rule).toContain('max-width: 1337px');
        });
    });
};
