import React from "react"
import {parseSmID} from "spwashi-sm/src/components/sm/utility";
import {getURI} from "../../../../../../path/resolution";
import {SmID_Link} from "../../../../sm/components/link";

export const ConfigurationSmID_OrName = ({smID, isActive}) => {
    const parsed  = parseSmID(smID);
    const manager = (parsed.manager || '').toLowerCase();
    const owner   = parsed.owner;
    let link;
    if (manager === 'model' || manager === 'entity') {
        link = getURI(`dev--${manager}`, {name: parsed.name});
    } else if (manager === 'property' && owner) {
        let parsedOwner                              = parseSmID(owner);
        let {name: ownerName, manager: ownerManager} = parsedOwner;
        const uri                                    = `dev--${ownerManager.toLowerCase()}--property`;
        link                                         = getURI(uri, {owner: ownerName, property: parsed.name});
    } else {
        return smID;
    }
    return <SmID_Link smID={smID} to={link} isActive={isActive} maintainHash={true}>{smID}</SmID_Link>
};