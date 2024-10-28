import React from 'react';
import { HeaderContainer, LogoContainer, LogoTop, LogoText, LogoImage, SubText, Nav, NavItem, Label } from '../../styles/HeaderStyles';
import favicon from '../../images/favicon.ico';

const HeaderRoom = ({ userName, roomName, handleShowInvite, sairSala, handleOpen }) => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoTop>
          <LogoImage src={favicon} alt="Logo" />
          <LogoText>AgilFacil</LogoText>
        </LogoTop>
        <SubText>Planning Poker</SubText>
      </LogoContainer>
      <div>
        <Label>Apelido: {userName}</Label>
        <Label>Sala: {roomName}</Label>
      </div>

      <Nav>
        <NavItem onClick={handleOpen}>Sugestões</NavItem>
        <NavItem onClick={handleShowInvite}>Convidar</NavItem>
        <NavItem onClick={sairSala}>Sair</NavItem>
      </Nav>
    </HeaderContainer>
  );
};

export default HeaderRoom;
