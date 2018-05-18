import React from "react";
import {Route} from "react-router-dom";
import * as PropTypes from "prop-types"
import {Query} from "./components/query/index";
import {ModelConfigurationWrapper} from "./components/config/model";
import {getURI} from "../../../../../../path/resolution";
import {SmEntityCreationForm} from "../../../../sm/creation/components/form";
import Modal from "../../../../../components/modal";
import {getNameFromSmID} from "../utility";
import {LinkItem} from "../../../../../../components/navigation";

const AlterTableStatementList = ({statements, executeQuery}) =>
    <div className="alter_table_statement--container alter_table_statement--list container list">
        {statements.map((statement, key) => <Query key={key}
                                                   executeQuery={executeQuery}
                                                   canExecute={true}
                                                   type="AlterTable"
                                                   query={statement} />)}
    </div>;

class CreateModelDialog extends React.Component {
    state = {isActive: true};
    
    render() {
        const {history}      = this.props;
        const {smID, config} = this.props;
        const modelName      = getNameFromSmID(this.props.smID);
        let onRequestClose   = () => {
            let devURI = getURI('dev--model', {name: modelName}, {skipEmpty: true, asReactRoute: true});
            this.setState({isActive: false});
            return history.action === 'PUSH' ? history.goBack() : history.push(devURI);
        };
        return (
            <Modal isOpen={this.state.isActive} onRequestClose={onRequestClose} title={`Create New ${smID}`} contentLabel="Create New">
                <SmEntityCreationForm config={config} url={getURI("dev--create_model--receive", {name: modelName})} />
            </Modal>
        )
    };
}

let ModelActions = function ({tableExists, createModelURI, canCreateTable, executeCreateTableStatement}) {
    let createModelButton = null;
    let createTableButton = null;
    if (tableExists) {
        createModelButton = (
            <div className="model--meta--action--wrapper">
                <LinkItem to={createModelURI} isButton={true}>Create New Model</LinkItem>
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

class ModelMeta extends React.Component {
    render() {
        const {smID, config, model} = this.props;
        const {activeProperties}                                        = this.props;
        const {executeModelQuery, onTogglePropertyClick}                = this.props;
        const {createTableStatement, alterTableStatements, tableExists} = this.props;
        
        const jsConfigDescription            = <div>What <a href={"https://github.com/spwashi/SmJS"}>SmJS</a> uses to configure my models.</div>;
        const phpConfigDescription           = <div>What <a href={"https://github.com/spwashi/SmPHP"}>SmPHP</a> uses to understand my models.</div>;
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
                {<ModelActions {...{tableExists, createModelURI, canCreateTable, executeCreateTableStatement}} />}
                <div className="wrapper component--wrapper model--component--wrapper">
                    <ModelConfigurationWrapper onTogglePropertyClick={onTogglePropertyClick}
                                               description={jsConfigDescription}
                                               type={'SmJS'}
                                               activeProperties={activeProperties}
                                               model={config} />
                    <ModelConfigurationWrapper onTogglePropertyClick={onTogglePropertyClick}
                                               description={phpConfigDescription}
                                               type={'SmPHP'}
                                               activeProperties={activeProperties}
                                               model={model} />
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