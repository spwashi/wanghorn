import {selectDev} from "../../selector";

export const selectDevModels = (state) => {
    const devState = selectDev(state) || {};
    return (devState).models || null;
};