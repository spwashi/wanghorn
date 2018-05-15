import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
export default withDragAndDrop(BigCalendar);