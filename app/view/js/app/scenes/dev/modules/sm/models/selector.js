import {selectDev} from "../../../selector";
import {normalizeSmID} from "../../sm/utility";

export const selectModelDevInterface                     = state => (selectDev(state) || {}).models;
export const selectModelSceneActivity                    = state => (selectModelDevInterface(state) || {}).isActive;
export const selectAllModelMetaObjects                   = state => (selectModelDevInterface(state) || {}).models;
export const selectProperties_fromModel                  = state => (state || {}).properties;
export const selectPropertySmIDs_fromModel               = state => Object.entries(selectProperties_fromModel(state) || {}).map(([name, property]) => normalizeSmID((property).smID));
export const selectActiveProperties_fromModelMetaObject  = state => (state || {}).activeProperties;