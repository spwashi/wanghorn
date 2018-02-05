import {APP_PATH} from "../config";

class Route {
    constructor(resolution: string, pattern: string, route_name: string) {
        this.route_name = route_name;
        this.resolution = resolution
            ? resolution.replace(/\[([a-zA-Z]+)]/,
                                 (match, className) => `${className}\\${className}`)
            : null;
        this.pattern    = pattern;
    }
    
    toJSON() {
        const obj = {
            resolution: this.resolution,
            pattern:    this.pattern,
        };
        this.route_name && (obj.name = this.route_name);
        return obj
    }
}

export const routes = {
    pattern_prefix: APP_PATH,
    
    routes: [
        new Route("Error@rt_404", "404/{path}",
                  "name"),
        new Route("#Home::index", "$",
                  "home"),
        new Route("#Home::item", null, 'test'),
        
        new Route("#[Dev]::monitors", "dev/monitors", "monitors"),
        new Route("#[Dev]::modelsToTables", "dev/models"),
        new Route("#[Dev]::eg", "dev/example", "example"),
        
        new Route("[User]@login", "user/login$"),
        new Route("[User]@userByID", "user/{id}:\\d+"),
        
        new Route("#Temp::react_1", "one"),
        new Route("#Temp::react_1", "one/{id}:[a-zA-Z]*"),
    ]
};