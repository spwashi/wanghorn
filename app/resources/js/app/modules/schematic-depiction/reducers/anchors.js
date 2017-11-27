import * as utility from '../../../utility';
import * as schematicDepictionActionTypes from '../actionTypes'

const generateAnchorID = () => utility.randomString(7);

const getConcept = (state, anchorID) => state[anchorID] || null;

const initConcept = ({anchorID, state}) => {
    const concept = getConcept(state, anchorID) || {id: anchorID};
    
    return concept;
};

export default (state, action) => {
    let concept;
    switch (action.type) {
        case schematicDepictionActionTypes.INIT_ANCHOR:
            const anchorID = generateAnchorID();
            concept        = initConcept({anchorID, state});
            state          = {...state, [anchorID]: concept};
            break;
        case schematicDepictionActionTypes.SET_ANCHOR_LABEL:
            concept     = getConcept(state, action.anchorID);
            const label = action.label;
            console.log(concept);
            break;
        default:
            state = {};
            break;
    }
    
    return state;
}