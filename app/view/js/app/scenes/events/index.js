import React                          from "react"
import * as PropTypes                 from "prop-types"
import moment                         from 'moment';
import axios                          from 'axios';
import Modal, {navigateBackOnHistory} from "../../components/modal";
import {Route}                        from "react-router-dom"
import {withRouter}                   from "react-router"
import {PageContent}                  from "../../components/page";
import {getReactPath, getURI}         from "../../../path/resolution";
import Calendar                       from "./components/calendar";
import bind                           from "bind-decorator/index";
import {LinkItem}                     from "../../../components/navigation";
import CreationRoute                  from "../sm/components/routes/creation";


let allEvents = [];

function EventModalBodyActive({event} = {}) {
	if (!event) return 'loading...';
	return (
		<div className="event__detail-view">
			<div className="event--detail--container">
				<div className="event--detail--wrapper start_dt--wrapper">
					<div className="event--detail start event--detail__start start_dt">
						{moment(event.start).calendar()}
					</div>
				</div>
				<div className="event--detail--wrapper end_dt--wrapper">
					<div className="event--detail end event--detail__end end_dt">
						{moment(event.end).calendar()}
					</div>
				</div>
			</div>
			<div className="description--wrapper">
				<div className="description" dangerouslySetInnerHTML={{__html: event.description}}/>
			</div>
		</div>
	);
}
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
		this.fetchModels();
	}

	fetchModels() {
		axios.get(getURI('events--all'))
		     .then(response => {
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
					       let body    = <EventModalBodyActive event={event}/>;
					       return (
						       <Modal isOpen={true}
						              contentLabel={name}
						              onRequestClose={this.onRequestClose}
						              title={event ? event.title : 'Loading...'}
						              children={body}/>
					       );
				       }}/>
				<CreationRoute smEntityIdentifier={'[Entity]event'}
				               onSubmissionResponseReceived={data => {
					               console.log(data);
				               }}
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