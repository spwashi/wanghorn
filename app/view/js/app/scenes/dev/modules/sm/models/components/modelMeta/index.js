import React from "react";
import * as PropTypes from "prop-types"
import {Query} from "../query/index";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getURI} from "../../../../../../../../path/resolution";
import {getNameFromSmID} from "../../../utility";
import {ModelConfigurationContainer} from "./components/configurationContainer";
import {AlterTableStatementList} from "./components/alterTableStatementList";
import SmEntityMeta from "../../../../../../sm/components/meta";
import {selectAllModelMetaObjects} from "../../selector";
import {executeModelQuery} from "../../actions";

@connect(mapState, mapDispatch)
class ModelMeta extends React.Component {
    constructor() {
        super(...arguments);
        const {smID, executeModelQuery}     = this.props;
        this.executeCreateTableStatement    = () => { executeModelQuery({smID, query: 'CREATE_TABLE'})};
        this.executeAllAlterTableStatements = () => { executeModelQuery({smID, query: 'ALTER_TABLE'})};
    }
    
    get metaStatus() {
        const createTableStatement = this.modelMeta.createTableStatement;
        const tableExists          = this.modelMeta.tableExists;
        return {
            canCreateTable: (!tableExists) && createTableStatement && createTableStatement.length,
            tableExists:    tableExists
        };
    }
    
    get modelMeta() {
        const smID      = this.props.smID;
        const modelMeta = this.props.models[smID];
        return modelMeta;
    }
    
    executeCreateTableStatement() { if (this) console.log('no-op');}
    
    executeAllAlterTableStatements() { if (this) console.log('no-op');}
    
    render() {
        const config               = this.modelMeta.config;
        const schematic            = this.modelMeta.schematic;
        const activeProperties     = this.modelMeta.activeProperties;
        const alterTableStatements = this.modelMeta.alterTableStatements;
        const createTableStatement = this.modelMeta.createTableStatement;
        
        const actions = this.actions;
        return (
            <SmEntityMeta config={config} schematic={schematic} actions={actions}>
                <div className={`smEntity--source--existence ${this.metaStatus.tableExists ? 'existent' : 'non-existent'}`} />
                <ModelConfigurationContainer schematic={schematic} config={config || {}} />
                <Query type={'CreateTable'}
                       query={createTableStatement}
                       canExecute={this.metaStatus.canCreateTable}
                       executeQuery={this.executeCreateTableStatement} />
                <AlterTableStatementList statements={alterTableStatements || []}
                                         executeQuery={this.executeAllAlterTableStatements} />
            </SmEntityMeta>
        );
    }
    
    get actions() {
        const name = getNameFromSmID(this.props.smID);
        return {
            createModel: {
                title:      'Create New Model',
                uri:        getURI('dev--create_model', {name}),
                canExecute: this.metaStatus.tableExists
            },
            createTable: {
                title:      'Create Table',
                callback:   this.executeCreateTableStatement,
                canExecute: this.metaStatus.canCreateTable
            }
        };
    }
}

ModelMeta.propTypes = {smID: PropTypes.string};

export default ModelMeta;
function mapState(state) {
    return {models: selectAllModelMetaObjects(state) || {}};
}
function mapDispatch(dispatch) {
    return bindActionCreators({executeModelQuery}, dispatch);
}