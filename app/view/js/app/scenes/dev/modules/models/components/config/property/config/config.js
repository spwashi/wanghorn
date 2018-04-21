import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {PropertyConfigurationAttribute} from "../attribute/index";

export const PropertyConfigurationTitle =
                 ({children}) =>
                     <div className="configuration--title property--configuration--title">{children}</div>;
export default class PropertyConfiguration extends Component {
    render() {
        const name   = this.props.name;
        const config = (
            this.props.config: {
                smID: string,
                datatypes: ?[],
                length: ?number
            }
        );
        
        const {smID, datatypes, ...otherConfig} = config;
        const className                         = "property--configuration " + (this.props.className ? this.props.className : '');
        return (
            <div className={className}>
                <PropertyConfigurationTitle>{name}</PropertyConfigurationTitle>
                <div className="property--configuration--attribute--container">
                    {Object.entries({smID, datatypes, ...otherConfig})
                           .map(
                               ([attr, value]) => {
                                   return (
                                       <PropertyConfigurationAttribute key={attr}
                                                                       attribute={attr}
                                                                       value={value} />
                                   );
                               })
                    }
                </div>
            </div>
        )
    }
}
PropertyConfiguration.propTypes = {
    config:    PropTypes.object.isRequired,
    name:      PropTypes.string.isRequired,
    className: PropTypes.string.isRequired
};