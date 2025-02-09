import React, { useState } from 'react';
import { signOut } from '@aws-amplify/auth';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { emitMessage } from '../../services/utils'
import SuggestionForm from '../components/SuggestionForm'
import Header from '../poker/components/HeaderPlanning';
import styled from "styled-components";
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import { FormGroup, SubmitButton } from '../../styles/FormStyle'


function HomePage() {
    let navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("create");
    const [roomName, setRoomName] = useState("");
    const [roomCode, setRoomCode] = useState("");

    const [formData, setFormData] = useState({
        userName: "",
        roomName: "",
        roomId: ""
    });

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAbout = () => {
        navigate("/about")
    }

    const handleHome = () => {
        navigate("/")
    }

    const handleOpen = () => {
        setModalOpen(true);
    }

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            emitMessage('error', 999)
        }
    };

    const handleSubmitCreateRoom = async e => {
        e.preventDefault()

        try {
            const response = await axios.post(SERVER_BASE_URL + '/createRoom', { roomName: formData.roomName, userName: formData.userName })
            console.log('response -->', response.data)
            navigate('/room', { state: { roomId: response.data.roomId, roomName: response.data.roomName, userId: response.data.userId, userName: response.data.userName, moderator: response.data.moderator } });
        } catch (error) {
            console.log("Respoposta da api com erro:", error, error.response?.status)
            emitMessage('error', 905, 3000)
        }
    }

    const handleSubmitJoinRoom = async e => {
        e.preventDefault()

        try {
            const response = await axios.post(SERVER_BASE_URL + '/joinRoom', { roomId: formData.roomId, userName: formData.userName })
            console.log('response -->', response.data)
            navigate('/room', { state: { roomId: response.data.roomId, roomName: response.data.roomName, userId: response.data.userId, userName: response.data.userName, moderator: response.data.moderator } });
        } catch (error) {
            console.log("Respoposta da api com erro:", error, error.response?.status)
            emitMessage('error', error.response?.status, 3000)
        }
    }

    return (
        <div className="bg-black-custom">
            <Header handleHome={handleHome} handleAbout={handleAbout} handleOpen={handleOpen} sairSala={handleSignOut} />

            <Container>
                <TabsContainer>
                    <Tab $isActive={activeTab === "create"} onClick={() => setActiveTab("create")}>
                        Nova Sala
                    </Tab>
                    <Tab $isActive={activeTab === "join"} onClick={() => setActiveTab("join")}>
                        Entrar na Sala
                    </Tab>
                </TabsContainer>

                <FormContainer>
                    {activeTab === "create" ? (
                        <StyledForm onSubmit={handleSubmitCreateRoom}>
                            <Title>Inicie uma nova sessão de Planning Poker</Title>
                            <FormGroup>
                                <label htmlFor="userName">Seu nome*</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleFieldChange}
                                    placeholder="Digite seu nome"
                                    required
                                    maxLength={15}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="roomName">Nome da sala*</label>
                                <input
                                    type="text"
                                    id="roomName"
                                    name="roomName"
                                    value={formData.roomName}
                                    onChange={handleFieldChange}
                                    placeholder="Digite o nome da sala"
                                    required
                                    maxLength={30}
                                />
                            </FormGroup>
                            <SubmitButton $marginTop="22px" type="submit">Criar Sala</SubmitButton>
                        </StyledForm>
                    ) : (
                        <StyledForm onSubmit={handleSubmitJoinRoom}>
                            <Title>Junte-se à sala de Planning Poker</Title>
                            <FormGroup>
                                <label htmlFor="userName">Seu nome*</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleFieldChange}
                                    placeholder="Digite seu nome"
                                    required
                                    maxLength={15}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="roomId">ID da sala*</label>
                                <input
                                    type="text"
                                    id="roomId"
                                    name="roomId"
                                    value={formData.roomId}
                                    onChange={handleFieldChange}
                                    placeholder="Digite o o id da sala"
                                    required
                                    maxLength={30}
                                />
                            </FormGroup>
                            <SubmitButton $marginTop="22px" type="submit">Entrar na sala</SubmitButton>
                        </StyledForm>
                    )}
                </FormContainer>
            </Container>

            {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
        </div>
    );

}

const Container = styled.div`
  width: 100%;
  max-width: 500px; /* Largura máxima */
  margin: 0 auto; /* Centraliza horizontalmente */
  margin-top: 40px;
  height: 100%; /* Preenche a altura disponível */
  padding: 0; /* Remove qualquer espaçamento interno */
  background: transparent;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: white;
`;


export const StyledForm = styled.form`
  background: #2c2c2c;
  border-radius: 0px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 27px;
  width: 100%; 
  max-width: 550px; /* Máximo permitido */
  
`;

export const FormContainer = styled.div`
  display: flex;
  background: blue;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%; /* Ocupa toda a largura disponível */
  height: 100%; /* Ocupa toda a altura do Container */
  padding: 0; /* Remove qualquer espaçamento interno */
  margin: 0; /* Remove qualquer margem */
`;


const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #3e8e41;
`;

const Tab = styled.div`
  flex: 1;
  margin-top: 0px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  background: ${({ $isActive }) => ($isActive ? "#3e8e41" : "#2c2c2c")};
  color: ${({ $isActive }) => ($isActive ? "white" : "#bbb")};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: 0.3s;

  &:hover {
    background: ${({ $isActive }) => ($isActive ? "#4CAF50 " : "#444")};
  }
`;

export const Title = styled.h1`
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #C0C0C0;
  font-weight: 400;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;



export default HomePage