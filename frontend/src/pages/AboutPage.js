import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuggestionForm from './components/SuggestionForm'
import "../styles/Home.css"
import Header from './components/Header';
import {
  Container,
  Title,
  Paragraph,
  List,
  ListItem
} from '../styles/AboutPageStyles';



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
export default AboutPage