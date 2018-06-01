import React from "react"
import * as PropTypes from "prop-types"
import {SmEntitySelectOption} from "./option/index";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import ReactSelect from "react-select";
import {fromSm_selectItemsOfSmID, fromSm_selectSchematicOfSmID, selectSmState} from "../../../../../selector";
import {fetchSmEntities, fetchSmEntitySchematic} from "../../../../../actions";

const mapState    = state => ({sm: selectSmState(state)});
const mapDispatch = dispatch => bindActionCreators({fetchSmEntities, fetchSmEntitySchematic}, dispatch);
let hasFetched    = false;

/**
 * Using an SmEntity, convert a property into a Select dialog
 */
@connect(mapState, mapDispatch)
export class SmEntitySelect extends React.Component {
    static propTypes = {
        schematic:                  PropTypes.object,
        itemSmIDs:                  PropTypes.array,
        data:                       PropTypes.array,
        inputProps:                 PropTypes.object,
        getSmEntityFieldAttributes: PropTypes.func.isRequired,
    };
           state     = {data: null, referencedSchematic: null};
    
    onHasData(data) {
        if (!Array.isArray(data)) { return; }
        const isRequired = this.props.inputProps.required;
        if (data.length >= 1 && isRequired) {
            let {value} = this.smEntityOptionAttributes(data[0]);
            this.props.onValueChange(value);
        }
    };
    
    componentDidMount() {
        const smIDs = this.props.itemSmIDs;
        if (hasFetched) {
            const items = [];
            smIDs.map(smID => {
                const fetched = fromSm_selectItemsOfSmID(this.props.sm, {smID}) || [];
                return items.push(...fetched);
            });
            if (!this.state.data) {
                this.onHasData(items);
                this.setState({data: items})
            }
        } else {
            hasFetched = !!smIDs.map(smID => this.props.fetchSmEntities({smID}))
        }
    }
    
    render() {
        const {required} = this.props.inputProps || {};
        const name       = this.props.name;
        const value      = this.props.value;
        const data       = this.state.data || [];
        
        const options = data.map(smEntity => this.smEntityOptionAttributes(smEntity));
        
        return <ReactSelect ref={ref => { this.select = ref; }}
        
                            rtl={false} searchable={true} simpleValue
        
                            onBlurResetsInput={false} onSelectResetsInput={false}
        
                            name={name}
                            value={value}
                            options={options}
                            onChange={this.props.onValueChange}
        
                            valueComponent={SmEntitySelectOption} optionComponent={SmEntitySelectOption} />;
    }
    
    smEntityOptionAttributes(smEntity) {
        if (this.props.itemSmIDs.length > 1) throw new Error("Can only select from one kind of SmEntity");
        
        const smID            = this.props.itemSmIDs[0];
        const schematic       = fromSm_selectSchematicOfSmID(this.props.sm, {smID});
        const fieldAttributes = this.props.getSmEntityFieldAttributes(smEntity, schematic);
        const {value, title}  = fieldAttributes;
        return {
            value,
            label: title,
            schematic,
            smEntity
        };
    }
}