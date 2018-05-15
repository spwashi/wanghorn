import React from "react"
import * as PropTypes from "prop-types"
import moment from 'moment';
import Modal from "../../components/modal";
import {Route} from "react-router-dom"
import {withRouter} from "react-router"
import {PageContent} from "../../components/page";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {getURI} from "../../../path/resolution";
import Calendar from "./components/calendar";

class EventsPage extends React.Component {
    static contextTypes = {router: PropTypes.object.isRequired};
           state        = {
               events: [
                   {
                       start: new Date(),
                       end:   new Date(moment().add(1, "days")),
                       title: "Example Event"
                   }
               ]
           };
    
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
    
    render() {
        let itemModalURI = getURI('events--item__view', null, {skipEmpty: true, asReactRoute: true});
        
        return (
            <PageContent pageTitle="Events" pageClass=".page--__--events">
                <Calendar defaultDate={new Date()}
                          defaultView="month"
                          onEventDrop={this.onEventDrop}
                          onEventResize={this.onEventResize}
                          events={this.state.events} />
                <Route path={itemModalURI}
                       component={({match}) => {
                           const {params} = match;
                           return (
                               <Modal isOpen={true} contentLabel={name} onRequestClose={this.context.router.history.goBack} title={'HELLO'}>
                                   HELLO!!!!!
                               </Modal>)
                       }} />
            </PageContent>
        );
    }
}

const mapState        = state => ({});
const mapDispatch     = dispatch => bindActionCreators({}, dispatch);
const connectOnEvents = connect(mapState, mapDispatch);
export default withRouter(connectOnEvents(EventsPage))