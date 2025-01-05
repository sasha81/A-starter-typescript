import { describe, expect, test } from "vitest";
import { replacer } from 'src/utils/test.utils';
import theme, { dataComponentAreas } from './Theme';
import { getGridTitleTypographStyles } from './CustomTypography'
import { createTheme } from "@mui/material";

describe('Custom Typography', () => {
    test('the theme contains all the info for getGridTitleTypographStyles not to produce nulls or undefines', () => {
        const themeTest = createTheme({ ...theme, ...dataComponentAreas })
        const classes = getGridTitleTypographStyles(themeTest);
        expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
        expect(JSON.stringify(classes, replacer)).not.toContain('null')
    })
})