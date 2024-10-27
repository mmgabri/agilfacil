import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuggestionForm from './components/SuggestionForm'
import "../styles/Home.css"
import Header from './components/Header';

function HomePage() {
    let navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleCriarSala = () => {
        navigate("/createroom")
    }

    const handleEntrarComoConvidado = () => {
        navigate("/guest")
    }

    const handleAbout = () => {
        navigate("/about")
    }

    const handleHome = () => {
        navigate("/")
    }

    const handleOpen = () => {
        setModalOpen(true);
      }
    

    return (
        <div className="bg-black-custom">
            <Header handleHome={handleHome} handleAbout={handleAbout} handleOpen={handleOpen} />
            <div className="container">
                <h2>Planning Poker</h2>
                <p className="instruction">Escolha uma das opções abaixo para continuar:</p>
                <div className="button-container">
                    <button className="button" onClick={handleCriarSala}>Criar Sala</button>
                    <button className="button" onClick={handleEntrarComoConvidado}>Entrar como convidado</button>
                </div>
            </div>
            {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
        </div>
    );

}
export default HomePage