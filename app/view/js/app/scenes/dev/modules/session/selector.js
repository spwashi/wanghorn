import {selectDev} from "../../selector";

export const selectActiveUser = state => ((selectDev(state) || {}).session || {}).activeUser || false;