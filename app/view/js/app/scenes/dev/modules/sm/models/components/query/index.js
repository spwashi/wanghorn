import React from "react";
import * as PropTypes from "prop-types";
import {SelectivelyActive} from "../../../../../components/selectivelyActive";
import {ActiveComponent, InactiveComponent} from "../../../../../components/selectivelyActive/components";

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
const QueryTitle            = ({className, type}) => <div className={`title ${className}--title ${type.toLowerCase()}--title`}>[ {type} (MySQL Query) ]</div>;
let ActiveQuery             =
          ({className, executeQuery, query, canExecute}) =>
              <pre className={className}>
                    <QueryControlContainer canExecute={canExecute} executeQuery={executeQuery} />
                    <code className={'query'}>{query}</code>
                </pre>;
export let Query            =
          props => {
              let className                               = "query";
              let {query, type, canExecute, executeQuery} = props;
              if (!query || !query.length) return null;
        
              return (
                  <SelectivelyActive className={`wrapper query--wrapper`} isActive={false}>
                      <InactiveComponent component={QueryTitle} {...{className, type}} />
                      <ActiveComponent component={ActiveQuery} {...{...props, className}} />
                  </SelectivelyActive>
              );
          };
Query.propTypes             = {
    type:         PropTypes.string,
    query:        PropTypes.string,
    canExecute:   PropTypes.bool,
    executeQuery: PropTypes.func
};