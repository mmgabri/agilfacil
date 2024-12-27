import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../../styles/Invite.css';
import { GUEST_BASE_URL } from "../../constants/apiConstants";

const Invite = ({ id, onClose, service }) => {
  const [copied, setCopied] = useState(false);

  // Gerar URL com base no ID da sala
  const inviteUrlPoker = `${GUEST_BASE_URL}/room/guest/${id}`;
  const inviteUrlBoard = `${GUEST_BASE_URL}/board/guest/${id}`;

  // Função para lidar com o estado de cópia
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Resetar o estado após 2 segundos
  };

  if (!id) return null; // Não renderiza o modal se não houver roomId

  return (
    <div className="overlay">
      <div className="invite-container">
        <button className="close-button" onClick={onClose}>&times;</button>
        <CopyToClipboard
          text={service === 'poker' ? inviteUrlPoker : inviteUrlBoard} onCopy={handleCopy}>
          <div className="invite-url-container">
            <input
              type="text"
              value={service === 'poker' ? inviteUrlPoker : inviteUrlBoard}
              readOnly
              className="invite-url"
              onClick={handleCopy} // Copia a URL ao clicar no input
            />
            <button className="copy-button">
              {copied ? 'Copiado!' : 'Copiar URL'}
            </button>
          </div>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default Invite;
