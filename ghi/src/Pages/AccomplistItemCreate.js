import { useState, useEffect, useMemo } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import Logen from "../Components/Logen";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

function generateGoogleSearchUrl(query) {
  const encodedQuery = encodeURIComponent(query);
  return `https://www.google.com/search?q=${encodedQuery}`;
}

export default function AccomplistItemCreate({user}) {
    const {token} = useToken();
    const [title, setTitle] = useState('');
    const [date] = useState(getDate());
    const [details, setDetails] = useState('');
    const [photo, setPhoto] = useState('');
    const [resources, setResources] = useState('');



// custom background
  const mainBg = useMemo(() => ({
    backgroundImage: 'url("https://i.imgur.com/d6MPotL.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    }),
  []);

  useEffect(() => {
    Object.keys(mainBg).forEach((styleProp) => {
      document.body.style[styleProp] = mainBg[styleProp];
  });

  return () => {
    Object.keys(mainBg).forEach((styleProp) => {
      document.body.style[styleProp] = '';
      });
    };
  }, [mainBg]);

// PUT THAT CODE HERE and replace user_id below obvi
    async function handleSubmit(event) {
    event.preventDefault();

    console.log('handleSubmit called');

  let updatedResources = resources;

  if (!resources) {
    updatedResources = generateGoogleSearchUrl(title);
  }

    const data = {
        user_id: user.id,
        title: title,
        details: details,
        photo: photo,
        resources: updatedResources,
        date_added: date
    };

    const ItemUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;
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

if (!token) {
    return <Logen />;
}
return (
        token && <div className="Auth-form-container">
        < form className="Auth-form" onSubmit={handleSubmit}>
            <div className="Auth-form-content">
                <h1 className="Auth-form-title">Add an Accomplist item:</h1>
                <p className="text-center mt-2 text-muted">Please check existing items before creating a new one.</p>
                <div className="form-group mt-3">
                        <label htmlFor="title" className="label">Title:</label>
                        <input value={title} onChange={e => {setTitle(e.target.value)}} required type="text" className="form-control mt-1" id="title" placeholder="e.g. Skydiving"/>
                </div>
                <div className="form-group mt-3">
                        <label htmlFor="details" className="label">Details:</label>
                        <input value={details} onChange={e => {setDetails(e.target.value)}} required type="text" className="form-control mt-1" id="details" placeholder="e.g. Fall from airplane with a parachute"/>
                </div>
                <div className="form-group mt-3">
                        <label htmlFor="photo" className="label">Photo:</label>
                        <input value={photo} onChange={e => {setPhoto(e.target.value)}} required type="text" className="form-control mt-1" id="photo" placeholder="Photo Url"/>
                </div>
                <div className="form-group mt-3">
                        <label htmlFor="resources" className="label">Resources:</label>
                        <input value={resources} onChange={e => {setResources(e.target.value)}} type="text" className="form-control mt-1" id="resources" placeholder="(optional) e.g. Links, Blogs, Videos, etc."/>
                </div>
                <div className="d-grid gap-2 mt-4">
                    <input className="btn btn-outline-dark" type="submit" value="submit" />
                </div>
            </div>
        </form>
        </div>
    )
}
