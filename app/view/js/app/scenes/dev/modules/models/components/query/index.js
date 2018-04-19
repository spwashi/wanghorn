import React from "react";
import * as PropTypes from "prop-types";
import {SelectivelyActive} from "../../../../components";
import {ActiveComponent, InactiveComponent} from "../../../../components/selectivelyActive";

const QueryControlContainer = ({canExecute, executeQuery}) => {
    if (!canExecute) return null;
    let handleExecuteClick = event => {
        event.stopPropagation();
        executeQuery();
    };
    return (
        <div className="query--control--container">
            <button className="executeQuery--button query--control query--control__button" onClick={handleExecuteClick}>
                Run ->
            </button>
        </div>
    )
};

export let Query = ({
                        query,
                        type,
                        canExecute,
                        executeQuery
                    }) => {
    let className = "query";
    return (
        <SelectivelyActive trigger={"click"} className={`wrapper query--wrapper`} isActive={false}>
            <InactiveComponent>
                <div className={className + ' ' + type.toLowerCase()}>
                    [ {type} (MySQL Query) ]
                </div>
            </InactiveComponent>
            <ActiveComponent>
                <QueryControlContainer canExecute={canExecute} executeQuery={executeQuery} />
                <pre className={className}>
                    <code className={'query'}>{query}</code>
                </pre>
            </ActiveComponent>
        </SelectivelyActive>
    );
};
Query.propTypes  = {
    type:         PropTypes.string,
    query:        PropTypes.string,
    canExecute:   PropTypes.bool,
    executeQuery: PropTypes.func
};