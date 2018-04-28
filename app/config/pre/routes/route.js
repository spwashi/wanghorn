// Small class to structure the routes we'll use in our application

export class Route {
    constructor({resolution, pattern, httpMethod, name}) {
        this.name       = name;
        this.resolution = resolution
                          ? resolution.replace(/\[([a-zA-Z]+)]/,
                                               (match, className) => `${className}\\${className}`)
                          : null;
        this.pattern    = pattern;
        if (typeof httpMethod === "string") {
            httpMethod = [httpMethod];
        } else if (httpMethod && !Array.isArray(httpMethod)) {
            console.log('HTTP Method should be a string or array. --  for: ' + JSON.stringify(arguments));
            httpMethod = null;
        }
        this.httpMethod = httpMethod;
    }
    
    toJSON() {
        const obj = {
            resolution:  this.resolution,
            pattern:     this.pattern,
            http_method: this.httpMethod
        };
        this.name && (obj.name = this.name);
        return obj
    }
}