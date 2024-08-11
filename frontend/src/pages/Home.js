import React from 'react';
import { useNavigate } from 'react-router-dom'

function Home() {
    let navigate = useNavigate();

    const handleCriarSala = () => {
        navigate("createroom")
    }

    const handleEntrarComoConvidado = () => {
        navigate("guest")
    }


    return (
        <div class="container text-center margin-top-5">
            <h1>Agil Facil - Planning Poker</h1>
            <br></br>
            <br></br>
            <button onClick={handleCriarSala} type="button" class="btn btn-primary">Criar Sala</button>
            <br></br>
            <br></br>
            <button onClick={handleEntrarComoConvidado} type="button" class="btn btn-primary">Entrar como convidado</button>
        </div>
    );

}
export default Home