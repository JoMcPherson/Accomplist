import { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

export default function AccomplistItemCreate({user}) {
    const {token} = useToken();
    const [title, setTitle] = useState('');
    const [date] = useState(getDate());
    const [details, setDetails] = useState('');
    const [photo, setPhoto] = useState('');
    const [resources, setResources] = useState('');
    const [things_to_do, setThingsToDo] = useState('');
    const [things_not_to_do, setThingsNotToDo] = useState('');

// PUT THAT CODE HERE and replace user_id below obvi
    async function handleSubmit(event) {
    event.preventDefault();


    const data = {
        user_id: user.id,
        title: title,
        details: details,
        photo: photo,
        resources: resources,
        things_to_do: things_to_do,
        things_not_to_do: things_not_to_do,
        date_added: date
    };

    const ItemUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items/`;
    const fetchConfig = {
        method: "post",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Assuming the token is used for authorization
        },
    };

    try {
        const response = await fetch(ItemUrl, fetchConfig);
        if (!response.ok) {
            // Handle error responses if needed
            console.error('Failed to submit the item.');
        } else {
            // Handle success response if needed
            console.log('Item submitted successfully!');
            window.location.href = `${process.env.PUBLIC_URL}/accomplist_items`
            // Perform any necessary actions after successful submission
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

    if (token) {
    return(
        token &&< form onSubmit={handleSubmit}>
        <div>Add An Accomplist Item</div>
        <div className="form-group mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input value={title} onChange={e => {setTitle(e.target.value)}} required type="text" className="form-control" id="title" placeholder="e.g. Skydiving"/>

        </div>
        <div className="form-group mb-3">
                <label htmlFor="details" className="form-label">details</label>
                <input value={details} onChange={e => {setDetails(e.target.value)}} required type="text" className="form-control" id="details" placeholder="e.g. Free fall from airplane with parachute"/>

        </div>
        <div className="form-group mb-3">
                <label htmlFor="photo" className="form-label">Photo</label>
                <input value={photo} onChange={e => {setPhoto(e.target.value)}} type="text" className="form-control" id="photo" placeholder="Photo Url"/>

        </div>
          <div className="form-group mb-3">
                <label htmlFor="resources" className="form-label">Resources</label>
                <input value={resources} onChange={e => {setResources(e.target.value)}} type="text" className="form-control" id="resources" placeholder="e.g. https://www.uspa.org/resources"/>

        </div>
        <div className="form-group mb-3">
                <label htmlFor="things_to_do" className="form-label">Things To Do</label>
                <input value={things_to_do} onChange={e => {setThingsToDo(e.target.value)}} type="text" className="form-control" id="things_to_do" placeholder="e.g. Pay for the picture package"/>

        </div>
         <div className="form-group mb-3">
                <label htmlFor="things_not_to_do" className="form-label">Things NOT To Do</label>
                <input value={things_not_to_do} onChange={e => {setThingsNotToDo(e.target.value)}} type="text" className="form-control" id="things_not_to_do" placeholder="e.g. Eat a big lunch"/>

        </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
    }
    else {
        return (
        <div> You must be logged in to create an Accomplist Item </div>
        )
    }
}
