import useToken from "@galvanize-inc/jwtdown-for-react";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";


const Profile = () => {
    const params = useParams();
    const {token, fetchWithToken} = useToken()
    const [account, setAccount] = useState([]);
    const [journals, setJournals] = useState([]);

    const getAccountData = async () => {
        if (token) {
            const url = `${process.env.REACT_APP_API_HOST}/api/accounts`;

            // OR authenticate with bearer via library
            const result = await fetchWithToken(url)
            setAccount(result)

            // OR authenticate with bearer manually
            // const result2 = await fetch(url, {
            //     headers: { Authorization: `Bearer ${token}` }
            // })
            //     .then((resp) => resp.json())
            //     .catch(console.error);
            // setAccount(result2);

            // OR authenticate with cookies manually
            // ...


            // only showing journal data if the current profile is the currently authenticated user
            if (params.accountId === result.account_id) {
                getJournalData();
            }
        }
        setJournals([]);
    }

    const getJournalData = async () => {
        const url = `${process.env.REACT_APP_API_HOST}/`;
        const result = await fetchWithToken(url);
        setJournals(result.journals);
    }

    const accountDetails =
        <table>
            <tbody>
                <tr>
                    <th>username: {account.username}</th>
                </tr>
                <tr>
                    <th>fact: {account.fact}</th>
                </tr>
            </tbody>
        </table>

    const journalsTable =
        <table>
            <tbody>
                {journals.map(item => {
                    return (
                        <tr>
                            <td>{item.date}</td>
                            <td>{item.content}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>

    useEffect(() => {
        getAccountData();
    }, [token]);

    // conditional rendernig to only show the profile details if logged in
    return (
        <div>
            <div>
                {token && accountDetails}
            </div>
            <br></br>
            <div>
                {journalsTable}
            </div>
        </div>
    );

}

export default Profile;
