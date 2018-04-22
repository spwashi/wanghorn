import React from "react";
import * as PropTypes from "prop-types";
import {ActiveComponent, InactiveComponent, SelectivelyActive} from "../../../../../components/selectivelyActive";

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

const QueryTitle = ({className, type}) => <div className={`title ${className}--title ${type.toLowerCase()}--title`}>[ {type} (MySQL Query) ]</div>;
export let Query = ({query, type, canExecute, executeQuery}) => {
    let className = "query";
    if (!query || !query.length) return null;
    let ActiveQuery =
            props =>
                <pre className={className}>
                    <QueryControlContainer canExecute={canExecute} executeQuery={executeQuery} />
                    <code className={'query'}>{query}</code>
                </pre>;
    return (
        <SelectivelyActive trigger={"click"} className={`wrapper query--wrapper`} isActive={false}>
            <InactiveComponent>
                <QueryTitle {...{className, type}} />
            </InactiveComponent>
            <ActiveComponent component={ActiveQuery} />
        </SelectivelyActive>
    );
};
Query.propTypes  = {
    type:         PropTypes.string,
    query:        PropTypes.string,
    canExecute:   PropTypes.bool,
    executeQuery: PropTypes.func
};