import React from "react";
import * as PropTypes from "prop-types"
import {Query} from "../query/index";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getURI} from "../../../../../../../path/resolution";
import {getNameFromSmID} from "../../../../../sm/utility";
import {ModelConfigurationContainer} from "./components/configurationContainer";
import {AlterTableStatementList} from "./components/alterTableStatementList";
import SmEntityMeta from "../../../../../sm/components/meta";
import {selectAllModelMetaObjects} from "../../selector";
import {executeModelQuery} from "../../../../../sm/modules/models/actions/index";

@connect(mapState, mapDispatch)
class ModelMeta extends React.Component {
    constructor() {
        super(...arguments);
        const {smID, executeModelQuery}     = this.props;
        this.executeCreateTableStatement    = () => { executeModelQuery({smID, query: 'CREATE_TABLE'})};
        this.executeAllAlterTableStatements = () => { executeModelQuery({smID, query: 'ALTER_TABLE'})};
    }
    
    get metaStatus() {return this.modelMeta.status;}
    
    get modelMeta() {return this.props.models[this.props.smID];}
    
    executeCreateTableStatement() { if (this) console.log('no-op');}
    
    executeAllAlterTableStatements() { if (this) console.log('no-op');}
    
    render() {
        if (!this.modelMeta) return '...loading';
        
        const config               = this.modelMeta.CONFIG;
        const schematic            = this.modelMeta.schematic;
        const alterTableStatements = this.modelMeta.alterTableStatements;
        const createTableStatement = this.modelMeta.createTableStatement;
        const actions              = this.actions;
        return (
            <SmEntityMeta config={config} schematic={schematic} actions={actions}>
                <div className={`smEntity--source--existence ${this.metaStatus.tableExists ? 'existent' : 'non-existent'}`} />
                <ModelConfigurationContainer schematic={schematic} config={config || {}} />
                <Query type={'CreateTable'}
                       query={createTableStatement}
                       canExecute={this.metaStatus.canCreateTable}
                       executeQuery={this.executeCreateTableStatement} />
                <AlterTableStatementList statements={alterTableStatements || []} executeQuery={this.executeAllAlterTableStatements} />
            </SmEntityMeta>
        );
    }
    
    get actions() {
        const name                = getNameFromSmID(this.props.smID);
        const formUriName         = `model--${name}--create`;
        const fallbackFormUriName = `model--create`;
        const uri                 = getURI(formUriName, {name}, {fallback: fallbackFormUriName});
        return {
            createModel: {
                title:      'Create New Model',
                uri,
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