import {selectDev} from "../../selector";
import {normalizeSmID} from "../../../sm/utility";

export const selectEntityDevInterface                     = state => (selectDev(state) || {}).entities;
export const selectEntitySceneActivity                    = state => (selectEntityDevInterface(state) || {}).isActive;
export const selectAllEntityMetaObjects                   = state => (selectEntityDevInterface(state) || {}).entities;
export const selectProperties_fromEntity                  = state => (state || {}).properties;
export const selectPropertySmIDs_fromEntity               = state => Object.entries(selectProperties_fromEntity(state) || {}).map(([name, property]) => normalizeSmID((property).smID));
export const selectActiveProperties_fromEntityMetaObject  = state => (state || {}).activeProperties;