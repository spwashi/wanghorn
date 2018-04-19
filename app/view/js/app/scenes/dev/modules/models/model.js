import React from "react";
import * as PropTypes from "prop-types"
import {Query} from "./components/query/index";
import {ModelConfigurationWrapper} from "./components/config/model";

const AlterTableStatementList = ({statements, executeQuery}) =>
    <div className="alter_table_statement--container alter_table_statement--list container list">
        {statements.map((statement, key) => <Query key={key}
                                                   executeQuery={executeQuery}
                                                   canExecute={true}
                                                   type="AlterTable"
                                                   query={statement} />)}
    </div>;

class ModelDevComponent extends React.Component {
    render() {
        const {smID, config, model}                                     = this.props;
        const {executeModelQuery}                                       = this.props;
        const {createTableStatement, alterTableStatements, tableExists} = this.props;
        
        const jsConfigDescription  = <div>What <a href={"https://github.com/spwashi/SmJS"}>SmJS</a> uses to configure my models.</div>;
        const phpConfigDescription = <div>What <a href={"https://github.com/spwashi/SmPHP"}>SmPHP</a> uses to understand my models.</div>;
        
        const executeCreateTableStatement    = () => { executeModelQuery({smID, query: 'CREATE_TABLE'})};
        const executeAllAlterTableStatements = () => { executeModelQuery({smID, query: 'ALTER_TABLE'})};
        
        return (
            <div key={smID} className={"dev--model--wrapper"}>
                <h3 id={smID} className={"title model--smID"}>{smID}</h3>
                
                <div className="wrapper component--wrapper model--component--wrapper">
                    <ModelConfigurationWrapper description={jsConfigDescription} type={'SmJS'} model={config} />
                    <ModelConfigurationWrapper description={phpConfigDescription} type={'SmPHP'} model={model} />
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

ModelDevComponent.propTypes = {
    smID:                 PropTypes.string,
    config:               PropTypes.object,
    model:                PropTypes.object,
    tableExists:          PropTypes.bool,
    createTableStatement: PropTypes.string,
    alterTableStatements: PropTypes.arrayOf(PropTypes.string),
};

export default ModelDevComponent;