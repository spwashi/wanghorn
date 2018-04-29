import {selectDev} from "../../selector";

export const selectRoutes             = state => ((selectDev(state) || {}).routes || {}).routes;
export const selectRouteSceneActivity = state => ((selectDev(state) || {}).routes || {}).isActive;