import React from "react"; /*--import the react library*/
import { ToastContainer } from 'react-toastify';
import styled from "styled-components";
import { Authenticator, translations, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { I18n } from 'aws-amplify/utils';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
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
import BoardListPage from "../pages/retro/BoardListPage"
import GuestUrlRetroPage from "../pages/retro/GuestUrlRetroPage";
import ExportPDFPage from "../pages/retro/ExportPDFPage";
import '../styles/NotificationPage.css';

I18n.putVocabularies(translations);
I18n.setLanguage('pt');

const StyledToastContainer = styled(ToastContainer)`
  z-index: 9999;
`;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1c1c1c;
  color: white;
  font-family: Arial, sans-serif;
`;

const ProtectedRoute = ({ children }) => {
  const { route } = useAuthenticator((context) => [context.route]);

  if (route !== "authenticated") {
    return (
      <AuthContainer>
        <Authenticator
          socialProviders={["google"]}
          formFields={formFields}
          hideSignUp={false} 
        />
      </AuthContainer>
    );
  }
  return children;
};


const formFields = {
  signIn: {
    username: {
      placeholder: 'Digite seu e-mail',
      isRequired: true,
      label: 'Email ',
      order: 1,
    },
  },

  signUp: {
    name: {
      label: 'Nome',
      placeholder: 'Digite seu nome',
      isRequired: true,
      order: 1,
    },
    email: {
      placeholder: 'Digite seu e-mail',
      isRequired: true,
      label: 'Email ',
      order: 2,
    },
  },
};

function App() {

  return (
    <Authenticator.Provider>
      <StyledToastContainer pauseOnFocusLoss={false} />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/planning" element={<HomePagePlanning />} />
          <Route exact path="/about" element={<AboutPage />} />
          <Route exact path="createroom" element={<CreateRoomPage />} />
          <Route exact path="room" element={<RoomPage />} />
          <Route exact path="guest" element={<GuestPage />} />
          <Route path="/room/guest/:id" element={<GuestUrlPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/export" element={<ExportPDFPage />} />
          <Route path="/board/guest/:id" element={<GuestUrlRetroPage />} />
          <Route
            path="/board/create"
            element={
              <ProtectedRoute>
                <CreateBoardPage />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/boards"
            element={
              <ProtectedRoute>
                <BoardListPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
      </Authenticator.Provider>
  );
}

export default App;