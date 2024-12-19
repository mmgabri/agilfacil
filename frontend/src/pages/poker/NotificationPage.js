import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'; // Importar o ícone
import '../../styles/NotificationPage.css';
import Header from '../components/Header';
import SuggestionForm from '../components/SuggestionForm'

const NotificationPage = () => {
    const location = useLocation();
    const [isModalOpen, setModalOpen] = useState(false);
    let navigate = useNavigate();

    const handleAbout = () => {
        navigate("/about")
    }

    const handleHome = () => {
        navigate("/")
    }

    const handleHomePlanning = () => {
        navigate("/planning")
    }

    const handleOpen = () => {
        setModalOpen(true);
    }



    return (
        <div className="bg-black-custom">
            <Header handleHome={handleHome} handleAbout={handleAbout} handleOpen={handleOpen} />
            <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                {location.state.statusCode == 404 ?
                    <div className="error-text">
                        <h3>A URL não é válida!</h3>
                        <p>Por favor, peça uma nova URL e tente novamente.</p>
                    </div>
                    :
                    <div className="error-text">
                        <h3>Ocorreu um erro inesperado!</h3>
                        <p>Por favor, tente novamente mais tarde.</p>
                    </div>
                }
            </div>
            {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
        </div >
    );
};

export default NotificationPage;
