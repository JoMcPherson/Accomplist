import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";


export default function Tokeneer(){

    const param = useParams()
    const { token } = useAuthContext()
    const [accountData, setAccountData] = useState([])
    const navigate = useNavigate()


    async function getZeeUserData(){
        if (token){
        const userUrl = `${process.env.REACT_APP_API_HOST}/tokeneer/${param.username}`;
        let fetchConfig = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`,},
            };
        let fetchedData = await fetch(userUrl, fetchConfig)
        if (fetchedData.ok) {
            let jsonifiedData = await fetchedData.json()
            setAccountData(jsonifiedData)
            console.log(jsonifiedData)

        }
        else {
            console.log("fetch didn't work")
        }

        }};


    useEffect(()=>{
        if (token){
         console.log("Tokeneer fired")
         getZeeUserData()
         console.log("ZeeGetter fired")}
    }, [token]);



    return (
        <div>
            <div>
            Your main event!
            <div>
            <h2>{accountData.username}</h2><h5><button onClick={()=>{navigate(`/events`)}}>back to list</button></h5>
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
                    <tr key={accountData.id} >
                        <td>{accountData.id}</td>
                        <td>{accountData.first_name} {accountData.last_name}</td>
                        <td>{accountData.email}</td>
                        <td>{accountData.date_created}</td>
                    </tr>
                    <tr>
                        <td>{accountData.bio}</td>
                        <td>{accountData.photo}</td>
                    </tr>
                </tbody>
            </table>
        </div>


        </div>
        </div>
    )


}
