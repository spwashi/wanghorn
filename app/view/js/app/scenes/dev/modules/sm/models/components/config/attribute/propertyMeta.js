import React from "react"
import * as PropTypes from "prop-types"
import {ConfigurationAttribute} from "../../../../../../components/configuration/index";
import {PropertySmIDLink} from "../../../../components/propertyOwner/attribute/properties/smID_Link";

const NamedIndexList = ({indexList: index, onTrigger}) => {
    return (
        <ul>
            {(index || []).map((smID, k) => <li key={k}><PropertySmIDLink onTrigger={onTrigger} smID={smID} /></li>)}
        </ul>
    );
};
const UniqueIndex    = function ({uniqueIndex, onPropertyLinkTrigger}) {
    let ArrayIndex  = function () {
        return <NamedIndexList onPropertyLinkTrigger={onPropertyLinkTrigger} indexList={uniqueIndex} />;
    };
    let ObjectIndex = function () {
        return Object.entries(uniqueIndex)
                     .map(([name, index]) => {
                         return (
                             <div className="unique_index" key={name}>
                                 <div className="index--title title">{name}</div>
                                 <div className="index--value value">
                                     <NamedIndexList onPropertyLinkTrigger={onPropertyLinkTrigger}
                                                     indexList={index} />
                                 </div>
                             </div>
                         )
                     });
    };
    return <div className="propertyMeta--index unique">
        <div className="title">Unique Keys</div>
        <div className="value">
            {
                Array.isArray(uniqueIndex) ? <ArrayIndex />
                                           : <ObjectIndex />
            }
        </div>
    </div>;
};
const PrimaryIndex   = function ({primaryIndex, onPropertyLinkTrigger}) {
    return <div className="propertyMeta--index primary">
        <div className="title">Primary Key</div>
        <div className="value">
            <NamedIndexList onPropertyLinkTrigger={onPropertyLinkTrigger} indexList={primaryIndex} />
        </div>
    </div>;
};

const ModelConfigurationPropertyMetaAttribute     =
          ({propertyMeta, onPropertyLinkTrigger}) => {
              if (!propertyMeta) return null;
              let primaryIndex   = propertyMeta.primary;
              let uniqueIndex    = propertyMeta.unique;
              let hasUniqueIndex = Array.isArray(uniqueIndex) ? uniqueIndex.length
                                                              : Object.entries(uniqueIndex || {}).length;
              return (
                  <ConfigurationAttribute ownerType={'model'} attribute="propertyMeta">
                      {primaryIndex ? <PrimaryIndex {...{onPropertyLinkTrigger, primaryIndex}} /> : null}
                      {hasUniqueIndex ? <UniqueIndex {...{uniqueIndex, onPropertyLinkTrigger}} /> : null}
                  </ConfigurationAttribute>
              );
          };
ModelConfigurationPropertyMetaAttribute.propTypes = {
    propertyMeta: PropTypes.object
};
export default ModelConfigurationPropertyMetaAttribute;