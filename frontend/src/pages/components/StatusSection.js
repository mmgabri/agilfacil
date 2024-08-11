import React from 'react';
import { StatusContainer, Status, CommandButton } from '../../styles/StatusSectionStyles';

const StatusSection = ({ roomData, moderator, handlerupdateStatusRoom }) => {

    const handleBuildStatus = () => {

        switch (roomData.status) {
            case "AGUARDANDO_LIBERACAO":
                return <Status>Aguardando liberação da votação</Status>
            case "VOTACAO_EM_ANDAMENTO":
                return <Status>Votação em andamento</Status>
            case "VOTACAO_FINALIZADA":
                return <Status>Votação finalizada</Status>
            case "VOTACAO_ENCERRADA":
                return <Status>Votação encerrada</Status>
        }
    };

    const handleBuildButtonStatus = () => {

        switch (roomData.status) {
            case "AGUARDANDO_LIBERACAO":
                return <button type="button" class="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_EM_ANDAMENTO")}>Liberar Votação</button>
            case "VOTACAO_EM_ANDAMENTO":
                return <button type="button" class="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_FINALIZADA")}>Finalizar Votação</button>
            case "VOTACAO_FINALIZADA":
                return <button type="button" class="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_ENCERRADA")}>Encerrar Votação</button>
            case "VOTACAO_ENCERRADA":
                return <button type="button" class="btn btn-primary" onClick={() => handlerupdateStatusRoom("AGUARDANDO_LIBERACAO")}>Nova Votação</button>
        }
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            <StatusContainer>
                {handleBuildStatus()}
                {moderator
                    ? <>{handleBuildButtonStatus()}</>
                    : <></>}
            </StatusContainer>
        </div>
    );
};

export default StatusSection;
