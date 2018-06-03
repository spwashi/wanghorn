import {Route} from "../route";
import {HTTP, RENDER_METHODS} from "../constants";

const model = {
    all: [
        new Route({
                      title:      'Create Model',
                      renderedBy: RENDER_METHODS.client,
                      pattern:    "model/{name}:[a-zA-Z_]+/create$",
                      name:       "model--create"
                  }),
        new Route({
                      resolution:  "[Model]@create",
                      pattern:     "model/{name}:[a-zA-Z_]+/create/receive$",
                      name:        "model--create--receive",
                      http_method: HTTP.POST
                  }),
    ],
};
export default [...model.all];