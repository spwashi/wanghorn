import {DEV} from "../../../path/paths";
import {getURI} from "../../../path/resolution";

export const DEV__PATH               = DEV;
export const get_CREATE_MODEL        = ({smID}) => `${DEV__PATH}/model/${smID}/create`;
export const MODELS                  = getURI("dev--models");
export const ROUTES                  = getURI("dev--routes");
export const get_EXECUTE_MODEL_QUERY = (smID, queryName) => `${DEV__PATH}/model/${smID}/execute/${queryName}?run`;