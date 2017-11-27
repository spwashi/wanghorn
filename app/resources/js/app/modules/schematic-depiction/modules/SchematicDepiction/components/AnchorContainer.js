import React from 'react'
import PropTypes from 'prop-types';
import {Anchor} from "../../../components/Anchor/index";

export const AnchorContainer = ({conceptIDs}) => {
    let createAnchor = ID => <Anchor anchorID={ID} key={ID} />;
    console.log(conceptIDs);
    return (
        <div className="anchor--container">
            {conceptIDs.map(ID => createAnchor(ID))}
        </div>
    )
};

AnchorContainer.propTypes = {
    concepts: PropTypes.object
};