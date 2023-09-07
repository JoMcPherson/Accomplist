import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import AccomplistDetail from "./Pages/AccomplistDetail.js";
import AcomplistItemCards from "./Pages/AccomplistItems.js";
import AccountProfilePage from "./Pages/AccountProfilePage.js";
import AccomplistItemCreate from "./Pages/AccomplistItemCreate.js";
import ErrorNotification from "./ErrorNotification";
import EventCreateForm from "./Pages/EventCreatePage.js";
import EventDetailDisplay from "./Pages/EventDetailsPage.js";
import EventEditor from "./Pages/EventEditPage.js";
import EventsList from "./Pages/EventsListPage.js";
import ForgotPassword from "./Components/Password.js";
import Home from "./Pages/Home.js";
import LoginForm from "./Pages/Logon.js";
import Lost from "./Components/Lost.js";
import MyAccomplistItemCreate from "./Pages/MyAccomplistCreate.js";
import NavBar from "./Components/NavBar.js";
import Register from "./Pages/Register.js";
import UpdateProfile from "./Pages/UpdateProfile.js";
import useToken from "@galvanize-inc/jwtdown-for-react";
import "./index.css";

function App() {
  const [error] = useState(null);
  const [user, setUser] = useState([]);
  const { token, fetchWithToken } = useToken();
  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");

  // function to get logged in user data from token
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
    } // eslint-disable-next-line
  }, [token]);

  // Set Accomplist Items
  const [items, setItems] = useState([]);

  // Call Items Function Upon Token
  useEffect(() => {
    if (token && user.id) {
      async function fetchData() {
        if (token) {
          try {
            const myItemUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;
            const itemsData = await fetchWithToken(myItemUrl);
            setItems(itemsData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        } else {
          console.log("fetch items failed");
        }
      }

      fetchData();
    } // eslint-disable-next-line
  }, [token, user.id]);

  // Set My Accomplist Items
  const [my_accomplist_items, setMyItems] = useState([]);
  const getMyItems = async () => {
    if (token) {
      const myItemUrl = `${process.env.REACT_APP_API_HOST}/api/my_accomplist_items/account/${user.id}`;
      const response = await fetchWithToken(myItemUrl);
      // Filter items based on user_id
      const filteredItems = response.filter((item) => item.user_id === user.id);
      setMyItems(filteredItems);
    } else {
      console.log("fetch my items failed");
    }
  };

  // Call Items Function Upon Token
  useEffect(() => {
    if (token && user.id) {
      getMyItems();
    } // eslint-disable-next-line
  }, [token, user.id]);

  return (
    <div>
      <BrowserRouter basename={basename}>
      <NavBar />
      <Outlet />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="accomplist_items" element={<AcomplistItemCards />} />
            <Route path="signup" element={<Register />} />
            <Route path="updateprofile" element={<UpdateProfile user={user} />} />
            <Route path="events/new" element={<EventCreateForm />} />
            <Route path="events" element={<EventsList />} />
            <Route path="events/edit/:event_id" element={<EventEditor />} />
            <Route path="events/:event_id" element={<EventDetailDisplay />} />
            <Route
              path="accomplist_items/:id"
              element={
                <AccomplistDetail
                  user={user}
                  my_accomplist_items={my_accomplist_items}
                />
              }
            />
            <Route
              path="accomplist_items/new"
              element={<AccomplistItemCreate user={user} />}
            />
            <Route
              path="my_accomplist_items/new"
              element={<MyAccomplistItemCreate user={user} items={items} getMyItems={getMyItems} my_accomplist_items={my_accomplist_items} />}
            />
            <Route
              path="profile"
              element={
                <AccountProfilePage
                  user={user}
                  my_accomplist_items={my_accomplist_items}
                  items={items}
                  getMyItems={getMyItems}
                />
              }
            />
            <Route path="/whoops" element={<ForgotPassword />}/>
            <Route path="*" element={<Lost />}/>
          </Routes>
        </div>
        <ErrorNotification error={error} />
      </BrowserRouter>
    </div>
  );
}

export default App;
