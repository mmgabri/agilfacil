import React from 'react';
import { HeaderContainer, Logo, LogoText, LogoImage, SubText, Nav, NavItem, Label } from '../../styles/HeaderStyles';
import favicon from '../../images/favicon.ico';

const HeaderRoom = ({ userName, roomName, handleShowInvite, sairSala, handleOpen }) => {
  return (
    <HeaderContainer>
      <Logo>
        <LogoImage src={favicon} alt="Logo" />
        <LogoText>AgilFacil</LogoText>
        <SubText>- Planning Poker</SubText>
      </Logo>
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
