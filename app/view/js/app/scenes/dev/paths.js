import {DEV} from "../../../path/paths";
import {getURI} from "../../../path/resolution";

export const DEV__PATH               = DEV;
export const get_CREATE_MODEL        = ({smID}) => `${DEV__PATH}/model/${smID}/create`;
export const MODELS                  = getURI("dev--models__json");
export const ROUTES                  = getURI("dev--routes__json");