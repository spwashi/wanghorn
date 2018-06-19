import React           from "react";
import moment          from "moment";
import {DatetimeField} from "../../../../configuration/sm/modify/fields/datetime";
import {DatetimeInput} from "../../../../configuration/sm/modify/fields/datetime/input";
export class EventModalBodyActive extends React.Component {
	render() {
		const event = this.props.event;
		if (!event) return 'loading...';
		return (
			<div className="event__detail-view">
				<div className="event--detail--container">
					<div className="event--detail--wrapper start_dt--wrapper">
						<div className="event--detail start event--detail__start start_dt">
							<DatetimeInput value={moment(event.start)}
							               required={true}
							               onChange={() => {alert("Sorry! Can't update these values yet.")}}
							               defaultValue={moment(event.start)}/>
						</div>
					</div>
					<div className="event--detail--wrapper end_dt--wrapper">
						<div className="event--detail end event--detail__end end_dt">
							<DatetimeInput value={moment(event.end)}
							               required={true}
							               onChange={() => {alert("Sorry! Can't update these values yet.")}}
							               defaultValue={moment(event.end)}/>
						</div>
					</div>
				</div>
				<div className="description--wrapper">
					<div className="description" dangerouslySetInnerHTML={{__html: event.description}}/>
				</div>
			</div>
		);
	}
}