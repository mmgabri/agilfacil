import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Home.css"
import Header from './components/Header';

function HomePage() {
    let navigate = useNavigate();

    const handleCriarSala = () => {
        navigate("createroom")
    }

    const handleEntrarComoConvidado = () => {
        navigate("guest")
    }


    return (
        <div className="bg-black-custom">
            <Header />
            <div className="container">
                <h2>Bem-vindo!</h2>
                <p className="instruction">Escolha uma das opções abaixo para continuar:</p>
                <div className="button-container">
                    <button className="button" onClick={handleCriarSala}>Criar Sala</button>
                    <button className="button" onClick={handleEntrarComoConvidado}>Entrar como convidado</button>
                </div>
            </div>
        </div>
    );

}
export default HomePage