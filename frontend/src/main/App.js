import React from "react"; /*--import the react library*/

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import CreateRoomPage from "../pages/CreateRoomPage";
import RoomPage from "../pages/RoomPage";
import GuestPage from "../pages/GuestPage";
import GuestUrlPage from "../pages/GuestUrlPage";
import NotificationPage from "../pages/NotificationPage"


function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="createroom" element={<CreateRoomPage />} />
        <Route exact path="room" element={<RoomPage />} />
        <Route exact path="guest" element={<GuestPage />} />
        <Route path="/guest/:id" element={<GuestUrlPage />} />
        <Route path="/notification" element={<NotificationPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;