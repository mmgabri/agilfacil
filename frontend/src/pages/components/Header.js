import React from 'react';
import { HeaderContainer, Logo, Nav, NavItem, Label } from '../../styles/HeaderStyles';

const Header = ({userName, roomName}) => {
  return (
    <HeaderContainer>
      <Logo>Planning Poker</Logo>
      <div>
        <Label>Apelido: {userName}</Label>
        <Label>Sala: {roomName}</Label>
      </div>

      <Nav>
        <NavItem href="#home">Convidar</NavItem>
        <NavItem href="#about">Sair</NavItem>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
