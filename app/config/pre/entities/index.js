import * as user         from "./user";
import * as image        from "./image";
import * as person       from "./person";
import * as event        from "./event";
import * as password     from "./user/password";
import * as verification from "./user/verification";

export const entities = {
	person,
	user,
	image,
	event,
	password,
	verification
};
export default entities;