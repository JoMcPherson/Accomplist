import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react"

export default function EventDetailDisplay(event_id) {

    const { token } = useAuthContext();
    event_id = useParams();
    const [eventDetailData, setEventDetail] = useState();

    useEffect(() => {
        async function getDatEventDetailData() {
            let dataUrl = `${process.env.REACT_APP_API_HOST}/events/${event_id.event_id}`;
            console.log(dataUrl)
            let fetchConfig = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`,},
                };
            let fetchedFromUrl = await fetch(dataUrl, fetchConfig)

            if (fetchedFromUrl.ok) {
                console.log ("fetch ok. event id:", event_id)
                let jsonifiedFetchedStuff = await fetchedFromUrl.json()
                if (jsonifiedFetchedStuff) {
                setEventDetail(jsonifiedFetchedStuff)
                console.log ("eventdetail is set")
                console.log("eventDetailData:", eventDetailData)}
            } else {
                console.log ("fetch didn't work")
            }}
            getDatEventDetailData()

            }, [event_id, token, eventDetailData]);


    return(
        <div>

            Your main event!

            <div>
            <h2>{eventDetailData.name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Location
                        </th>
                        <th>
                            Cost
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={eventDetailData.id} >
                        <td>{eventDetailData.id}</td>
                        <td>{eventDetailData.name}</td>
                        <td>{eventDetailData.location}</td>
                        <td>{eventDetailData.cost}</td>
                    </tr>
                </tbody>
            </table>
        </div>


        </div>
    )
    }
