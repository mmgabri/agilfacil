import React, { useState } from 'react';
import styled from "@emotion/styled";
import { Dropdown } from 'react-bootstrap';
import { MdMoreVert, MdEdit, MdCheck } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import './retro.css';

const ColumnHeader = ({ columnTitle, onUpdateTitle, onAddCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(columnTitle || 'Título da Coluna');
  const [isEdited, setIsEdited] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    console.log('handleSaveTitle ==> ', title)

    setIsEditing(false);
    setIsEdited(true);
    if (onUpdateTitle) {
      onUpdateTitle(title);
    }
  };

  // Estilo para o título da coluna
  const ColumnTitleWrapper = styled.div`
    font-size: 17px;
  color: #C0C0C0;
  margin-top: 5px;
  @media (min-width: 768px) {
    margin-top: 0;
    margin-left: 10px;
  }
`;

  // Estilo de destaque para a coluna
  const columnHeaderStyle = {
    display: 'flex',
    flexDirection: 'column',  // Alinha os itens verticalmente
    alignItems: 'center',  // Centraliza o conteúdo
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: '2px solid #34495e',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease-in-out',
    width: '100%',  // Garantir que ocupe toda a largura disponível
  };


  // Estilo para o título
  const titleStyle = {
    display: 'flex',
    justifyContent: 'space-between', // Alinha o título à esquerda e os ícones à direita
    width: '100%',  // Ocupa toda a largura disponível
    alignItems: 'center',  // Alinha os itens na mesma linha
  };

  const StyledMdCheck = styled(MdCheck)`
  color: #10b981;
  cursor: pointer; 
  transition: color 0.2s ease;

  &:hover {
    color: #3498db; // Muda a cor ao passar o mouse
  }
`;

  const StyledMdMoreVert = styled(MdMoreVert)`
  color: #C0C0C0;
  cursor: pointer; 
  transition: color 0.2s ease;

  &:hover {
    color: #3498db; // Muda a cor ao passar o mouse
  }
`;

  const StyledIoIosAddCircleOutline = styled(IoIosAddCircleOutline)`
  color: #10b981;  
  cursor: pointer; 
  transition: color 0.2s ease;

  &:hover {
    color: #3498db;  // Muda a cor ao passar o mouse
  }
`;

  const StyledDropdownMenu = styled(Dropdown.Menu)`
background-color: #2f2f2f;  // Cor de fundo do menu (cinza escuro)
border-radius: 8px;
padding: 10px;
`;

  const StyledDropdownItem = styled(Dropdown.Item)`
font-size: 12px;
color: #c0c0c0;  // Cor do texto (branco para contraste)
background-color: #2f2f2f;  // Cor de fundo do item (cinza escuro)
border-radius: 5px;

&:hover {
  color: #3498db;  // Cor do texto ao passar o mouse (azul)
  background-color: #444;  // Cor de fundo ao passar o mouse (cinza mais claro)
}
`;


  return (
    <div style={columnHeaderStyle}>
      <div style={titleStyle}>
        <ColumnTitleWrapper>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleSaveTitle}
              autoFocus
            />
          ) : (
            title
          )}
        </ColumnTitleWrapper>

        {/* Ícone de 3 pontinhos */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="link"
            id="dropdown-custom-components"
            as="div"
            style={{
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              border: 'none',
              boxShadow: 'none',
            }}
            className="custom-dropdown-toggle"
          >
            <div className="icon-more-vert">
              {isEditing ? (
                <StyledMdCheck size={19} onClick={handleSaveTitle} />
              ) : (
                <StyledMdMoreVert size={19} />
              )}
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu as={StyledDropdownMenu}>
            <StyledDropdownItem onClick={() => setIsEditing(true)}>
              <MdEdit style={{ marginRight: 8 }} />
              Editar Título
            </StyledDropdownItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Ícone de Adicionar Card com efeito de hover */}
      <div className="add-icon-container" onClick={onAddCard}>
        <StyledIoIosAddCircleOutline size={25} />
      </div>
    </div>
  );
};

export default ColumnHeader;
