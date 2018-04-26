import React from "react"
import * as PropTypes from "prop-types"
import {PropertyConfigurationAttribute} from "./index";
import Tag from "base-components/tag";

class PropertyConfigurationDatatypesAttribute extends React.Component {
    render() {
        const {datatypes} = this.props;
        return (
            <PropertyConfigurationAttribute attribute="datatypes">
                {(datatypes || []).map(item => <Tag key={item} className={'inline datatype'}>{item}</Tag>)}
            </PropertyConfigurationAttribute>
        );
        
    }
}

PropertyConfigurationDatatypesAttribute.propTypes = {
    datatypes: PropTypes.arrayOf(PropTypes.string)
};
export default PropertyConfigurationDatatypesAttribute;