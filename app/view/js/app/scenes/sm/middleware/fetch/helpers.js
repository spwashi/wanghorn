import axios                                   from "axios";
import {fetchModels, fetchModelsCompleted}     from "../../modules/models/actions";
import {fetchEntities, fetchEntitiesCompleted} from "../../modules/entities/actions/actions";
import {parseSmID}                             from "../../utility";
import {getURI}                                from "../../../../../path/resolution";
export const requestSmEntities = ({smID}, {state, dispatch}) => {
	let manager = parseSmID(smID).manager;

	if (typeof smID !== 'string') throw new Error("Can only find from smID");

	switch (manager) {
		case 'Model':
			dispatch(fetchModels({smID}));
			break;
		case 'Entity':
			dispatch(fetchEntities({smID}));
			break;
	}
};
export const requestModels     = ({smID}, {state, dispatch}) => {
	const dispatchModelsReceived = response => {
		const models = response && response.data;
		dispatch(fetchModelsCompleted({models, smID}));
	};
	let {manager, name}          = parseSmID(smID);

	if (!manager === 'Model') {
		throw new Error("Can only fetch Models");
	}

	const uri = getURI('dev--all_models', {name});

	return axios.get(uri).then(response => dispatchModelsReceived(response));
};
export const requestEntities   =
	             ({smID}, {state, dispatch}) => {
		             const dispatchEntitiesReceived = entities => dispatch(fetchEntitiesCompleted({entities, smID}));
		             let {manager, name}            = parseSmID(smID);

		             if (!manager === 'Entity') {
			             throw new Error("Can only fetch Entities");
		             }

		             const uri = getURI(name + '--all', {name}, 'entity--fetch_all');

		             return axios.get(uri)
		                         .then(response => {
			                         const entityReceived = ((response && response.data) || []).map(entity => ({properties: entity}));
			                         dispatchEntitiesReceived(entityReceived)
		                         });
	             };