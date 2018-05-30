import React from "react";
import * as PropTypes from "prop-types"
import {Query} from "../query/index";
import {getURI} from "../../../../../../../../path/resolution";
import {getNameFromSmID} from "../../../utility";
import {ModelConfigurationContainer} from "./components/configurationContainer";
import {AlterTableStatementList} from "./components/alterTableStatementList";
import SmEntityMeta from "../../../../../../sm/smEntity/meta";

class ModelMeta extends React.Component {
    render() {
        const {smID, config, schematic}                                 = this.props;
        const {activeProperties}                                        = this.props;
        const {executeModelQuery, onTogglePropertyClick}                = this.props;
        const {createTableStatement, alterTableStatements, tableExists} = this.props;
        
        const executeCreateTableStatement    = () => { executeModelQuery({smID, query: 'CREATE_TABLE'})};
        const executeAllAlterTableStatements = () => { executeModelQuery({smID, query: 'ALTER_TABLE'})};
        const canCreateTable                 = (!tableExists) && createTableStatement && createTableStatement.length;
        const createModelURI                 = getURI('dev--create_model', {name: getNameFromSmID(smID)});
        
        return (
            <SmEntityMeta config={config} schematic={schematic} actions={{
                createModel: {
                    uri:        createModelURI,
                    canExecute: tableExists,
                    title:      'Create New Model'
                },
                createTable: {
                    callback:   executeCreateTableStatement,
                    canExecute: canCreateTable,
                    title:      'Create Table'
                }
            }}>
                <div className={`smEntity--source--existence ${!canCreateTable ? 'existent' : 'non-existent'}`} />
                <ModelConfigurationContainer schematic={schematic}
                                             config={config || {}}
                                             onTogglePropertyClick={onTogglePropertyClick}
                                             activeProperties={activeProperties} />
                <Query type={'CreateTable'}
                       query={createTableStatement}
                       canExecute={!tableExists}
                       executeQuery={executeCreateTableStatement} />
                <AlterTableStatementList statements={alterTableStatements || []} executeQuery={executeAllAlterTableStatements} />
            </SmEntityMeta>
        );
    }
}

ModelMeta.propTypes = {
    smID:                  PropTypes.string,
    config:                PropTypes.object,
    schematic:             PropTypes.object,
    tableExists:           PropTypes.bool,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    createTableStatement:  PropTypes.string,
    alterTableStatements:  PropTypes.arrayOf(PropTypes.string),
    onTogglePropertyClick: PropTypes.func,
    executeModelQuery:     PropTypes.func,
};

export default ModelMeta;