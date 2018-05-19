import React from "react";
import {Route} from "react-router-dom";
import * as PropTypes from "prop-types"
import {Query} from "../query/index";
import {getURI} from "../../../../../../../../path/resolution";
import {getNameFromSmID} from "../../../utility";
import {ModelActions} from "./components/modelActions";
import {ModelConfigurationContainer} from "./components/configurationContainer";
import {CreateModelDialog} from "./components/createModelDialog";
import {AlterTableStatementList} from "./components/alterTableStatementList";

class ModelMeta extends React.Component {
    render() {
        const {smID, config, model}                                     = this.props;
        const {activeProperties}                                        = this.props;
        const {executeModelQuery, onTogglePropertyClick}                = this.props;
        const {createTableStatement, alterTableStatements, tableExists} = this.props;
        
        const executeCreateTableStatement    = () => { executeModelQuery({smID, query: 'CREATE_TABLE'})};
        const executeAllAlterTableStatements = () => { executeModelQuery({smID, query: 'ALTER_TABLE'})};
        const canCreateTable                 = (!tableExists) && createTableStatement && createTableStatement.length;
        const createModelURI                 = getURI('dev--create_model', {name: getNameFromSmID(smID)});
        
        return (
            <div key={smID} className={"model--meta"}>
                <header>
                    <h3 id={smID} className={"title model--smID"}>{smID}</h3>
                    <div className={`model--source--existence ${!canCreateTable ? 'existent' : 'non-existent'}`}></div>
                </header>
                <ModelActions canCreateTable={canCreateTable} createModelURI={createModelURI}
                              tableExists={tableExists} executeCreateTableStatement={executeCreateTableStatement} />
                <div className="wrapper component--wrapper model--component--wrapper">
                    <ModelConfigurationContainer model={model} config={config}
                                                 onTogglePropertyClick={onTogglePropertyClick}
                                                 activeProperties={activeProperties} />
                </div>
                <div className="wrapper component--wrapper model--component--wrapper">
                    <Query type={'CreateTable'}
                           query={createTableStatement}
                           canExecute={!tableExists}
                           executeQuery={executeCreateTableStatement} />
                </div>
                <div className="wrapper component--wrapper model--component--wrapper">
                    <AlterTableStatementList statements={alterTableStatements || []} executeQuery={executeAllAlterTableStatements} />
                </div>
                <Route path={getURI('dev--create_model', null, {skipEmpty: true, asReactRoute: true})}
                       component={({history}) => <CreateModelDialog smID={smID} config={config} history={history} />} />
            </div>
        );
    }
}

ModelMeta.propTypes = {
    smID:                  PropTypes.string,
    config:                PropTypes.object,
    model:                 PropTypes.object,
    tableExists:           PropTypes.bool,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    createTableStatement:  PropTypes.string,
    alterTableStatements:  PropTypes.arrayOf(PropTypes.string),
    onTogglePropertyClick: PropTypes.func,
    executeModelQuery:     PropTypes.func,
};

export default ModelMeta;