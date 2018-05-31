import React from "react"
import SmEntityMeta from "./index";
import {getNameFromSmID, parseSmID} from "../../../dev/modules/sm/utility";
import {getURI} from "../../../../../path/resolution";
import {LinkItem} from "../../../../../components/navigation/index";
import {ConfigurationDescription, ConfigurationTitle} from "../../../dev/components/configuration/configuration";
import {ConfigurationAttribute} from "../../../dev/components/configuration/index";

const actions                    = {
    createSmEntity: {url: ({smID}, schematic) => getURI('dev--create_model', {name: getNameFromSmID(smID)})},
    createTable:    () => { executeModelQuery({smID, query: 'CREATE_TABLE'})}
};
let SmEntityConfigurationDisplay = function ({ownerType, title, description, schematic}) {
    return <div className={`wrapper smEntity--configuration--wrapper`}>
        <div className="smEntity--configuration">
            <LinkItem to={`#`} isButton={true}>
                <ConfigurationTitle ownerType={ownerType}>{title}</ConfigurationTitle>
            </LinkItem>
        </div>
        <ConfigurationDescription ownerType={ownerType}>{description}</ConfigurationDescription>
        {
            Object.entries(schematic).map(([attributeName, value]) => {
                const is_null      = !value && typeof value === 'object';
                const is_undefined = typeof value === 'undefined';
                const is_empty     = value === '';
                if (is_null || is_undefined || is_empty) { return null }
                return <ConfigurationAttribute ownerType={ownerType}
                                               attribute={attributeName}
                                               value={value} />;
            })
        }
    </div>;
};

const s = ({smEntity, schematic}) => {
    const parsed               = parseSmID(schematic);
    const {manager: ownerType} = parsed || {};
    return (
        <SmEntityMeta actions={actions} status={{canCreateTable: true}}>
            <SmEntityConfigurationDisplay ownerType={ownerType}
                                          title={"Configuration"}
                                          description={"The Configuration for this SmEntity"}
                                          schematic={schematic} />
        </SmEntityMeta>
    );
};