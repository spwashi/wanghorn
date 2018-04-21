import {selectDev} from "../../selector";
import {normalizeSmID} from "./sm/utility";

export const selectModelDevInterface                    = state => (selectDev(state) || {}).models;
export const selectActiveModelSmIDs                     = state => (selectModelDevInterface(state) || {}).activeSmIDs;
export const selectAllModelMetaObjects                  = state => (selectModelDevInterface(state) || {}).models;
export const selectProperties_fromModel                 = state => (state || {}).properties;
export const selectActiveProperties_fromModelMetaObject = state => (state || {}).activeProperties;
export const selectPropertySmIDs_fromModel              = state => Object.entries(selectProperties_fromModel(state)).map(([name, property]) => normalizeSmID((property).smID));
export const selectActiveModelMetas                     = state => {
    const models              = selectAllModelMetaObjects(state);
    const activeSmIDs         = selectActiveModelSmIDs(state);
    const filterActiveIntoAll = (all, [index, model]) => {
        if (activeSmIDs.indexOf(index) >= 0) {
            all[index] = model;
        }
        return all;
    };
    return Object.entries(models)
                 .reduce(filterActiveIntoAll, {});
};