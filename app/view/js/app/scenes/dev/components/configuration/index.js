import React from "react"
import * as PropTypes from "prop-types"
import AttrValue from "./attribute/value";

export const ConfigurationAttributeTitle = ({attribute, ownerType}) => {
    return <div className={`attribute--title
                            configuration--attribute--title
                            ${ownerType}--configuration--attribute--title
                            attribute__${attribute}--title`}>{attribute}</div>
};
export const ConfigurationAttributeValue = ({value, attribute, children, ownerType}) => {
    return (
        <div className={`attribute--value configuration--attribute--value ${ownerType}--configuration--attribute--value`}>
            {
                typeof value === "undefined" ? (children || <div className="empty" />)
                                             : <AttrValue attr={attribute} value={value} />
            }
        </div>
    );
};
export const ConfigurationAttribute      = ({value, attribute, valueMeta, children, ownerType}) => {
    return (
        <div className={`attribute configuration--attribute ${ownerType}--configuration--attribute ${attribute} attribute__${attribute}`}>
            <ConfigurationAttributeTitle attribute={attribute} ownerType={ownerType} />
            <ConfigurationAttributeValue attribute={attribute} value={value} ownerType={ownerType}>
                <div className={`configuration--value--meta ${ownerType}--configuration--value--meta`}>
                    {valueMeta}
                </div>
                {children}
            </ConfigurationAttributeValue>
        </div>
    );
};
ConfigurationAttributeTitle.propTypes    = {
    attribute: PropTypes.string,
    ownerType: PropTypes.string
};
ConfigurationAttributeValue.propTypes    = {
    attribute: PropTypes.string,
    ownerType: PropTypes.string,
    value:     PropTypes.any,
    valueMeta: PropTypes.element,
    children:  PropTypes.any
};
ConfigurationAttribute.propTypes         = {
    attribute: PropTypes.string,
    ownerType: PropTypes.string,
    value:     PropTypes.any,
    children:  PropTypes.any
};