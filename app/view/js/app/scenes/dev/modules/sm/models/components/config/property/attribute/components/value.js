import React from "react"
import * as PropTypes from "prop-types"
import AttrValue from "../../../../../../../../components/configuration/attribute/value";

export class PropertyConfigurationAttributeValue extends React.Component {
    render() {
        const {value, attribute, children} = this.props;
        let className                      = `attribute--value
                 configuration--attribute--value
                 property--configuration--attribute--value
                 attribute__${value}--value`;
        return (
            <div className={className}>
                {
                    typeof value === "undefined" ? (children || <div className="empty" />)
                                                 : <AttrValue attr={attribute} value={value} />
                }
            </div>
        );
    }
}

PropertyConfigurationAttributeValue.propTypes = {
    value:     PropTypes.any,
    children:  PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.element]),
    attribute: PropTypes.string
};