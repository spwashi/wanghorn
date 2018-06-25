import {ENTITY_INSTANCE_RESOLVED, FETCH_ENTITY_INSTANCES_RECEIVED} from "../actions/types";

import {randomString} from "../../../../../../utility";

type entityInstance = {
	smID: string,
	properties: {},
};
const instanceReducer = (instance: entityInstance, action) => {
	let {type} = action;
	switch (type) {
		case FETCH_ENTITY_INSTANCES_RECEIVED:
			return {_id: randomString(6), ...instance, _lastResolved: Date.now()};
		case ENTITY_INSTANCE_RESOLVED:
			return {...instance, _lastResolved: Date.now()};
		default:
			return instance || {};
	}
};
const instances       = (state, action) => {
	const {type} = action;
	const entity = action.smEntity;
	let smID     = (entity && entity.smID) || action.smID;
	let _id;
	switch (type) {
		case FETCH_ENTITY_INSTANCES_RECEIVED:
			let entities    = action.entities;
			let allEntities = {};
			Object.values(entities)
			      .forEach(entity => {
				      let localSmID          = smID || entity.smID;
				      allEntities[localSmID] = allEntities[localSmID] || {};
				      if (entity && entity.properties && entity.properties.id) {
					      let pastEntity = Object.values(state[localSmID] || {})
					                             .find(pastEntity => pastEntity.properties.id === entity.properties.id)
					      _id            = pastEntity._id;
					      pastEntity && Object.assign(entity, {_id});
				      }
				      const newEntity             = instanceReducer(entity, action);
				      _id                         = newEntity._id;
				      allEntities[localSmID][_id] = newEntity;
			      });
			return {...state, ...allEntities};
		case ENTITY_INSTANCE_RESOLVED:
			_id         = action._id;
			state[smID] = state[smID] || {};
			console.log(entity.properties);
			state[smID] = {...state[smID], [_id]: instanceReducer(entity, action)};
			return {...state};
			break;
		default:
			return state || {};
	}
};
export default instances;