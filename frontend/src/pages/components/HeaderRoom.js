import React from 'react';
import { HeaderContainer, Logo, Nav, NavItem, Label } from '../../styles/HeaderStyles';

const HeaderRoom = ({userName, roomName, handleShowInvite, handleCloseInvite, sairSala}) => {
  return (
    <HeaderContainer>
      <Logo>Planning Poker</Logo>
      <div>
        <Label>Apelido: {userName}</Label>
        <Label>Sala: {roomName}</Label>
      </div>

      <Nav>
        <NavItem onClick={handleShowInvite}>Convidar</NavItem>
        <NavItem onClick={sairSala}>Sair</NavItem>
      </Nav>
    </HeaderContainer>
  );
};

export default HeaderRoom;
