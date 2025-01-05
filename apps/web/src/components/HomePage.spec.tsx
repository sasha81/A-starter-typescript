import { describe, expect, test } from "vitest";
import { replacer } from 'src/utils/test.utils';
import theme from './common/Theme';
import { getStyles } from './HomePage'

describe('HomePage', () => {
    test('the theme contains all the info for getHomePageStyles not to produce nulls or undefines', () => {
        const classes = getStyles(theme);
        expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
        expect(JSON.stringify(classes, replacer)).not.toContain('null')
    })
})