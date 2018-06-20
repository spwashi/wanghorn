import React                          from "react"
import * as PropTypes                 from "prop-types"
import moment                         from 'moment';
import axios                          from 'axios';
import Modal, {navigateBackOnHistory} from "../../components/modal";
import {Route, Switch}                from "react-router-dom"
import {withRouter}                   from "react-router"
import {connect}                      from "react-redux"
import {PageContent}                  from "../../components/page";
import {getReactPath, getURI}         from "../../../path/resolution";
import Calendar                       from "./components/calendar";
import bind                           from "bind-decorator/index";
import {LinkItem}                     from "../../../components/navigation";
import ModificationRoute              from "../sm/components/modification/components/route";
import {DatetimeField}                from "../../configuration/sm/modify/fields/datetime";
import {EventModalBodyActive}         from "./components/modal/body";
import {selectInstancesOfSmID}        from "../sm/selector";
import {fetchEntities}                from "../sm/modules/entities/actions/actions";
import {bindActionCreators}           from "redux";


const EVENT_SM_ID = '[Entity]event';
class EventsPage extends React.Component {
	static contextTypes = {router: PropTypes.object.isRequired};
	       state        = {events: []};

	// lifecycle
	constructor(props) {
		super(props);
		let events = Object.values(props.events || []);
		this.state = {events}
	}
	componentDidMount() {
		this.props.fetchEntities({smID: EVENT_SM_ID});
	}
	componentWillReceiveProps(props) {
		this.setState({events: Object.values(props.events || [])})
	}


	// rendering
	render() {
		const calendar          = this.renderCalendar();
		const viewRoute         = this.renderViewRoute();
		const modificationRoute = this.renderModificationRoute();
		const createButton      = <LinkItem to={getURI('event--create')} className={'button event-add--wrapper'}>Create Event</LinkItem>;
		return (
			<PageContent pageTitle="Events" pageClass="page--__--events">
				{createButton}{calendar}{viewRoute}{modificationRoute}
			</PageContent>
		);
	}
	renderModificationRoute() {
		const closingUri      = getURI('event--home');
		const smID            = EVENT_SM_ID;
		const resolveSmEntity = ({id}) => this.findEvent(id);
		return [
			<ModificationRoute key={'edit'}
			                   isEdit={true}
			                   resolveSmEntity={resolveSmEntity}
			                   smEntityIdentifier={EVENT_SM_ID}
			                   formTitle={'Edit Event'}
			                   closingUri={closingUri}/>,
			<ModificationRoute key={'create'}
			                   smEntityIdentifier={EVENT_SM_ID}
			                   formTitle={'Create New Event'}
			                   closingUri={closingUri}/>
		];
	}
	renderViewRoute() {
		const path      = getReactPath('event--item__view');
		const component =
			      props => {
				      const {match}    = props;
				      const name       = (match.params || {}).name;
				      const event      = this.findEvent(name);
				      const body       = <EventModalBodyActive event={event}/>;
				      const properties = event.properties;
				      return <Modal isOpen={true}
				                    contentLabel={name}
				                    editUri={getURI('event--edit', {id: properties.event_name || properties.id})}
				                    onRequestEdit={this.onRequestEdit}
				                    onRequestClose={this.onRequestClose}
				                    title={event ? properties.title : 'Loading...'}
				                    children={body}/>;
			      };
		return <Route path={path} component={component}/>;
	}
	renderCalendar() {
		return <Calendar defaultView="month"
		                 defaultDate={new Date}
		                 events={this.state.events.map(this.convertToEvent)}
		                 onSelectEvent={this.onSelectEvent}/>;
	}


	// helpers
	onSelectEvent  = event => {
		const {id, title, event_name: name, start, end} = event;
		const identifier                                = `${(name && name.length && name) || id}`;
		this.props.history && this.props.history.push(getURI('event--item__view', {name: '' + identifier}));
	};
	convertToEvent = event => {
		const {id, title, event_name, description, start_dt, end_dt} = event.properties;

		const start = new Date(start_dt);
		const end   = new Date(end_dt);

		return {
			id,
			event_name,
			title, description,
			start, end
		};
	};
	onRequestClose = no_op => {
		const uri     = getURI('event--home');
		const history = this.props.history;
		return navigateBackOnHistory(history, uri);
	};
	findEvent      = name => {
		const matchesID   = event => parseInt(event.properties.id) === parseInt(name);
		const matchesName = event => (event.properties.event_name === name);
		return this.state.events.find(event => name && (matchesID(event) || matchesName(event)));
	};
}

function mapState(state) {return {events: selectInstancesOfSmID(state, {smID: EVENT_SM_ID})}}
function mapDispatch(dispatch) {return bindActionCreators({fetchEntities}, dispatch)}

let connectOnEventsPage = connect(mapState, mapDispatch);
export default withRouter(connectOnEventsPage(EventsPage))