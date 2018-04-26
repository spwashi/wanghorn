import {DEV} from "../../../paths";

export const DEV__PATH               = DEV;
export const get_CREATE_MODEL        = ({smID}) => `${DEV__PATH}/model/${smID}/create`;
export const MODELS                  = `${DEV__PATH}/models.json`;
export const get_EXECUTE_MODEL_QUERY = (smID, queryName) => `${DEV__PATH}/model/${smID}/execute/${queryName}?run`;