import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import { MdMoreVert, MdCheck } from "react-icons/md";
import { colors } from "@atlaskit/theme";

const getBackgroundColor = (isDragging, isGroupedOver) => {
  if (isDragging) return "#D8968C";
  if (isGroupedOver) return "#77DD77";
  return "#F0E68C";
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
  padding: 8px;
  min-height: ${imageSize}px;
  margin-bottom: 8px;
  user-select: none;
  color: ${colors.N900};
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;

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
`;

const IconContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

function CardItem(props) {
  const { card, isDragging, provided, style, isClone, index } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState(card.content);
  const menuRef = useRef(null);

  const handleEdit = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aqui você pode implementar a lógica de salvar o conteúdo alterado.
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
      isGroupedOver={props.isGroupedOver}
      data-is-dragging={isDragging}
      data-testid={card.id}
      data-index={index}

    >
      {isClone && <CloneBadge>Clone</CloneBadge>}
      <Content>
        {isEditing ? (
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <div>{card.content}</div>
        )}
        <IconContainer ref={menuRef}>
          {isEditing ? (
            <MdCheck onClick={handleSave} style={{ cursor: "pointer" }} />
          ) : (
            <Dropdown show={isMenuOpen} onToggle={() => setIsMenuOpen((prev) => !prev)}>
              <Dropdown.Toggle
                as="div"
                id="dropdown-basic"
                style={{ cursor: "pointer" }}
              >
                <MdMoreVert />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEdit}>Editar</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log("Excluir")}>
                  Excluir
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </IconContainer>
      </Content>

    </Container>
  );
}

export default React.memo(CardItem);
