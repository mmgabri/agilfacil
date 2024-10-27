import styled from 'styled-components';
import { GiPokerHand } from 'react-icons/gi';

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

export const HighlightedText = styled.span`
  font-weight: bold;
  color: #10b981;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0e9e74;
  }
`;

export const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const ServiceItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #fff;
  padding: 7px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const ServiceTitle = styled.h3`
  font-size: 24px;
  color: #10b981;
  margin: 0px 10;
  font-weight: bold;
`;

export const ServiceLink = styled.p`
  font-size: 16px;
  color: #555;
  margin-top: 0;
`;

export const StyledPokerHand = styled(GiPokerHand)`
  width: 60px;
  height: 60px;
  color: #10b981;
  margin-top: 0px;
  margin-bottom: 0px;
`;