import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";
import { Dropdown } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { MdMoreVert, MdEdit, MdCheck } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegTrashAlt } from "react-icons/fa";
import './retro.css';
import ModalAddCard from './ModalAddCard';

const ColumnHeader = ({ columnTitle, onAddCard, index, onUpdateTitleColumn, onDeleteColumn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(columnTitle || 'Título da Coluna');
  const [isModalOpen, setModalOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    setTitle(columnTitle);
  }, [columnTitle]);

  const getDropdownItemStyle = (index) => ({
    fontSize: '12px',
    color: hoverIndex === index ? '#ffffff' : '#c0c0c0',
    backgroundColor: hoverIndex === index ? '#404040' : '#2f2f2f',
    borderRadius: '5px',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s, color 0.3s',
    cursor: 'pointer',
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    setIsEditing(false);
    onUpdateTitleColumn(title, index)
  };

  const handleDeleteColumn = () => {
    onDeleteColumn(index)
  };

  const handleModalAddCardSubmit = (value) => {

    const newCard = {
      id: uuidv4(),
      content: value,
      createdBy: "",
      likeCount: 0
    }
    onAddCard(newCard, index)
  };


  return (
    <ColumnHeaderContainer>
      <ModalAddCard
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalAddCardSubmit}
        title={title}
      />

      <TitleContainer>
        <Title>
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
        </Title>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="link"
            id="dropdown-custom-components"
            as="div"
            style={dropdownToggleStyle}
          >
            <IconContainer>
              {isEditing ? (
                <StyledMdCheck />
              ) : (
                <StyledMdMoreVert />
              )}
            </IconContainer>
          </Dropdown.Toggle>

          <Dropdown.Menu style={dropdownMenuStyle}>
            <Dropdown.Item
              onClick={() => setIsEditing(true)}
              style={getDropdownItemStyle(0)}
              onMouseEnter={() => setHoverIndex(0)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <MdEdit style={iconMarginStyle} />
              Editar Título
            </Dropdown.Item>
            <Dropdown.Item
              onClick={handleDeleteColumn}
              style={getDropdownItemStyle(1)}
              onMouseEnter={() => setHoverIndex(1)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <FaRegTrashAlt style={iconMarginStyle} />
              Excluir coluna
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </TitleContainer>

      <AddIconContainer>
        <StyledIoIosAddCircleOutline onClick={() => setModalOpen(true)}/>
      </AddIconContainer>
    </ColumnHeaderContainer>
  );
};

export default ColumnHeader;


// Estilizações
const ColumnHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #2c3e50;
  color: white;
  border: 2px solid #34495e;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  width: 100%;
  margin-bottom: 7px;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const Title = styled.div`
  font-size: 17px;
  color: #c0c0c0;
  margin-top: 5px;
  margin-bottom: 3px;
`;

const IconContainer = styled.div`
  color: #c0c0c0;
  cursor: pointer;
  transition: color 0.2s ease;
`;

const StyledIoIosAddCircleOutline = styled(IoIosAddCircleOutline)`
  color: #10b981;  // Cor do ícone (um tom de cinza)
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;  
  font-size: 25px;  
  
  &:hover {
    color: #4169E1; 
    transform: scale(1.4); 
  }
`;

const StyledMdMoreVert = styled(MdMoreVert)`
  color: #4169E1;  // Cor do ícone (um tom de cinza)
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;  
  font-size: 17px;  
  
  &:hover {
    color: #10b981; 
    transform: scale(1.4); 
  }
`;

const StyledMdCheck = styled(MdCheck)`
  color: white;  // Cor do ícone
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
  font-size: 30px;

  // Adicionando fundo verde e tornando o ícone circular
  background-color: #10b981;  // Cor do fundo (verde)
  border-radius: 50%;  // Tornar o fundo circular
  padding: 8px;  // Espaçamento interno para o ícone
  display: inline-flex;  // Manter o ícone alinhado
  justify-content: center;
  align-items: center;

  &:hover {
    color: #ffffff;  // Cor do ícone ao passar o mouse
    transform: scale(1.1);  // Aumentar o tamanho do ícone ao passar o mouse
    background-color: #1c8e61;  // Cor de fundo ao passar o mouse (um tom mais escuro de verde)
  }
`;


const dropdownToggleStyle = {
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  border: 'none',
  boxShadow: 'none',
};

const dropdownMenuStyle = {
  backgroundColor: '#2f2f2f',
  borderRadius: '8px',
  padding: '10px',
};


const iconMarginStyle = {
  marginRight: 8,
};

const AddIconContainer = styled.div`
  cursor: pointer;
  transition: color 0.2s ease;
`;
