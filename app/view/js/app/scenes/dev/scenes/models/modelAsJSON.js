import React, {Component} from "react";
import {SelectivelyActiveComponent} from "./selectivelyActive";

export let ModelAsJSON = function ({model, type = 'model'}) {
    let className                       = type + "__json";
    const InactiveModelAsJSON_Component = () =>
        <div className={className}>
            [ {type[0].toUpperCase() + type.substr(1)} as JSON ]
        </div>;
    const ActiveModelAsJSON_Component   = () =>
        <pre className={className}>
           {model && JSON.stringify(model, ' ', 3)}
        </pre>;
    return <SelectivelyActiveComponent trigger={"click"}
                                       className={`wrapper ${className}--wrapper`}
    
                                       inactiveComponent={InactiveModelAsJSON_Component}
                                       activeComponent={ActiveModelAsJSON_Component}
    
                                       isActive={false} />;
};
export default ModelAsJSON;