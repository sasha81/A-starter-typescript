
import { createTheme, BoxProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Area, Grid, grid } from 'grid-template-parser';

export interface ExtArea extends Grid {
    areas: { [key: string]: Area & { height: string | number, width?: string | number, location?: object, sx?: object } };
    container?: BoxProps;
}

declare module '@mui/material' {
   
    interface Theme {
        parentTheme?: Theme;
        areas?: any;
        box?: any;
        button?: any;

    }
   
    interface ThemeOptions {
        parentTheme?: ThemeOptions;
        areas?: any;
        box?: any;
        button?: any;

    }
    interface TypographyVariants {
        gridFormTitle: any;
        mainTitle: any;
        loadMessages: any;
        errorMessages: any;
    }

 
    interface TypographyVariantsOptions {
        gridFormTitle?: any;
        mainTitle?: any;
        loadMessages?: any;
        errorMessages?: any;
    }
}

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        gridFormTitle: any;
        mainTitle: any;
        loadMessages: any;
        errorMessages: any;
    }
}


const rootAreas = grid(`
  "mainHeader mainHeader mainHeader"  
  "Msgs       Msgs      Msgs"
  "Footer   Footer    Footer"
 `) as ExtArea

rootAreas.areas['mainHeader']['height'] = '6vh';
rootAreas.areas['Footer']['height'] = '1vh';
rootAreas.areas['Msgs']['height'] = `calc(100vh - ${rootAreas.areas['Footer']['height']} - ${rootAreas.areas['mainHeader']['height']})`;




export const dataComponentAreas = grid(`
 "Header"
 "Form"
 "SubHeader"
 "Msgs" 
 `) as ExtArea;

dataComponentAreas.areas['Header']['height'] = '40px';
dataComponentAreas.areas['SubHeader']['height'] = '6%';
dataComponentAreas.areas['Form']['height'] = '100px';
dataComponentAreas.areas['Msgs']['height']

export const nameAgeCreateFormArea = grid(`
    "Title"  "Title"  "Title"
    "Name"   "Age"   "Button"
`) as ExtArea;

const buttonColor = grey[500]
nameAgeCreateFormArea['container'] = {}
nameAgeCreateFormArea['container']['height'] = dataComponentAreas.areas['Form']['height'];

nameAgeCreateFormArea.areas['Title']['height'] = '40px';
nameAgeCreateFormArea.areas['Title']['sx'] = {
    gridRow: 1, gridColumnStart: 1, gridColumnEnd: 8,
    marginLeft: 1, paddingTop: 2, boxSizing: 'border-box', height: nameAgeCreateFormArea.areas['Title']['height']
};
nameAgeCreateFormArea.areas['Name']['sx'] = {
    margin: 0.5, gridRow: 2, gridColumnStart: 1, gridColumnEnd: 6,
    height: nameAgeCreateFormArea.areas['Title']['height']
};
nameAgeCreateFormArea.areas['Age']['sx'] = {
    margin: 0.5, gridRow: 2, gridColumnStart: 6, gridColumnEnd: 8,
    height: nameAgeCreateFormArea.areas['Title']['height']
}
nameAgeCreateFormArea.areas['Button']['sx'] = {
    gridRow: 2, gridColumnStart: 8, gridColumnEnd: 8,
    marginRight: 0.75, bgcolor: buttonColor, color: 'black', height: nameAgeCreateFormArea.areas['Title']['height']
};


export const nameAgeCardArea = grid(`
    "Name"    "Age"
    "Groups" "Button"
`) as ExtArea;

nameAgeCardArea['container'] = {}
nameAgeCardArea['container']['sx'] = { p: 0.5, height: '150px' };


nameAgeCardArea.areas['Name']['height'] = '35px'
nameAgeCardArea.areas['Name']['sx'] = {
    gridRow: 1, gridColumnStart: 1, gridColumnEnd: 8, fontSize: 18,
    mt: 1, height: nameAgeCardArea.areas['Name']['height']
}
nameAgeCardArea.areas['Age']['sx'] = {
    gridRow: 1, gridColumnStart: 8, gridColumnEnd: 8, fontSize: 18,
    mt: 1, height: nameAgeCardArea.areas['Name']['height']
}
nameAgeCardArea.areas['Groups']['sx'] = { gridRow: 2, gridColumnStart: 1, gridColumnEnd: 8, height: nameAgeCardArea.areas['Name']['height'] }
nameAgeCardArea.areas['Button']['sx'] = {
    gridRow: 2, gridColumnStart: 8, gridColumnEnd: 8,
    bgcolor: buttonColor, color: 'black', height: nameAgeCardArea.areas['Name']['height'], fontSize: '14px'
}

const defaultTheme = createTheme();

const subComponBgColor = grey[200]

const theme = createTheme({
    areas: {
        root: { ...rootAreas.areas },
        dataComponent: { ...dataComponentAreas.areas },
        nameAgeCard: { ...nameAgeCardArea.areas, container: nameAgeCardArea.container },
        nameAgeCreateForm: { ...nameAgeCreateFormArea.areas, container: nameAgeCreateFormArea.container }
    }
    ,

    box: {
        formWith2fields: {
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: '1fr 2fr',
            boxSizing: 'border-box',
            alignItems: 'center',
            '& > *': { boxSizing: 'border-box' },

        },
        formWith1field: {
            display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', boxSizing: 'border-box', alignItems: 'center', '& > *': { boxSizing: 'border-box' }
        },
        absolutePosContainer: {
            position: 'absolute',
            width: '99.9%',
            left: '1%',
        },
        bgColorAndBorder: {
            boxSizing: 'border-box', bgcolor: subComponBgColor, border: `5px solid ${subComponBgColor}`
        },
        flexGrid: {
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignContent: 'flex-start',
            overflowY: 'auto',

        },
        messages: {
            // border:1, borderRadius:2, borderColor:'black',
            width: '98%', height: rootAreas.areas['Msgs']['height'], boxSizing: 'border-box',
            margin: '0 auto'
        },
        collapsableText: {
            overflowY: 'auto', width: '15vw'
        }
    },
    button: {
        medium: {
            bgcolor: grey[500], color: 'black', height: '40px'
        },

        small: {
            bgcolor: grey[500], color: 'black', height: '35px', fontSize: '14px', mt: 1
        }
    },

    typography: {
        mainTitle: {
            boxSizing: 'border-box', paddingBottom: '2vh', textAlign: 'center'
        },
        loadMessages: {
            maxWidth: '95%', marginLeft: 1, fontSize: 22, paddingLeft: 1, paddingRight: 1
        },
        errorMessages: {
            maxWidth: '95%', marginLeft: 1, bgcolor: defaultTheme.palette.error.light, fontSize: 22, paddingLeft: 1, paddingRight: 1
        }

    }
});

export default theme
