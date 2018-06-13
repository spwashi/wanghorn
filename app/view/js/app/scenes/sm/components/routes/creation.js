import React                                          from "react";
import PropTypes                                      from "prop-types";
import {Route, withRouter}                            from 'react-router-dom'
import {getReactPath, getURI}                         from "../../../../../path/resolution";
import {SmEntityModificationDialog}                   from "../modification/components/dialog";
import {getSmEntityManagerFormats, parseSmID, isSmID} from "./../../utility";
import {selectSmState, fromSm_selectSchematicOfSmID}  from "../../selector";
import {connect}                                      from "react-redux";

@connect(mapState)
class CreationRoute extends React.Component {
	static propTypes = {
		sm:                 PropTypes.object,
		// A string that can identify this smEntity
		smEntityIdentifier: PropTypes.string.isRequired,
		// Where to go when we close this modification/page
		closingUri:         PropTypes.string,
	};
	render() {
		let smID, name;

		let {smEntityIdentifier, closingUri} = this.props;
		const formTitle                      = this.props.title;
		const sm                             = this.props.sm;

		const managerFormats        = getSmEntityManagerFormats(smEntityIdentifier);
		const ownerType_lowercase   = managerFormats.lowercase;
		const managerName           = managerFormats.managerName;
		const fallbackReceiveName   = `${ownerType_lowercase}--create--receive`;
		const getFormReceiveUriName = name => `${ownerType_lowercase}--${name}--create--receive`;

		if (isSmID(smEntityIdentifier)) {
			const parsed = parseSmID(smEntityIdentifier);
			name         = parsed.name;
			smID         = smEntityIdentifier;
		}

		const SmEntityCreationDialog =
			      ({history, match, name, smID, sm}) => {
				      if (!smID) name = match.params.name;
				      smID            = smID || `${managerName}${name}`;

				      const schematic = fromSm_selectSchematicOfSmID(sm, {smID});
				      if (!schematic) return ' ...loading';
				      const navigateUri = getURI(getFormReceiveUriName(name), {name}, {fallback: fallbackReceiveName});
				      return <SmEntityModificationDialog smID={smID}
				                                         title={formTitle}
				                                         closingUri={closingUri || getURI('dev--model', {name})}
				                                         formUrl={navigateUri}
				                                         schematic={schematic}
				                                         history={history}/>;
			      };
		const fallbackReactPathName  = `${ownerType_lowercase}--create`;
		const reactPathName          = name ? `${name}--create` : fallbackReactPathName;
		const reactPath              = getReactPath(reactPathName, null, {fallback: fallbackReactPathName});
		const component              = props => <SmEntityCreationDialog {...props} {...{sm, name, smID}}/>;
		return <Route path={reactPath} component={component}/>;

	}
}


export default withRouter(CreationRoute);

function mapState(state) {
	const sm = selectSmState(state);
	return {sm};
}