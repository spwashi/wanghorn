import React from "react"
import * as PropTypes from "prop-types"
import {SmEntitySelectOption} from "./option/index";
import ReactSelect from "react-select";

/**
 * Using an SmEntity, convert a property into a Select dialog
 */
export class SmEntitySelect extends React.Component {
    static propTypes = {
        schematic:                  PropTypes.object,
        data:                       PropTypes.array,
        inputProps:                 PropTypes.object,
        resolveSmEntities:          PropTypes.func.isRequired,
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
        this.props.data ? this.onHasData(this.props.data)
                        : Promise.resolve(this.props.resolveSmEntities())
                                 .then(data => this.onHasData(data));
    }
    
    render() {
        const {required} = this.props.inputProps || {};
        const name       = this.props.name;
        const value      = this.props.value;
        const data       = this.props.data || [];
        console.log(data);
        const options    =
                  data.map(smEntity => this.smEntityOptionAttributes(smEntity));
        
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
        const schematic       = this.props.schematic;
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