import {CREATE_ANCHOR} from "./AnchorActionTypes";

export default (state, action) => {
	switch (action.type) {
		case CREATE_ANCHOR:
			console.log(state);
			break;
	}
}