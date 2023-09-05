import { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";

export default function MyAccomplistItemCreate({user, items}) {
    const {token} = useToken();
    const [item, setItem] = useState('');
    const [completed, setCompleted] = useState(false);

//  Set User ID
const user_id = user.id

    async function handleSubmit(event) {
        event.preventDefault();
        const data = {
            user_id: user_id,
            item_id: item,
            completed: completed,
        };

        const myItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items`
        const fetchConfig = {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
              },
        };
        const response = await fetch(myItemUrl, fetchConfig)
        if (response.ok) {
            setItem('');
            setCompleted(false);

            // Refreshes my accomplist list and redirects
            //pass in get my items
            window.location.href = `${process.env.PUBLIC_URL}/my_accomplist_items`
        }

    }


    function handleChangeItem(event) {
        const { value } = event.target;
        setItem(value);
      }
    function handleChangeCompleted(event) {
        const { value } = event.target;
        setCompleted(value);
      }

    if (token) {
    return(
        <div className="container">
            <form onSubmit={handleSubmit}>
        <h1 style={{ marginTop: '150px' }}>Add An Accomplist Item To Your Bucketlist!</h1>
                <div className="mb-3">
                <label htmlFor="items" className="form-label">Choose Accomplist Item</label>
                <select onChange={handleChangeItem} required className="form-select" id="items" aria-label="Choose Accomplist Item">
                <option value="" >Choose Item From Dropdown Below!</option>
                {items.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}
                </select>
                </div>
        <div className="mb-3">
        <label htmlFor="completed" className="form-label">Have You Done It?</label>
        <select onChange={handleChangeCompleted} className="form-select" id="completed" aria-label="Have You Done It?">
         <option value={false} key="1">Will Do</option>
         <option value={true} key="2" >Done It!</option>
        </select>
        </div>
            <button disabled={items.length === 0} type="submit" className="btn btn-primary">Submit</button>
        </form>
        </div>
    )
    }
    else {
        return (
        <div> You must be logged in to add to your Accomplist Items </div>
        )
    }
}


    // async function handleSubmit(event) {
    // event.preventDefault();

    // const data = {
    //     user_id: user_id,
    //     item_id: item,
    //     completed: completed,
    // };

    // const checkItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items/check?user_id=${user_id}&item_id=${item}`;
    // const checkResponse = await fetch(checkItemUrl);
    // const existingItem = await checkResponse.json();

    // let myItemUrl, fetchConfig;

    // if (existingItem) {
    //     // Update existing item
    //     myItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items/${existingItem.id}`;
    //     fetchConfig = {
    //         method: "PUT",
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     };
    // } else {
    //     // Create new item
    //     myItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items`;
    //     fetchConfig = {
    //         method: "POST",
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     };
    // }

    // const response = await fetch(myItemUrl, fetchConfig)
