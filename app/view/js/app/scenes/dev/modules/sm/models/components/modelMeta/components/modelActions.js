import React from "react"
import * as PropTypes from "prop-types"
import {LinkItem} from "../../../../../../../../../components/navigation";

export const ModelActions = function ({tableExists, createModelURI, canCreateTable, executeCreateTableStatement}) {
    let createModelButton = null;
    let createTableButton = null;
    if (tableExists) {
        createModelButton = (
            <div className="model--meta--action--wrapper">
                <LinkItem to={createModelURI}
                          className={'button'}
                          isButton={true}>Create New Model</LinkItem>
            </div>
        );
    }
    if (canCreateTable) {
        createTableButton = (
            <div className="model--meta--action--wrapper">
                <button onClick={executeCreateTableStatement}>Create Table</button>
            </div>
        );
    }
    return <div className="model--meta--action--container">{createModelButton}{createTableButton}</div>;
};
ModelActions.propTypes    = {
    tableExists:                 PropTypes.bool,
    createModelURI:              PropTypes.string,
    canCreateTable:              PropTypes.bool,
    executeCreateTableStatement: PropTypes.func
};