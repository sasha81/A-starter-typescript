import { describe, expect, test, vi } from "vitest";
import { replacer } from 'src/utils/test.utils';
import { getTwoRowBoxStyles, TwoRowBoxWithProps } from './CustomBoxes'
import { Box, BoxProps, createTheme, Theme } from "@mui/material";
import { render, waitFor } from "@testing-library/react";
import { ThemeProvider } from '@mui/styles';
import theme, { dataComponentAreas } from './Theme';
import { afterEach } from "node:test";



describe('Custom Boxes', () => {

  afterEach(() => {
    vi.clearAllMocks()
  });

  test('the theme contains all the info for getTwoRowBoxStyles not to produce nulls or undefines', () => {
    const themeTest = createTheme({ ...theme, ...dataComponentAreas })
    const classes = getTwoRowBoxStyles(themeTest);
    expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
    expect(JSON.stringify(classes, replacer)).not.toContain('null')
  })

})