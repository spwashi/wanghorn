import {Route} from "../route";

export default [
	new Route({
		          resolution: "[Error]@rt_404",
		          pattern:    "404/{path}:.*",
		          name:       "error-404"
	          })
]