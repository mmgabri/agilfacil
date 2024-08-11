import React from "react"; /*--import the react library*/

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "../pages/Home";
import CreateRoom from "../pages/CreateRoom";
import Room from "../pages/Room";
import Guest from "../pages/Guest";


function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="createroom" element={<CreateRoom />} />
        <Route exact path="room" element={<Room />} />
        <Route exact path="guest" element={<Guest />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;