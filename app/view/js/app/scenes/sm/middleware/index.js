import fetchMiddleware from "./fetch"
import persistMiddleware from "./persist"

export default [...fetchMiddleware, ...persistMiddleware];