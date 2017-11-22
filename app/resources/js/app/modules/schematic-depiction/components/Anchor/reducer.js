import * as actionTypes from "./actionTypes";

export default (state, action) => {
	switch (action.type) {
		case actionTypes.CREATE_ANCHOR:
			console.log(state);
			break;
	}
}