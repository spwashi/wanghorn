// Small class to structure the routes we'll use in our application
import {RENDER_METHODS} from "./constants";

type renderedByType = "client" | "server"
type routeParams = {
    resolution: string,
    pattern: string,
    http_method: string,
    name: string,
    title: string,
    renderedBy: renderedByType | Array<renderedByType>
}

export class Route {
    constructor(params: routeParams) {
        let {resolution, pattern, http_method, name, title, renderedBy} = params;
        this.name                                                       = name;
        this.title                                                      = title;
        this.resolution                                                 = resolution
                                                                          ? resolution.replace(/\[([a-zA-Z]+)]/,
                                                                                               (match, className) => `${className}\\${className}`)
                                                                          : null;
        this.pattern                                                    = pattern;
        if (typeof http_method === "string") {
            http_method = [http_method];
        } else if (http_method && !Array.isArray(http_method)) {
            console.log('HTTP Method should be a string or array. --  for: ' + JSON.stringify(arguments));
            http_method = null;
        }
        this.setRenderedBy(renderedBy);
        this.http_method = http_method;
    }
    
    setRenderedBy(renderedBy) {
        if (typeof renderedBy === "string") {
            renderedBy = [renderedBy];
        } else if (renderedBy && (!Array.isArray(renderedBy) || !renderedBy.length)) {
            console.log('Renderer should be a string or non-empty array');
            renderedBy = null;
        } else if (!renderedBy) {
            renderedBy = "server";
        }
        this.renderedBy = renderedBy;
        return this;
    }
    
    isClientRendered(only = false) {
        if (only && this.renderedBy.length !== 1) return false;
        return this.renderedBy.indexOf("client") > -1;
    }
    
    toJSON() {
        const obj = {};
        
        this.name && (obj.name = this.name);
        this.title && (obj.title = this.title);
        this.resolution && (obj.resolution = this.resolution);
        this.pattern && (obj.pattern = this.pattern);
        this.http_method && (obj.http_method = this.http_method);
        
        return obj
    }
}

export const normalizeRoutes =
                 ({
                      routes,
                      frontend_renderer,
                      pattern_prefix
                  }) => {
                     if (!routes) throw new Error("Need routes with pattern prefix");
        
                     routes =
                         routes
                             .map((route: Route) => {
                                 if (route.pattern) route.pattern = (pattern_prefix || '') + route.pattern;
                                 if (frontend_renderer && !route.resolution && route.renderedBy.length === 1 && route.renderedBy[0] === RENDER_METHODS.client) {
                                     route.resolution = frontend_renderer
                                 }
                                 return new Route({...route});
                             });
        
                     return {routes};
                 };