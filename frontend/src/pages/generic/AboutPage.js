import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SuggestionForm from '../components/SuggestionForm'
import Header from '../components/Header';

function AboutPage() {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAbout = () => {
    navigate("/about")
  }

  const handleHome = () => {
    navigate("/")
  }

  const handleOpen = () => {
    setModalOpen(true);
  }


  return (
    <div className="bg-black-custom">
      <Header handleHome={handleHome} handleAbout={handleAbout} handleOpen={handleOpen} />
      <Container>
        <Title>Sobre o AgilFacil</Title>
        <Paragraph>
          O AgilFacil tem o propósito de fornecer ferramentas e recursos que simplificam a implementação de práticas ágeis, como o Planning Poker. O AgilFacil acredita que a agilidade não deve ser um desafio, mas sim uma oportunidade de aprimorar a colaboração e a eficiência nas equipes. Ao promover metodologias como o Planning Poker, o AgilFacil ajuda empresas a alcançar seus objetivos com mais clareza e envolvimento.
        </Paragraph>
        <Paragraph>
          Em um ambiente corporativo cada vez mais dinâmico, onde a agilidade e a colaboração são essenciais para o sucesso, o Planning Poker se destaca como uma ferramenta poderosa. Sua simplicidade não apenas facilita o processo de estimativa, mas também promove um espírito de equipe que é fundamental para alcançar os objetivos comuns. Adotar o Planning Poker, através do suporte do AgilFacil, pode ser um passo significativo para empresas que buscam otimizar seus processos e maximizar a eficácia de suas equipes.
        </Paragraph>
        <Paragraph>A simplicidade do Planning Poker oferece diversos benefícios para empresas e equipes:</Paragraph>
        <List>
          <ListItem><strong>Colaboração Aumentada:</strong> A técnica incentiva a participação de todos, independentemente de seu nível de experiência, criando um ambiente onde cada voz é ouvida.</ListItem>
          <ListItem><strong>Visibilidade e Clareza:</strong> As discussões que cercam cada estimativa ajudam a esclarecer requisitos e expectativas, resultando em uma compreensão mais profunda das tarefas em questão.</ListItem>
          <ListItem><strong>Rapidez e Eficiência:</strong> O formato estruturado do Planning Poker torna o processo de estimativa mais ágil, permitindo que as equipes cheguem a consensos rapidamente, sem prolongar excessivamente as reuniões.</ListItem>
          <ListItem><strong>Engajamento da Equipe:</strong> A natureza lúdica do método, combinada com a simplicidade, mantém os membros da equipe motivados e engajados, tornando a estimativa uma parte prazerosa do processo de planejamento.</ListItem>
          <ListItem><strong>Melhoria Contínua:</strong> A prática regular do Planning Poker permite que as equipes ajustem suas estimativas com o tempo, aprendendo com as experiências anteriores e melhorando sua precisão.</ListItem>
        </List>
      </Container>
      {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
    </div>
  );

}

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


export default AboutPage