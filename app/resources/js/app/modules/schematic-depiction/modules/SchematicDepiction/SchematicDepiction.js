import React from "react"
import {AnchorContainer} from "./components/AnchorContainer";

export const SchematicDepiction = ({anchors, onCreateConceptClick = null}) => {
    const conceptIDs = Object.entries(anchors)
                             .map(([_conceptID, _concept]) => _concept.id);
    
    return (
        <div id="schematic-depiction">
            <div className="schematic-depiction--control">
                <button onClick={onCreateConceptClick}>Add Concept</button>
            </div>
            <AnchorContainer conceptIDs={conceptIDs} />
        </div>
    );
};