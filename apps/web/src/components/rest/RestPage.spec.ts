import { describe, expect, test } from "vitest";
import { replacer } from 'src/utils/test.utils';
import theme from '../common/Theme';
import { getStyles } from './RestPage'
import { getRestTheme } from "./RestTheme";

describe('RestPage', () => {
    test('the theme contains all the info for getRestPageStyles not to produce nulls or undefines', () => {
        const classes = getStyles(getRestTheme(theme));
        expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
        expect(JSON.stringify(classes, replacer)).not.toContain('null')
    })
})