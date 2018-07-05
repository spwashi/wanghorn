import path from "path";

// ASSUMED TO CHANGE
let env                            = 'testing' || process.env.NODE_ENV;
export const POSSIBLE_ENVIRONMENTS = {
	TESTING:     'testing',
	PRODUCTION:  'production',
	STAGING:     'development',
	DEVELOPMENT: 'development'
};
export const __CONFIGURATION__     = {

	// ENVIRONMENT
	// The environment in which we are operating -- defaults to production for the sake of probable intention
	get ENVIRONMENT() {
		return env || 'production';
	},

	// The name of the application without spaces. Case sensitive, I recommend lowercase-with-dashes or camelCased
	get APP_NAME() { return `wanghorn` },

	// The namespace used in PHP to prefix app-specific files
	get APP_NAMESPACE() { return 'WANGHORN' },

	// PATHS

	get URL_PATHS(): { APPLICATION: string, ROOT: string, PUBLIC: string, BASE_PATH: string } {
		const ENVIRONMENT = this.ENVIRONMENT;

		return {
			// The URL including the Path that we will use to access our files
			get APPLICATION() {
				switch (ENVIRONMENT) {
					default:
						return this.BASE_PATH.length ? `${this.ROOT}/${this.BASE_PATH}` : this.ROOT
				}
			},

			// The URL Path (sans leading or trailing slash) at which the main site can be found relative to the domain
			get BASE_PATH() {
				return '';
			},

			// URL for the public files (where we access the files output by webpack)
			get PUBLIC() {
				switch (ENVIRONMENT) {
					default:
						return `${this.APPLICATION}/public`;
				}
			},

			// The domain name of the site we are configuring
			get ROOT() {
				switch (ENVIRONMENT) {
					default:
						return 'http://wanghorn';
				}
			}
		}
	},
	get DIR_PATHS(): { APPLICATION: string, CONFIG: string, PUBLIC: string, VIEW: string } {
		const ENVIRONMENT = this.ENVIRONMENT;

		return {
			// Path to the app dir
			get APPLICATION() {
				switch (ENVIRONMENT) {
					default:
						return path.resolve(__dirname, '..')
				}
			},

			// Path to the directory we use to config the application
			get CONFIG() {
				switch (ENVIRONMENT) {
					case POSSIBLE_ENVIRONMENTS.TESTING:
						return path.resolve(this.APPLICATION, 'tests', '_config');
					default:
						return path.resolve(this.APPLICATION, 'config');
				}
			},

			// Path to the public/ dir (where our generated HTML, CSS, and JS will go in their respective folders)
			get PUBLIC() {
				switch (ENVIRONMENT) {
					default:
						return path.resolve(this.APPLICATION, '..', 'public')
				}
			},

			// Path to the app/view/ dir (where we have our templates)
			get VIEW() {
				switch (ENVIRONMENT) {
					default:
						return path.resolve(this.APPLICATION, 'view')
				}
			}
		}
	}
};