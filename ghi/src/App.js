import { useEffect, useState } from "react";
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./index.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar.js";
import EventCreateForm from "./Pages/EventCreatePage.js";
import EventsList from "./Pages/EventsListPage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";
import AccomplistItemCreate from "./Pages/AccomplistItemCreate.js";
import MyAccomplistItemCreate from "./Pages/MyAccomplistCreate.js";
import MyAccomplistItemsList from "./Pages/MyAccomplistItemsList.js";
import LoginForm from "./Pages/Login.js";
import Register from "./Pages/Register.js";
import AccountProfilePage from "./Pages/AccountProfilePage.js";
import useToken from "@galvanize-inc/jwtdown-for-react";
import AcomplistItemCards from "./Pages/AccomplistItems.js";
import Home from "./Pages/Home.js";
import UpdateProfile from "./Pages/UpdateProfile.js";

function App() {
  const [launchInfo, setLaunchInfo] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const { token, fetchWithToken } = useToken();

  async function getUserData() {
    if (token) {
      let userInformation = JSON.parse(atob(token.split(".")[1])).account;
      console.log(userInformation);
      setUser(userInformation);
    } else {
      console.log("No token");
    }
  }

  useEffect(() => {
    if (token) {
      console.log("Token fired");
      getUserData();
      console.log("Get user data fired");
    }
  }, [token]);

  useEffect(() => {
    async function getData() {
      let url = `${process.env.REACT_APP_API_HOST}/api/launch-details`;
      let response = await fetch(url);
      let data = await response.json();

      if (response.ok) {
        console.log("got launch data!");
        setLaunchInfo(data.launch_details);
      } else {
        console.log("drat! something happened");
        setError(data.message);
      }
    }
    getData();

    // eventsAsync();
  }, []);

    // Set My Accomplist Items
  const [my_accomplist_items, setMyItems] = useState([]);
  const getMyItems = async () => {
          if (token) {
              const myItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items/${user.id}`;
              const response = await fetchWithToken(myItemUrl);
              // Filter items based on user_id
              const filteredItems = response.filter(item => item.user_id === user.id);
              setMyItems(filteredItems);

          } else {
              console.log("fetch failed");
          } };

// Call Items Function Upon Token
 useEffect(() => { if (token && user.id) {
        getMyItems()};
    }, [token,user.id]);

  return (
    <div>
      <NavBar />
      <Outlet />
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login/" element={<LoginForm />} />
            <Route path="accomplist_items/" element={<AcomplistItemCards />} />
            <Route path="register/" element={<Register />} />
            <Route path="updateprofile/:user_id" element={<UpdateProfile />} />
            <Route path="events/new" element={<EventCreateForm />} />
            <Route path="events/" element={<EventsList />} />
            <Route path="events/events" element={<EventsList />} />
            <Route path="events/:event_id" element={<EventDetailDisplay />} />
            <Route
              path="accomplist_items/new"
              element={<AccomplistItemCreate user={user}/>}
            />
            <Route
              path="my_accomplist_items/new"
              element={<MyAccomplistItemCreate user={user}/>}
            />
            <Route
              path="my_accomplist_items"
              element={<MyAccomplistItemsList user={user} my_accomplist_items={my_accomplist_items} />}
            />
            <Route
              path="accounts/profile"
              element={<AccountProfilePage user={user} />}
            />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>You're in the wrong spot cowboy.</p>
                </main>
              }
            />
          </Routes>
        </div>
        <ErrorNotification error={error} />
        <Construct info={launchInfo} />
      </BrowserRouter>
    </div>
  );
}

export default App;
