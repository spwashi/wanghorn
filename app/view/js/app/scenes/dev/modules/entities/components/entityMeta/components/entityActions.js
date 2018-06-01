import React from "react"
import * as PropTypes from "prop-types"
import {LinkItem} from "../../../../../../../../components/navigation";

export const EntityActions = function ({createEntityURI}) {
    let createEntityButton = (
        <div className="smEntity--meta--action--wrapper">
            <LinkItem to={createEntityURI}
                      className={'button'}
                      isButton={true}>Create New Entity</LinkItem>
        </div>
    );
    return <div className="smEntity--meta--action--container">{createEntityButton}</div>;
};
EntityActions.propTypes    = {
    createEntityURI: PropTypes.string,
};