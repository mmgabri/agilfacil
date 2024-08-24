import styled from 'styled-components';

// Cabeçalho
export const HeaderContainer = styled.header`
display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #282c34;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const NavItem = styled.a`
  text-decoration: none;
  color: white;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &:hover {
    background-color: #61dafb;
    color: #282c34;
  }
`;

export const Label = styled.div`
  font-size: 0.9rem;
  margin-left: 1rem;
  color: #61dafb;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #20232a;
  border-radius: 4px;
`;