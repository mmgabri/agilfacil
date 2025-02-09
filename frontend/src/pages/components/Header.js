import React from 'react';
import { HeaderContainer, Logo, Nav, NavItem, Label } from '../../styles/HeaderStyles';
import favicon from '../../images/favicon.ico';

const Header = ({ handleHome, handleAbout, handleOpen, handleSignOut }) => {

  return (
    <HeaderContainer>
      <NavItem onClick={handleHome} style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }}>
        <img src={favicon} alt="Logo" style={{ width: '32px', height: '32px', marginRight: '10px' }} />
        AgilFacil
      </NavItem>
      <Nav>
        <NavItem onClick={handleOpen}>Sugestões</NavItem>
        <NavItem onClick={handleAbout}>Sobre</NavItem>
        {handleSignOut && <NavItem onClick={handleSignOut}>Sair</NavItem>}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
