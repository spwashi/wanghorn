import React from "react"
import * as PropTypes from "prop-types"
import {parseSmID} from "../../../modules/sm/utility";
import {ConfigurationSmID_OrName} from "./smIDLink";

class AttrValue extends React.Component {
    render() {
        const value = this.props.value;
        const attr  = this.props.attr;
        if (attr === "smID") {
            return <ConfigurationSmID_OrName smID={value}>{value}</ConfigurationSmID_OrName>;
        }
        
        if (typeof value === "boolean") {
            return (
                <div className={`boolean ${value ? 'true' : 'false'}`}>{
                    /(is|has|does)/.test(attr.toLowerCase()) ? (value ? 'yes'
                                                                      : 'no')
                                                             : (value ? 'true'
                                                                      : 'false')
                }</div>
            );
        }
        
        if (typeof value === "string") {
            if (value[0] === '[') {
                const parsedSmID = parseSmID(value);
                if (parsedSmID.name) return <ConfigurationSmID_OrName smID={value}>{value}</ConfigurationSmID_OrName>
            }
            return value;
        }
        
        if (typeof value === "number") return value;
        
        return (
            <pre>{
                Array.isArray(value) ? value.map((item, i) => <div key={i} className={`array--item array--item__${i}`}>{item}</div>)
                                     : JSON.stringify(value, ' ', 3)
            }</pre>
        );
    }
}

export default AttrValue;
AttrValue.propTypes = {
    attr:  PropTypes.string,
    value: PropTypes.any
};