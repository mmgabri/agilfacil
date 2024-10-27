import React from "react"; /*--import the react library*/
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import HomePagePlanning from "../pages/HomePagePlanning";
import CreateRoomPage from "../pages/CreateRoomPage";
import RoomPage from "../pages/RoomPage";
import GuestPage from "../pages/GuestPage";
import GuestUrlPage from "../pages/GuestUrlPage";
import NotificationPage from "../pages/NotificationPage"
import AboutPage from "../pages/AboutPage"

const StyledToastContainer = styled(ToastContainer)`
  z-index: 9999;
`;


function App() {
  return (
    <>
      <StyledToastContainer pauseOnFocusLoss={false} />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/planning" element={<HomePagePlanning />} />
          <Route exact path="/about" element={<AboutPage />} />
          <Route exact path="createroom" element={<CreateRoomPage />} />
          <Route exact path="room" element={<RoomPage />} />
          <Route exact path="guest" element={<GuestPage />} />
          <Route path="/guest/:id" element={<GuestUrlPage />} />
          <Route path="/notification" element={<NotificationPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;