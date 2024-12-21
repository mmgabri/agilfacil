import React, { useState, useRef, forwardRef, useEffect, memo } from "react";
import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import { MdMoreVert, MdEdit, MdCheck } from 'react-icons/md';
import { CiTrash } from "react-icons/ci";
import { AiTwotoneLike } from 'react-icons/ai';

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

const Container = styled.div`
  position: relative;
  border-radius: 6px;
  border: 2px solid ${(props) => getBorderColor(props.$isDragging)};
  background-color: ${(props) =>
    getBackgroundColor(props.$isDragging, props.$isGroupedOver)};
  box-shadow: ${(props) =>
    props.$isDragging
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
  padding-right: 4px; /* Adiciona espaço à direita para o ícone */
  flex-direction: column;  // Mudança para alinhar as divs verticalmente
  align-items: flex-start;

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
  display: flex;
  align-items: center;  // Alinha os itens verticalmente no centro
  justify-content: space-between;  // Cria um espaço entre os itens (texto e ícone)
  width: 100%;
`;

// Like
const ContainerLike = styled.div`
 margin-right: 100px;
   background-color: transparent;  // Torna a div transparente
  border-radius: 6px;
  width: 100%;
  text-align: right;  // Alinha o conteúdo à direita
  display: flex;
  justify-content: flex-end;  // Garante que o conteúdo será alinhado à direita
  align-items: center;
`;

const LikeIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;  // Espaço entre o ícone e o contador
`;

const StyledAiTwotoneLike = styled(AiTwotoneLike)`
  color: #4169E1;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 19px;  // Tamanho do ícone
  margin-right: 0px;  // Distância mínima entre o ícone e o contador

  &:hover {
    color: #3498db;  // Cor ao passar o mouse (opcional)
    transform: scale(1.2); 
  }
`;

const Count = styled.span`
  font-size: 14px;  // Tamanho da fonte do contador
  margin-right: 2px;  // Distância mínima entre o ícone e o contador
  margin-left: -6px;  // Distância mínima entre o ícone e o contador
  color: #4169E1;      // Cor do contador
`;

//Menu
const IconContainer = styled.div`
  position: absolute;
  margin-left: 10px;  // Adiciona um espaço entre o texto e o ícone
  top: 3px;
  right: 8px; /* Coloca o ícone no canto superior direito */
  z-index: 1; /* Garante que o ícone fique sobre o conteúdo */
`;

const StyledMdMoreVert = styled(MdMoreVert)`
  color: #4169E1;  // Cor do ícone (um tom de cinza)
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;  // Transição suave para cor e transformação
  font-size: 15px;  // Tamanho do ícone (ajustado para 18px, pode ser modificado)
  
  &:hover {
    color: "green";  // Cor do ícone ao passar o mouse (azul)
    transform: scale(1.4); 
  }
`;

const StyledMdCheck = styled(MdCheck)`
  color: #10b981;
  cursor: pointer; 
  transition: color 0.2s ease;
  margin-top: 2px;
  margin-right: 0px;
  margin-left: 2px;
  font-size: 20px;  // Tamanho do ícone (ajustado para 18px, pode ser modificado)

  &:hover {
    color: #3498db; // Muda a cor ao passar o mouse
    transform: scale(1.4);  
  }
`;

const StyledTextarea = styled.textarea`
  flex-grow: 1;   // Faz o textarea crescer para ocupar o espaço restante
  width: 100%;    // Garante que ocupe toda a largura disponível
  height: 100%;   // Garante que ocupe toda a altura disponível
  resize: none;   // Desabilita o redimensionamento manual
  padding: 8px;   // Espaçamento interno para o texto
  box-sizing: border-box;  // Inclui o padding no tamanho total
  font-family: Arial, sans-serif;  // Define a fonte
  font-size: 14px;  // Define o tamanho da fonte
  color: #333;  // Cor do texto
  background-color: #fff;  // Cor de fundo
  border: 1px solid #ccc;  // Borda leve
  border-radius: 4px;  // Bordas arredondadas
  transition: border-color 0.2s ease;  // Suaviza a mudança de cor da borda
  margin-right: 28px;

  &:focus {
    border-color: #3498db;  // Muda a cor da borda quando o campo está em foco
    outline: none;  // Remove a borda padrão de foco
  }
`;


function CardItem({ card, isDragging, provided, style, isClone, index, isGroupedOver, indexColumn, onSaveCard, onDeleteCard, onUpdateLike }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState(card.content);
  const [likeCount, setLikeCount] = useState(0);
  const menuRef = useRef(null);

    useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const CustomToggle = forwardRef((props, ref) => (
    <div
      ref={ref}
      {...props}  // Apenas as propriedades necessárias serão passadas
      style={{ cursor: "pointer" }}
    >
      <StyledMdMoreVert />
    </div>
  ));

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    setIsMenuOpen(false);
    onSaveCard(content, index, indexColumn);
  };

  const handleDelete = () => {
    setIsEditing(false);
    onDeleteCard(index, indexColumn);
  };

  const handleLikeClick = () => {
    if (likeCount === 0) {
      onUpdateLike (true, index, indexColumn)
    }else{
      onUpdateLike (false, index, indexColumn)
    }
    setLikeCount(likeCount === 0 ? 1 : 0);
  };

  function getStyle(provided, style) {
    return style ? { ...provided.draggableProps.style, ...style } : provided.draggableProps.style;
  }

  return (
    <Container
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      $isDragging={isDragging} // Use $isDragging
      $isGroupedOver={isGroupedOver} // Use $isGroupedOver
      data-is-dragging={isDragging}
      data-testid={card.id}
      data-index={index}
    >
      {isClone && <CloneBadge>Clone</CloneBadge>}
      <Content>
        {isEditing ? (
          <StyledTextarea
            value={content}
            rows={4}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <div>{card.content}</div>
        )}
      </Content>
      <IconContainer ref={menuRef}>
        {isEditing ? (
          <StyledMdCheck onClick={handleSave} style={{ cursor: "pointer" }} />
        ) : (
          <Dropdown show={isMenuOpen} onToggle={() => setIsMenuOpen((prev) => !prev)}>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" />
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleEdit}>
                <MdEdit style={{ marginRight: 5 }} />
                Editar Card
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>
                <CiTrash style={{ marginRight: 5 }} />
                Excluir Card
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </IconContainer>
      <ContainerLike>
        <LikeIconContainer>
          <StyledAiTwotoneLike onClick={handleLikeClick} />
          <Count>{card.likeCount}</Count>
        </LikeIconContainer>
      </ContainerLike>
    </Container>
  );
}

export default memo(CardItem);