import React from 'react';
import { StatusContainer, Status, CommandButton } from '../../styles/StatusSectionStyles';

const StatusSection = ({ roomData, moderator, handlerupdateStatusRoom }) => {

    const handleBuildStatus = () => {

        switch (roomData.status) {
            case "NOVA_VOTACAO":
                return <Status>Aguardando liberação da votação</Status>
            case "VOTACAO_EM_ANDAMENTO":
                return <Status>Votação em andamento</Status>
            case "VOTACAO_FINALIZADA":
                return <Status>Votação finalizada</Status>
            case "VOTACAO_ENCERRADA":
                return <Status>Aguardando nova votação</Status>
        }
    };

    const handleBuildButtonStatus = () => {

        switch (roomData.status) {
            case "NOVA_VOTACAO":
                return <button type="button" className="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_EM_ANDAMENTO")}>Liberar Votação</button>
            case "VOTACAO_EM_ANDAMENTO":
                return <button type="button" className="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_FINALIZADA")}>Finalizar Votação</button>
            case "VOTACAO_FINALIZADA":
                return <button type="button" className="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_ENCERRADA")}>Encerrar Votação</button>
            case "VOTACAO_ENCERRADA":
                return <button type="button" className="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_EM_ANDAMENTO")}>Nova Votação</button>
        }
    };

    return (
        <div style={{ padding: '0.8rem', display: 'flex', justifyContent: 'center' }}>
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
