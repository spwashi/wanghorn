import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {PropertyConfigurationAttribute} from "../attribute/index";
import PropertyConfigurationDatatypesAttribute from "../attribute/datatypes";
import {ConfigurationTitle} from "../../../../../../components/configuration/configuration";

export default class PropertyConfiguration extends Component {
    PropertyAttribute({name, value}) {
        switch (name) {
            case 'no, this should not be a static method.':
                return this;
            case 'datatypes':
                return <PropertyConfigurationDatatypesAttribute datatypes={value} />;
            default:
                return <PropertyConfigurationAttribute attribute={name} value={value} />;
        }
    };
    
    render() {
        const name   = this.props.name;
        const config = (this.props.config);
        
        const {smID, datatypes, ...otherConfig} = config;
        const className                         = "property--configuration " + (this.props.className ? this.props.className : '');
        const PropertyAttribute                 = this.PropertyAttribute;
        return (
            <div className={className}>
                <ConfigurationTitle ownerType={'property'}>{name}</ConfigurationTitle>
                <div className="property--configuration--attribute--container">
                    {
                        Object.entries({smID, name, datatypes, ...otherConfig})
                              .map(([attr, value]) => <PropertyAttribute key={attr} name={attr} value={value} />)
                    }
                </div>
            </div>
        )
    }
}
PropertyConfiguration.propTypes = {
    config:    PropTypes.shape({smID: PropTypes.string, datatypes: PropTypes.arrayOf(PropTypes.string), length: PropTypes.number}).isRequired,
    name:      PropTypes.string.isRequired,
    className: PropTypes.string.isRequired
};