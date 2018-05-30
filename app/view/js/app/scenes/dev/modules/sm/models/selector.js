import {selectDev} from "../../../selector";

export const selectModelDevInterface                     = state => (selectDev(state) || {}).models;
export const selectModelSceneActivity                    = state => (selectModelDevInterface(state) || {}).isActive;
export const selectAllModelMetaObjects                   = state => (selectModelDevInterface(state) || {}).models;