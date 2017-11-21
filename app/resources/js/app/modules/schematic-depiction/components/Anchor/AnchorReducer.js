import * as actionTypes from "./AnchorActionTypes";

export default (state, action) => {
	switch (action.type) {
		case actionTypes.CREATE_ANCHOR:
			console.log(state);
			break;
	}
}