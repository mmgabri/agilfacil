import React from "react"; /*--import the react library*/
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "../pages/generic/HomePage";
import AboutPage from "../pages/generic/AboutPage"

import HomePagePlanning from "../pages/poker/HomePagePlanning";
import CreateRoomPage from "../pages/poker/CreateRoomPage";
import RoomPage from "../pages/poker/RoomPage";
import GuestPage from "../pages/poker/GuestPage";
import GuestUrlPage from "../pages/poker/GuestUrlPage";
import NotificationPage from "../pages/poker/NotificationPage"

import BoardPage from "../pages/retro/BoardPage"
import CreateBoardPage from "../pages/retro/CreateBoardPage"
import GuestUrlRetroPage from "../pages/retro/GuestUrlRetroPage";

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

          <Route path="/retro" element={<CreateBoardPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/retro/guest/:id" element={<GuestUrlRetroPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;