import React from "react"
import * as PropTypes from "prop-types"
import {PropertyConfigurationAttribute} from "./index";
import Tag from "../../../../../../../../components/tag/index";
import {ConfigurationSmID_OrName} from "../../../../../components/configuration/attribute/smIDLink";

class PropertyConfigurationDatatypesAttribute extends React.Component {
    render() {
        const {datatypes} = this.props;
        return (
            <PropertyConfigurationAttribute attribute="datatypes">
                {(datatypes || []).map(item => <Tag key={item} className={'inline datatype'}>{<ConfigurationSmID_OrName smID={item} />}</Tag>)}
            </PropertyConfigurationAttribute>
        );
        
    }
}

PropertyConfigurationDatatypesAttribute.propTypes = {
    datatypes: PropTypes.arrayOf(PropTypes.string)
};
export default PropertyConfigurationDatatypesAttribute;