import {PERSIST_SM_ENTITY, PERSIST_SM_ENTITY_COMPLETED} from "../../actions/types";
import {getSmEntityManagerFormats, parseSmID}           from "../../utility";
import {reduceEntriesIntoObject}                        from "../../../../../utility";
import ValueRepresentation                              from "../../components/modification/components/field/internal/valueRepresentationProxy";
import {getReactPath}                                   from "../../../../../path/resolution";
import axios                                            from "axios/index";
import {persistSmEntity__completed}                     from "../../actions";
import {ENTITY_INSTANCE_RESOLVED}                       from "../../modules/entities/actions/types";
import {declareEntityResolved}                          from "../../modules/entities/actions/actions";
export default [persistSmEntityMiddleware];

const getPersistenceUriName =
	      ({smID, intent}) => {
		      const managerFormats      = getSmEntityManagerFormats(smID);
		      const ownerType_lowercase = managerFormats.lowercase;
		      const name                = parseSmID(smID).name;
		      const fallbackReceiveName = `${ownerType_lowercase}--${intent}--receive`;
		      return {
			      uri:      `${ownerType_lowercase}--${name}--${intent}--receive`,
			      fallback: fallbackReceiveName
		      }
	      };
function normalizeResponse(data) {
	const status = data.success || (data.status === true) ? 'success' : 'error';
	let txt, message;
	if (status === 'error') {
		txt = {message: 'Error Processing Request', success: false};
	} else {
		txt = data && data.message && data.message._message;
	}
	if (typeof data.message === 'object') {
		message = data.message;
	} else {
		message = typeof data.message === 'string' ? {_message: data.message} : {_message: txt};
	}
	return {status, message};
}
function resolveSmEntityFromData({status, message = {}} = {}, sentSmEntity) {
	if (typeof message === "object") {
		let properties                = sentSmEntity.properties || {};
		let addEntryMessageToSmEntity = entry => {
			const [propertyName, propertyMessage] = entry;
			const smEntityProperty                = properties[propertyName] || {};

			if (!propertyMessage.message) return;

			Object.assign(smEntityProperty.message || {}, propertyMessage.message);
		};
		Object.entries(message).forEach(addEntryMessageToSmEntity);
	}

	return {...sentSmEntity, message};
}
function normalizeSmEntityProperties(post) {
	post.properties && Object.entries(post.properties || {})
	                         .forEach(entry => {
		                         const [name, property] = entry;
		                         post.properties[name]  = property instanceof ValueRepresentation ? property.value
		                                                                                          : property;
	                         });
}
function getSmEntityToPost(smEntity) {
	const sentSmEntity = {};

	Object.entries(smEntity)
	      .filter(([name]) => name[0] !== '_')
	      .map(([name, value]) => [name, value])
	      .reduce(reduceEntriesIntoObject, sentSmEntity);
	normalizeSmEntityProperties(sentSmEntity);
	return sentSmEntity;
}
function persistSmEntityMiddleware({dispatch, getState}) {
	return next => action => {
		next(action);
		const {_id, smEntity} = action;
		const {smID}          = smEntity ? smEntity : {};

		switch (action.type) {
			case PERSIST_SM_ENTITY:
				if (!smEntity) console.error("Incomplete SmEntity");
				const sentSmEntity             = getSmEntityToPost(smEntity);
				const {uri: uriName, fallback} = getPersistenceUriName({smID, intent: 'create'});
				const url                      = getReactPath(uriName, null, {fallback}) + '?d_lm=q';

				axios.post(url, sentSmEntity)
				     .then(response => {
					     const data            = normalizeResponse(response.data);
					     let {message, status} = data;
					     let smEntity          = resolveSmEntityFromData(data, sentSmEntity);
					     dispatch(persistSmEntity__completed({smEntity, _id, message, status}))
				     });

				break;
			case PERSIST_SM_ENTITY_COMPLETED:
				let dispatchEntityResolved = declareEntityResolved({smEntity, _id});
				dispatch(dispatchEntityResolved);
				break;
		}
	}
}