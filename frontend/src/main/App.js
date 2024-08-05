import React from "react"; /*--import the react library*/
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"; /*--import the libraries for the routing*/
/*---section below import all  components to render*/
import Home from "../pages/Home";
import CriarSala from "../pages/CriarSala";
import Sala from "../pages/Sala";
import Convidado from "../pages/Convidado";
/*----------------------importing components ends-----------------*/

function App() {
  return (
    <>
      {/* WARNING: please not change the routing tags 
              -to add any router we need to enter in route tage */}

      <BrowserRouter>
        <Routes>
          {/* //--this is parent component called first route and all other are sub routes */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="criarsala" element={<CriarSala />} />
          <Route exact path="sala" element={<Sala />} />
          <Route exact path="convidado" element={<Convidado />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;