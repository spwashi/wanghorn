import {ENTITY_INSTANCE_RESOLVED, FETCH_ENTITY_INSTANCES_RECEIVED} from "../actions/types";
import {reduceEntriesIntoObject}                                   from "../../../../../../utility";

type entityInstance = {
	smID: string,
	properties: {},
};
const instanceReducer = (instance: entityInstance, action) => {
	let {type} = action;
	switch (type) {
		case ENTITY_INSTANCE_RESOLVED:
			return {...instance, _lastResolved: Date.now()};
		default:
			return instance || {};
	}
};
const instances       = (state, action) => {
	const {type} = action;
	const entity = action.smEntity;
	let smID     = entity && entity.smID;

	switch (type) {
		case FETCH_ENTITY_INSTANCES_RECEIVED:
			let fetched_entities = Object.entries(action.entities)
			                             .map(([smID, entity]) => [smID, instanceReducer(entity, action)])
			                             .reduce(reduceEntriesIntoObject, {});
			return {...state, ...fetched_entities};
		case ENTITY_INSTANCE_RESOLVED:
			let _id     = action._id;
			state[smID] = state.smID || {};
			state[smID] = {...state[smID], [_id]: instanceReducer(entity, action)};
			return state;
			break;
		default:
			return state || {};
	}
};
export default instances;