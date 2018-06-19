import axios                                  from "axios";
import {selectSmContexts, selectSmSchematics} from "../../selector";
import {normalizeSmID, parseSmID}             from "../../utility";
import {fetchSmEntitySchematic__received}     from "../../actions/index";
import {fetchEntityMetasCompleted}            from "../../modules/entities/actions/actions";
import {fetchModelMetasCompleted}             from "../../modules/models/actions";
import {getURI}                               from "../../../../../path/resolution";
import {
	requestEntities,
	requestModels,
	requestSmEntities
}                                             from "./helpers";
import {
	FETCH_SM_ENTITIES,
	FETCH_SM_ENTITY_SCHEMATIC,
	FETCH_SM_ENTITY_SCHEMATIC_RECEIVED
}                                             from '../../actions/types';
import {
	FETCH_ENTITY_INSTANCES,
	FETCH_ENTITY_METAS
}                                             from "../../modules/entities/actions/types";
import {
	FETCH_MODEL_METAS,
	FETCH_MODELS
}                                             from "../../modules/models/actions/types"

export default [fetchSmEntitySchematicMiddleware, fetchSmEntitiesMiddleware];

const getSmID = function (originalSchematic) {
	let smEntity = originalSchematic;
	let smID;

	if (typeof  smEntity === 'object') smEntity = smEntity.smID;
	else if (typeof smEntity) smID = smEntity;

	if (typeof smID !== 'string') {
		throw new Error('Cannot resolve from ', smEntity, originalSchematic);
	}
	return smID;
};

function fetchSmEntitySchematicMiddleware(store) {
	return next => action => {
		next(action);

		const state = store.getState();

		switch (action.type) {
			case FETCH_MODEL_METAS:
				axios.get(getURI("dev--models__json")).then(response => store.dispatch(fetchModelMetasCompleted(response && response.data && response.data)));
				return;
			case FETCH_ENTITY_METAS:
				axios.get(getURI("dev--entities__json")).then(response => store.dispatch(fetchEntityMetasCompleted(response && response.data && response.data)));
				return;
			case FETCH_SM_ENTITY_SCHEMATIC:
				store.dispatch(fetchSmEntitySchematic__received());
				break;
			case FETCH_SM_ENTITY_SCHEMATIC_RECEIVED:
				let {contextName, smID}   = action;
				smID                      = getSmID(smID || action.schematic);
				const schematics          = selectSmSchematics(state);
				const contexts            = selectSmContexts(state);
				const {entities, models,} = schematics;

				const context = contextName && contexts[contextName] && contexts[contextName].schematics || {};
				let schematic = context[smID] || null;

				switch (parseSmID(smID).manager) {
					case 'Model':
						schematic = models[smID] || models[normalizeSmID(smID)];
						break;
					case 'Entity':
						schematic = entities[smID] || entities[normalizeSmID(smID)];
						break;
				}

				return schematic ? schematic : null;
		}
	};
}
function fetchSmEntitiesMiddleware(store) {
	return next => action => {
		next(action);

		const state    = store.getState();
		const dispatch = store.dispatch;

		switch (action.type) {
			case FETCH_MODELS:
				requestModels(action, {state, dispatch});
				break;
			case FETCH_ENTITY_INSTANCES:
				requestEntities(action, {state, dispatch});
				break;

			case FETCH_SM_ENTITIES:
				requestSmEntities(action, {state, dispatch});
				break;
		}
	};
}

