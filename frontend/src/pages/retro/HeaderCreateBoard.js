import React from 'react';
import { HeaderContainer, LogoContainer, LogoTop, LogoText, LogoImage, SubText, Nav, NavItem, Label } from '../../styles/HeaderStyles';
import favicon from '../../images/favicon.ico';

const HeaderCreateBoard = ({ handleShowInvite, sairSala, handleOpen }) => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoTop>
          <LogoImage src={favicon} alt="Logo" />
          <LogoText>AgilFacil</LogoText>
        </LogoTop>
        <SubText>Retro</SubText>
      </LogoContainer>
      <Nav>
        <NavItem onClick={handleOpen}>Sugestões</NavItem>
        <NavItem onClick={handleShowInvite}>Convidar</NavItem>
        <NavItem onClick={sairSala}>Sair</NavItem>
      </Nav>
    </HeaderContainer>
  );
};

export default HeaderCreateBoard;
