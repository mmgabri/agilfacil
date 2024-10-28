import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 1px auto;
  padding: 30px;
  background-color: #1C1C1C; 
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;


export const Title = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
  color: #C0C0C0;
`;

export const Paragraph = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: #C0C0C0;
  margin-bottom: 20px;
`;

export const List = styled.ul`
  margin-top: 20px;
  padding-left: 20px;
`;

export const ListItem = styled.li`
  margin-bottom: 10px;
  font-size: 18px;
  color: #C0C0C0;
  font-weight: 500;
`;
