import { Theme } from '@mui/material';

import {  dataComponentAreas } from '../common/Theme';




export const getWsTheme = (outerTheme: Theme)=>{
    return {...outerTheme,...dataComponentAreas,
        areas:{...outerTheme.areas, dataComponent:{...dataComponentAreas.areas}}}
    

}