import {APP_BASE_URL_PATH} from "../../config";
import {Route} from "./route";

export const routes = {
    pattern_prefix: APP_BASE_URL_PATH + '/',
    routes:         [
        // Error Handlers
        new Route("[Error]@rt_404", "404/{path}", "404"),
        
        // Home Routes
        new Route("#[Home]::index", "$", "home"),
        new Route("#[Home]::test", null, 'test'),
        
        // Dev Routes (remove from production!)
        new Route("#[Dev]::monitors", "dev/monitors", "monitors"),
        new Route("#[Dev]::models", "dev/models.json"), // Content-Type: application/json
        new Route("#[Dev]::executeQuery", "dev/model/{smID}:[\\[a-zA-Z\\]\\s]+/execute/{query}:[a-zA-Z_]+"), // Content-Type: application/json
        new Route("#[Dev]::eg", "dev/example", "example"),
        
        // (site helpers)
        new Route("#[Home]::gallery", "gallery/items.json"),  // Content-Type: application/json
        
        // User Routes
        new Route("[User]@login", "user/login$"),
        new Route("[User]@userByID", "user/{id}:[a-zA-Z@\.]+"),
        
        // Catch-all
        new Route("#[Home]::index", ".*"),
    
    ]
};