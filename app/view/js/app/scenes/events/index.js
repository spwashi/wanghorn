import React                          from "react"
import * as PropTypes                 from "prop-types"
import moment                         from 'moment';
import axios                          from 'axios';
import Modal, {navigateBackOnHistory} from "../../components/modal";
import {Route}                        from "react-router-dom"
import {withRouter}                   from "react-router"
import {PageContent}                  from "../../components/page";
import {connect}                      from "react-redux";
import {bindActionCreators}           from 'redux';
import {getReactPath, getURI}         from "../../../path/resolution";
import Calendar                       from "./components/calendar";
import bind                           from "bind-decorator/index";
import Button                         from "base-components/button/index";
import {LinkItem}                     from "../../../components/navigation";
import {CreateSmEntityDialog}         from "../sm/components/form/components/creationDialog";
import CreationRoute                  from "../sm/components/routes/creation";


let eventNames = ['Example Event', 'This is a test', 'How do these look?', 'This should be connected to a database'];
let i          = 0;
let allEvents  = eventNames.map(title => {
	const rand1     = Math.floor(Math.random() * 10);
	const rand2     = Math.floor(Math.random() * 10);
	const startDate = moment().add(rand1, 'days');
	const endDate   = moment(startDate).add(rand2, 'days');
	return {
		id:          ++i,
		description: 'This is to show what it might look like',
		start:       new Date(startDate),
		end:         new Date(endDate),
		title
	}
});

class EventsPage extends React.Component {
	static contextTypes = {router: PropTypes.object.isRequired};
	       state        = {events: allEvents};

	onEventResize = (type, {event, start, end, allDay}) => {
		this.setState(state => {
			console.log(event);
			console.log(Array.indexOf(event));
			state.events[0].start = start;
			state.events[0].end   = end;
			return {events: state.events};
		});
	};
	onEventDrop   = ({event, start, end, allDay}) => {
		console.log(start, event.start);
	};
	componentDidMount() {
		axios.get(getURI('events--all')).then(response => {
			let events = response.data;
			if (!Array.isArray(events)) {
				console.error('Invalid return from events request -- ', events);
				return;
			}

			events = events.map(event => {
				const {id, title, description, start_dt, end_dt} = event;

				const start = new Date(start_dt);
				const end   = new Date(end_dt);

				return {
					id,
					title, description,
					start, end
				};
			});

			this.setState({events});
		});
	}

	render() {
		let onSelect = event => {
			const {id, title, start, end} = event;
			this.props.history && this.props.history.push(getURI('events--item__view', {id: '' + id}));
		};
		return (
			<PageContent pageTitle="Events" pageClass=".page--__--events">
				<Calendar defaultView="month" defaultDate={new Date} events={this.state.events} onSelectEvent={onSelect} onEventDrop={this.onEventDrop} onEventResize={this.onEventResize}/>
				<LinkItem to={getURI('event--create')} className={'button event-add--wrapper'}>
					Create Event
				</LinkItem>
				<Route path={getReactPath('events--item__view')}
				       component={({match}) => {
					       const id    = (match.params || {}).id;
					       const event = (this.state.events || []).find(event => id && (parseInt(event.id) === parseInt(id)));
					       return (
						       <Modal isOpen={true} contentLabel={name} onRequestClose={this.onRequestClose} title={event && event.title}>
							       <div className="description">{event.description}</div>
							       <div className="event-details">
								       <div className="start start_dt">
									       {moment(event.start).calendar()}
								       </div>
								       <div className="end end_dt">
									       {moment(event.end).calendar()}
								       </div>
							       </div>
						       </Modal>
					       );
				       }}/>
				<CreationRoute smEntityIdentifier={'[Entity]event'}
				               title={'Create New Event'}
				               closingUri={getURI('events--home')}/>
			</PageContent>
		);
	}
	@bind
	onRequestClose() {
		const uri     = getURI('events--home');
		const history = this.props.history;
		return navigateBackOnHistory(history, uri);
	}
}

export default withRouter(EventsPage)