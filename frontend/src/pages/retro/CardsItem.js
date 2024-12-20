import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import { MdMoreVert, MdEdit, MdCheck } from 'react-icons/md';
import { CiTrash } from "react-icons/ci";
import { colors } from "@atlaskit/theme";

const getBackgroundColor = (isDragging, isGroupedOver) => {
  if (isDragging) return "#D8968C";
  if (isGroupedOver) return "#77DD77";
  return "#F0E68C";

  //Amarelo Claro: #FFFF00
  //Amarelo Esverdeado: #9ACD32
  //Amarelo Biscoito: #F0E68C - bom
  //Amarelo Limão: #FFF700
  //Amarelo Creme: #FFF5B7
  //Amarelo Manteiga: #F6E3B4
  //Amarelo Charme: #F9D423
  //Amarelo Daffodil: #FFFF31
  //Amarelo Banana: #FFE135
  //Amarelo Marfim: #F4F1C1
  //Amarelo Envelhecido: #DDBB66 - bom
  //Amarelo Charme: #F9D423
  //Amarelo Daffodil: #FFFF31
  //Amarelo Banana: #FFE135
  //Amarelo Marfim: #F4F1C1
  //Amarelo Envelhecido: #DDBB66 - bom

  //Verde Pastel: #77DD77
  //Verde Floresta Claro: #6DBE45

  //Verde Pastel: #77DD77
  //Verde Floresta Claro: #6DBE45
  //Rosa Pastel: #F7A7C1
  //Rosa Quartzo: #F1C6D1
  //Rosa Flamingo: #F6A5B2
  //Rosa Envelhecido: #D8968C
  //Rosa Pastel: #F7A7C1
  //Rosa Quartzo: #F1C6D1
  //Rosa Flamingo: #F6A5B2
  //Rosa Envelhecido: #D8968C
};

const getBorderColor = (isDragging) => (isDragging ? "black" : "transparent");

const imageSize = 40;

const CloneBadge = styled.div`
  background: ${colors.G100};
  bottom: 4px;
  border: 2px solid ${colors.G200};
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);
  height: ${imageSize}px;
  width: ${imageSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.a`
  position: relative;
  border-radius: 6px;
  border: 2px solid ${(props) => getBorderColor(props.isDragging)};
  background-color: ${(props) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver)};
  box-shadow: ${(props) =>
    props.isDragging
      ? `2px 2px 2px ${colors.N70}, -2px -2px 2px ${colors.N70}, 1px 1px 4px ${colors.N70}`
      : "none"};
  box-sizing: border-box;
  padding: 6px;
  min-height: ${imageSize}px;
  margin-bottom: 8px;
  user-select: none;
  color: ${colors.N900};
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px; /* Adiciona espaço à direita para o ícone */

  &:hover,
  &:active {
    color: ${colors.N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Content = styled.div`
  flex: 1;
  white-space: pre-wrap; /* Garante que as quebras de linha sejam preservadas */
`;

const IconContainer = styled.div`
  position: absolute;

  top: 3px;
  right: 8px; /* Coloca o ícone no canto superior direito */
  z-index: 1; /* Garante que o ícone fique sobre o conteúdo */
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

const StyledMdCheck = styled(MdCheck)`
color: #10b981;
cursor: pointer; 
transition: color 0.2s ease;

&:hover {
  color: #3498db; // Muda a cor ao passar o mouse
}
`;

const StyledMdMoreVert = styled(MdMoreVert)`
color: #4F4F4F;
cursor: pointer; 
transition: color 0.2s ease;

&:hover {
  color: #3498db; // Muda a cor ao passar o mouse
}
`;


function CardItem({
  card,
  isDragging,
  provided,
  style,
  isClone,
  index,
  isGroupedOver,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState(card.content);
  const menuRef = useRef(null);

  const handleEdit = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleSave = () => {
    console.log(content, card.id)
    setIsEditing(false);
    if (onSave) {
      onSave(content, card.id); // Chama a função de salvar passando o conteúdo e o id do card
    }
  };

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function getStyle(provided, style) {
    return style ? { ...provided.draggableProps.style, ...style } : provided.draggableProps.style;
  }

  return (
    <Container
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      isDragging={isDragging}
      isGroupedOver={isGroupedOver} // Passando isGroupedOver corretamente
      data-is-dragging={isDragging}
      data-testid={card.id}
      data-index={index}
    >
      {isClone && <CloneBadge>Clone</CloneBadge>}
      <Content>
        {isEditing ? (
          <textarea
            value={content} // Use a variável de estado `content` para o valor do `textarea`
            onChange={(e) => setContent(e.target.value)} // Atualiza o estado `content` conforme o usuário digita
            onBlur={handleSave} // Salva o conteúdo quando o `textarea` perde o foco
            autoFocus
            rows={4} // Ajuste a quantidade de linhas conforme necessário
            style={{ width: "100%", resize: "none" }} // Desabilita o redimensionamento manual
          />
        ) : (
          <div>{card.content}</div> // Exibe o conteúdo original quando não está em modo de edição
        )}
      </Content>
      <IconContainer ref={menuRef}>
        {isEditing ? (
          <StyledMdCheck onClick={handleSave} style={{ cursor: "pointer" }} />
        ) : (
          <Dropdown show={isMenuOpen} onToggle={() => setIsMenuOpen((prev) => !prev)}>
            <Dropdown.Toggle
              as="div"
              id="dropdown-basic"
              style={{ cursor: "pointer" }}
            >
              <StyledMdMoreVert size={15} />
            </Dropdown.Toggle>
            <Dropdown.Menu as={StyledDropdownMenu}>
              <StyledDropdownItem onClick={handleEdit}>
                <MdEdit style={{ marginRight: 5 }} />
                Editar Card
              </StyledDropdownItem>
              <StyledDropdownItem onClick={() => console.log("Excluir")}>
                <CiTrash style={{ marginRight: 5 }} />
                Excluir Card
              </StyledDropdownItem>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </IconContainer>
    </Container>
  );
}

export default React.memo(CardItem);
