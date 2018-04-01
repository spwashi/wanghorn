import React, {Component} from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/styles/hljs';
import {SelectivelyActiveComponent} from "./selectivelyActive";
export let CreateTableStatement = ({query}) => {
    let className                    = "query--createTableStatement";
    let InactiveCreateTableStatement = () =>
        <div className={className}>
            [ CreateTable MySQL ]
        </div>;
    let ActiveCreateTableStatement   = () =>
        <pre className={className}>
           <SyntaxHighlighter language='MySQL' style={docco}>{query}</SyntaxHighlighter>
        </pre>;
    return (
        <SelectivelyActiveComponent trigger={"click"}
                                    className={`wrapper ${className}--wrapper`}
        
                                    inactiveComponent={InactiveCreateTableStatement}
                                    activeComponent={ActiveCreateTableStatement}
        
                                    isActive={false} />
    );
};