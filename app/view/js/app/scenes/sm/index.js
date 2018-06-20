import React                                     from "react"
import {bindActionCreators}                      from 'redux'
import {connect}                                 from "react-redux";
import {Route, withRouter}                       from 'react-router-dom'
import * as PropTypes                            from "prop-types"
import {selectSmSchematics}                      from "./selector";
import {fetchModelMetas}                         from "./modules/models/actions/index";
import {fetchEntityMetas}                        from "./modules/entities/actions/actions";
import {fetchSmEntities, fetchSmEntitySchematic} from "./actions";
import ModificationRoute                         from "./components/modification/components/route";

@connect(mapState, mapDispatch)
class SmScene extends React.Component {
	static propTypes = {resolveSmEntities: PropTypes.func, resolveSmEntitySchematic: PropTypes.func};

	componentDidMount() {
		this.props.fetchModelMetas();
		this.props.fetchEntityMetas();
	}

	render() {
		const modelCreationRoute  = this.renderSmEntityCreationRoute('Model');
		const entityCreationRoute = this.renderSmEntityCreationRoute('Entity');
		return (
			<div>
				{modelCreationRoute}
				{entityCreationRoute}
			</div>
		);
	}

	renderSmEntityCreationRoute = (ownerType) => <ModificationRoute smEntityIdentifier={ownerType}/>;
}

SmScene = withRouter(SmScene);
export {SmScene};
function mapState(state) {
	const schematics = selectSmSchematics(state);
	return {schematics};
}
function mapDispatch(dispatch) {
	const actions = {
		fetchModelMetas,
		fetchEntityMetas,
		fetchSmEntities:        fetchSmEntities,
		fetchSmEntitySchematic: fetchSmEntitySchematic
	};
	return bindActionCreators(actions, dispatch);
}