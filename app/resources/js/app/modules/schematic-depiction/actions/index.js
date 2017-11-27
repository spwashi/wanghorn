import {INIT_ANCHOR, SET_ANCHOR_LABEL} from "../actionTypes";

export const initAnchor = () => ({type: INIT_ANCHOR});
export const setLabel   = (anchorID, label) => ({type: SET_ANCHOR_LABEL, anchorID, label});