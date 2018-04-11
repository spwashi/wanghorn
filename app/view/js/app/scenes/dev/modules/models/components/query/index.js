import React from "react";
import * as PropTypes from "prop-types";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/styles/hljs';
import {SelectivelyActive} from "../../../../components";

export let Query = ({query, type = 'CreateTable'}) => {
    let className              = "query";
    let InactiveQueryStatement = () =>
        <div className={className + ' ' + type.toLowerCase()}>
            [ {type} (MySQL Query) ]
        </div>;
    let ActiveQueryStatement   = () =>
        <pre className={className}>
           <SyntaxHighlighter language='MySQL' style={docco}>{query}</SyntaxHighlighter>
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