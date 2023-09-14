import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState } from "react";

const locales = {
"en-US": require("date-fns/locale/en-US")
}
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

// const eventExamples = [{
//     title: "Big Meeting",
//     start: new Date(2023, 8, 6),
//     end: new Date(2023, 8, 10)
// },
// {
//     title: "Vacation",
//     start: new Date(2023, 8, 20),
//     end: new Date(2023, 8, 23)
// }
// ]
export default function Calendeesi( {events} ) {

    const [selected, setSelected] = useState();
    const handleSelected = (event) => {
        setSelected(event);
        console.log('[handleSelected - event]', event);
        window.location.href = `${process.env.PUBLIC_URL}/events/${event.eventID}`
        };


    const convertedEvents = events.map((event)=>{
        var datdate = new Date(event.date)
        datdate.setDate(datdate.getDate() + 0);


        return({
        title: event.name,
        end: datdate,
        start: event.date,
        eventID: event.event_id
    })}
    )

    return(
    <div className="main-calendar-container">
        Calendar here
        <Calendar selected={selected}
        onSelectEvent={handleSelected} localizer={localizer} events={convertedEvents}
        startAccesor="start" endAccessor="end" style={{height: 500, margin: "50px"}} />

    </div>
)}
