import React from "react";
import * as PropTypes from "prop-types";
import {SelectivelyActive} from "../../../../components";

export let Query = ({query, type = 'CreateTable'}) => {
    let className              = "query";
    let InactiveQueryStatement = () =>
        <div className={className + ' ' + type.toLowerCase()}>
            [ {type} (MySQL Query) ]
        </div>;
    let ActiveQueryStatement   = () =>
        <pre className={className}>
           {query}
        </pre>;
    return (
        <SelectivelyActive trigger={"click"}
                           className={`wrapper ${className}--wrapper`}
        
                           inactiveComponent={InactiveQueryStatement}
                           activeComponent={ActiveQueryStatement}
        
                           isActive={false} />
    );
};
Query.propTypes  = {
    type:  PropTypes.string,
    query: PropTypes.string
};