import React from "react";
import * as PropTypes from "prop-types"
import {Query} from "./components/query/index";
import {ModelConfigurationWrapper} from "./components/config/model";
import Modal from "../../../../../components/modal";
import {ModelCreationForm} from "./components/creation/form";

const AlterTableStatementList = ({statements, executeQuery}) =>
    <div className="alter_table_statement--container alter_table_statement--list container list">
        {statements.map((statement, key) => <Query key={key}
                                                   executeQuery={executeQuery}
                                                   canExecute={true}
                                                   type="AlterTable"
                                                   query={statement} />)}
    </div>;

class ModelMeta extends React.Component {
    render() {
        const {smID, config, model}                                                                     = this.props;
        const {activeProperties}                                                                        = this.props;
        const {executeModelQuery, onTogglePropertyClick, closeModelCreateDialog, openModelCreateDialog} = this.props;
        const {createTableStatement, alterTableStatements, tableExists}                                 = this.props;
        
        const jsConfigDescription  = <div>What <a href={"https://github.com/spwashi/SmJS"}>SmJS</a> uses to configure my models.</div>;
        const phpConfigDescription = <div>What <a href={"https://github.com/spwashi/SmPHP"}>SmPHP</a> uses to understand my models.</div>;
        
        const executeCreateTableStatement    = () => { executeModelQuery({smID, query: 'CREATE_TABLE'})};
        const executeAllAlterTableStatements = () => { executeModelQuery({smID, query: 'ALTER_TABLE'})};
        const canCreateTable                 = (!tableExists) && createTableStatement && createTableStatement.length;
        return (
            <div key={smID} className={"model--meta"}>
                <header>
                    <h3 id={smID} className={"title model--smID"}>{smID}</h3>
                    <div className={`model--source--existence ${!canCreateTable ? 'existent' : 'non-existent'}`}></div>
                </header>
                <div className="model--meta--action--container">
                    {
                        tableExists ? (
                                        <div className="model--meta--action--wrapper">
                                            <button onClick={() => openModelCreateDialog({smID})}>Create New Model</button>
                                            <Modal onRequestClose={() => closeModelCreateDialog({smID})}
                                                   isOpen={this.props.isCreatingNew}
                                                   title={`Create New ${smID}`}
                                                   contentLabel="Create New">
                                                <ModelCreationForm model={model} smID={smID} />
                                            </Modal>
                                        </div>
                                    )
                                    : null
                    }
                    {
                        canCreateTable ? (
                                           <div className="model--meta--action--wrapper">
                                               <button onClick={executeCreateTableStatement}>Create Table</button>
                                           </div>
                                       )
                                       : null
                    }
                </div>
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
            </div>
        )
    }
}

ModelMeta.propTypes = {
    smID:                  PropTypes.string,
    config:                PropTypes.object,
    model:                 PropTypes.object,
    tableExists:           PropTypes.bool,
    isCreatingNew:         PropTypes.bool,
    activeProperties:      PropTypes.arrayOf(PropTypes.string),
    openModelCreateDialog: PropTypes.func,
    createTableStatement:  PropTypes.string,
    alterTableStatements:  PropTypes.arrayOf(PropTypes.string),
    onTogglePropertyClick: PropTypes.func,
};

export default ModelMeta;