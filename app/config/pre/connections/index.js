import {__CONFIGURATION__, POSSIBLE_ENVIRONMENTS} from "../../config";
const std = {
	dbms:     'mysql',
	host:     'localhost',
	username: 'wanghorn',
	password: 'wanghorn',
	get database() {
		switch (__CONFIGURATION__.ENVIRONMENT) {
			case POSSIBLE_ENVIRONMENTS.TESTING:
				return 'wanghorn__test';
			default:
				return 'wanghorn';
		}
	}
};

export const connection = {
	database: {
		std,
		meta: std
	},
	email:    {
		std: {
			username: 'support@spwashi.com',
			password: 'example'
		}
	}
};