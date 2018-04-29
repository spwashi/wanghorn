import {selectDev} from "../../selector";

export const selectRoutes = state => (selectDev(state) || {}).routes;