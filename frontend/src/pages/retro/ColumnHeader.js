import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { MdMoreVert, MdEdit, MdCheck } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import './retro.css';

// Estilos em objetos, removendo o uso de styled-components
const ColumnHeader = ({ columnTitle, onUpdateTitle, onAddCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(columnTitle || 'Título da Coluna');
  const [isEdited, setIsEdited] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    console.log('handleSaveTitle ==> ', title);

    setIsEditing(false);
    setIsEdited(true);
    if (onUpdateTitle) {
      onUpdateTitle(title);
    }
  };

  // Estilo para o título da coluna
  const columnHeaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: '2px solid #34495e',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease-in-out',
    width: '100%',
    marginBottom: '7px'
  };

  const titleStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  };

  const iconStyle = {
    color: '#C0C0C0',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  };

  const iconHoverStyle = {
    color: '#3498db',
  };

  return (
    <div style={columnHeaderStyle}>
      <div style={titleStyle}>
        <div style={{ fontSize: '17px', color: '#C0C0C0', marginTop: '5px', marginBottom: '3px' }}>
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
        </div>

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
          >
            <div style={iconStyle}>
              {isEditing ? (
                <MdCheck
                  size={19}
                  onClick={handleSaveTitle}
                  style={iconHoverStyle}
                />
              ) : (
                <MdMoreVert size={19} style={iconHoverStyle} />
              )}
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu
            style={{
              backgroundColor: '#2f2f2f',
              borderRadius: '8px',
              padding: '10px',
            }}
          >
            <Dropdown.Item
              onClick={() => setIsEditing(true)}
              style={{
                fontSize: '12px',
                color: '#c0c0c0',
                backgroundColor: '#2f2f2f',
                borderRadius: '5px',
              }}
            >
              <MdEdit style={{ marginRight: 8 }} />
              Editar Título
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Ícone de Adicionar Card com efeito de hover */}
      <div
        className="add-icon-container"
        onClick={onAddCard}
        style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
      >
        <IoIosAddCircleOutline
          size={25}
          style={{ color: '#10b981', transition: 'color 0.2s ease' }}
          onMouseOver={(e) => e.target.style.color = '#3498db'}
          onMouseOut={(e) => e.target.style.color = '#10b981'}
        />
      </div>
    </div>
  );
};

export default ColumnHeader;
