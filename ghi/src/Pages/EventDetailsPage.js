import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react"
import { Container, Button, Table } from "react-bootstrap";

export default function EventDetailDisplay(event_id) {
    const customBackgroundStyle = {
        backgroundImage: `url(https://i.imgur.com/WFCPRp8.jpeg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        minHeight: '100vh',
    };

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
            console.log(eventDetailData)


return(
    <>
    <div style={customBackgroundStyle}>
    <div style={{ paddingTop: '200px' }}>
    <Container >
        <div className="overflow-x-auto">
        <div className='event-detail-header'>
        <h1 className="event-whitey-shadow">Your main event!</h1>
        </div>
        <div>
        <div className='eventdetail-header2'>
        <h2 className="event-whitey-shadow">{eventDetailData.name}</h2>
        </div>
        <h5 style={{'marginBottom': 20}}><Button className="btn btn-sm custom-button" onClick={()=>{navigate(`/events`)}}>back to list</Button></h5>
            <Table striped bordered hover variant="dark">
            <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
                <th>
                    ID
                </th>
                <th>
                    Name
                </th>
                <th>Goal</th>
                <th>Date</th>
                <th>
                    Location
                </th>
                <th>
                    Cost
                </th>
                <th>Description</th>
                <th>Organizer</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                <tr key={eventDetailData.event_id} >
                    <td>{eventDetailData.event_id}</td>
                    <td>{eventDetailData.name}</td>
                    <td>{eventDetailData.goal_id}</td>
                    <td><div>{eventDetailData.time}</div>
                        <div>{eventDetailData.date}</div>
                    </td>
                    <td>{eventDetailData.location}</td>
                    <td>{eventDetailData.cost}</td>
                    <td>{eventDetailData.description}</td>
                    <td>{eventDetailData.organizer_username}</td>
                    <td><Button className="btn btn-sm custom-button" onClick={()=>deleteEvent(eventDetailData.event_id)}>Delete</Button></td>
                    <td><Button className="btn btn-sm custom-button" onClick={()=>{navigate(`/events/edit/${eventDetailData.event_id}`)}}>Edit</Button></td>
                </tr>
            </tbody>
            </Table>
        </div>
        </div>
    </Container>
    </div>
    </div>
    </>
)
};
