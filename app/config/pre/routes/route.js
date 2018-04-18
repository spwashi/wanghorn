// Small class to structure the routes we'll use in our application

export class Route {
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