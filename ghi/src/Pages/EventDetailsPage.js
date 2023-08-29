import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react"

export default function EventDetailDisplay(event_id) {

    const { token } = useAuthContext();
    event_id = useParams();
    const [eventDetailData, setEventDetail] = useState([]);
    const navigate = useNavigate();
    const getDatEventDetailData1 = useCallback(async function getDatEventDetailData() {
        if (token){
            let dataUrl = `${process.env.REACT_APP_API_HOST}/events/${event_id.event_id}`;
            let fetchConfig = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`,},
                };
            let fetchedFromUrl = await fetch(dataUrl, fetchConfig)
            if(fetchedFromUrl.ok) {
                let jsonifiedFetchedStuff = await fetchedFromUrl.json()
                setEventDetail(jsonifiedFetchedStuff)
            }
            else {
                console.log ("fetch didn't work")
            }
            }},
            [token, event_id]);

    useEffect(() => {
             getDatEventDetailData1()
            },
            [token, getDatEventDetailData1]);

    async function deleteEvent(id){
        const deleteUrl = `${process.env.REACT_APP_API_HOST}/events/${id}`;
        const fetchConfig = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,},
            };
        const fetchedResponse = await fetch(deleteUrl, fetchConfig)
        if(fetchedResponse.ok) {
            navigate('/events')
        }
            }


    return(
        <div>
            Your main event!
            <div>
            <h2>{eventDetailData.name}</h2><h5><button onClick={()=>{navigate(`/events`)}}>back to list</button></h5>
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
                        <td><button onClick={()=>deleteEvent(eventDetailData.id)}>Delete this event</button></td>
                        <td><button onClick={()=>{navigate(`/events/edit/${eventDetailData.id}`)}}>Edit</button></td>
                    </tr>
                </tbody>
            </table>
        </div>


        </div>
    )
    }
