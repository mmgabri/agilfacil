import React from 'react';
import { HeaderContainer, Logo, Nav, NavItem, Label } from '../../styles/HeaderStyles';

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>Agil Facil - Planning Poker</Logo>
      <Nav>
        <NavItem>Sobre</NavItem>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
