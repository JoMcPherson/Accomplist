import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function MyAccomplistItemsList() {
const params = useParams();
const {token, fetchWithToken} = useToken();


// Set My Accomplist Items
const [my_accomplist_items, setMyItems] = useState([]);
const getMyItems = async () => {
        if (token) {
            const myItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items/${params.account_id}`;
            const response = await fetchWithToken(myItemUrl);
            // Filter items based on user_id
            const filteredItems = response.filter(item => item.user_id.toString() === params.account_id);
            setMyItems(filteredItems);
        } else {
            console.log("no token available");
        } };

// Call Items Function Upon Token
 useEffect(() => {
        getMyItems();
    }, [token, getMyItems]);

    return( token &&
        <div>
            <h1>My Accomplist Items</h1>
            <table>
                <thead>
                    <tr>
                        <th>
                            User Name
                        </th>
                        <th>
                            Item Name
                        </th>
                        <th>
                            Completed
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {my_accomplist_items.map(my_item => {
                        return (
                            <tr key={my_item.id} >
                                <td>{my_item.username}</td>
                                <td>{my_item.item_title}</td>
                                <td>{my_item.completed ? "Done" : "Will Do!"}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>

    )
}
