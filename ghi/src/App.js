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
import Footer from "./Components/Footer.js";
import ForgotPassword from "./Components/Password.js";
import Home from "./Pages/Home.js";
import LoginForm from "./Pages/Logon.js";
import Lost from "./Components/Lost.js";
import MyAccomplistItemCreate from "./Pages/MyAccomplistCreate.js";
import MyEventCreate from "./Pages/MyEventCreate.js";
import NavBar from "./Components/NavBar.js";
import Register from "./Pages/Register.js";
import UpdateProfile from "./Pages/UpdateProfile.js";
import useToken, { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import "./index.css";
import PublicProfilePage from "./Pages/PublicProfilePage.js";
import AccomplistSearch from "./Pages/Search.js";
// import Chatpage from "./Pages/ChatPage.js";


function App() {
  const [error] = useState(null);
  const [user, setUser] = useState([]);
  const {token} = useAuthContext();
  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");
  const {fetchWithToken} = useToken();



  // function to get logged in user data from token
  async function getUserData() {
    if ({token}) {
      let userInformation = await JSON.parse(atob(token.split(".")[1])).account;
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
        <div className="app-container">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="chatpage" element={<Chatpage user={user} token={token} />} /> */}
            <Route path="search" element={<AccomplistSearch />} />
            <Route path="login" element={<LoginForm />} />

            <Route path="accomplist_items" element={<AcomplistItemCards />} />
              <Route path="signup" element={<Register />} />
              <Route
                path="updateprofile"
                element={<UpdateProfile user={user} />}
              />
              <Route
                path="events/new"
                element={<EventCreateForm user={user} items={items} />}
              />
              <Route path="events" element={<EventsList />} />
              <Route path="events/edit/:event_id" element={<EventEditor user={user} items={items}/>} />
              <Route path="events/:event_id" element={<EventDetailDisplay />} />
              <Route
                path="events/account/:account_id"
                element={<AccountProfilePage />}
              />
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
                element={
                  <MyAccomplistItemCreate
                    user={user}
                    items={items}
                    getMyItems={getMyItems}
                    my_accomplist_items={my_accomplist_items}
                  />
                }
              />
              <Route
              path="my_events/new"
              element={
                <MyEventCreate
                 user={user}
                />
              }
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
              <Route
                path="profile/:username"
                element={
                  <PublicProfilePage
                    user={user}
                    items={items}
                  />
                }
              />
              <Route path="/whoops" element={<ForgotPassword />} />
              <Route path="*" element={<Lost />} />
            </Routes>
          </div>
        </div>
        <Footer />
        <ErrorNotification error={error} />
      </BrowserRouter>
    </div>
  );
}

export default App;
