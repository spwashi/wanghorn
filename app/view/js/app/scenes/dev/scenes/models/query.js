import React, {Component} from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/styles/hljs';
import {SelectivelyActive} from "../../components";

export let Query = ({query, type = 'CreateTable'}) => {
    let className                    = "query";
    let InactiveCreateTableStatement = () =>
        <div className={className + ' ' + type.toLowerCase()}>
            [ {type} (MySQL Query) ]
        </div>;
    let ActiveCreateTableStatement   = () =>
        <pre className={className}>
           <SyntaxHighlighter language='MySQL' style={docco}>{query}</SyntaxHighlighter>
        </pre>;
    return (
        <SelectivelyActive trigger={"click"}
                           className={`wrapper ${className}--wrapper`}
        
                           inactiveComponent={InactiveCreateTableStatement}
                           activeComponent={ActiveCreateTableStatement}
        
                           isActive={false} />
    );
};