import * as user         from "./user";
import * as image        from "./image";
import * as person       from "./person";
import * as event        from "./event";
import * as password     from "./user/password";
import * as user_role     from "./user/role";
import * as verification from "./user/verification";

export const entities = {
	person,
	user,
	image,
	event,
	password,
	user_role,
	verification
};
export default entities;