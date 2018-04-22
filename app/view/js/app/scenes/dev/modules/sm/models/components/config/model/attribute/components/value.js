import React from "react"
import * as PropTypes from "prop-types"
import AttrValue from "../../../attribute/value";

export const ModelConfigurationAttributeValue = ({value, attribute, children}) =>
    <div className={`attribute--value configuration--attribute--value model--configuration--attribute--value`}>
        {
            typeof value === "undefined" ? (children || <div className="empty" />)
                                         : <AttrValue attr={attribute} value={value} />
        }
    </div>;
ModelConfigurationAttributeValue.propTypes    = {
    value:     PropTypes.any,
    attribute: PropTypes.string
};