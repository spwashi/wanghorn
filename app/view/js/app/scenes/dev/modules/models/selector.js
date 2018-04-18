import {selectDev} from "../../selector";

export const selectModelDevInterface = state => (selectDev(state) || {}).models;
export const selectActiveModelSmIDs  = state => (selectModelDevInterface(state) || {}).activeSmIDs;
export const selectAllModels         = state => (selectModelDevInterface(state) || {}).models;
export const selectActiveDevModels   = state => {
    const models              = selectAllModels(state);
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