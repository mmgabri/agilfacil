import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import SuggestionForm from './components/SuggestionForm'
import {
  Container,
  Title,
  Paragraph,
  ServiceList,
  ServiceItem,
  ServiceLink,
  ServiceTitle,
  StyledPokerHand,
  HighlightedText,
  StyledAiFillLike,
  StyledAiFillDislike,
  IconContainer
} from '../styles/HomePageStyles';

const HomePage = () => {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAbout = () => {
    navigate("/about")
  }

  const handleHome = () => {
    navigate("/")
  }

  const handleHomePlanning = () => {
    navigate("/planning")
  }

  const handleHomeRetro = () => {
    navigate("/retro")
  }

  const handleOpen = () => {
    setModalOpen(true);
  }

  return (
    <div className="bg-black-custom">
      <Header handleHome={handleHome} handleAbout={handleAbout} handleOpen={handleOpen} />
      <Container>
        <Title>Serviços Disponíveis</Title>
        <Paragraph>
          No momento, o AgilFacil oferece a funcionalidade de <HighlightedText onClick={handleHomePlanning}>Planning Poker</HighlightedText> para equipes que desejam aprimorar suas estimativas e promover uma colaboração eficiente.
        </Paragraph>
        <Paragraph>Mais serviços e funcionalidades estão a caminho. Acompanhe nosso site para ficar por dentro das novidades e futuras funcionalidades que irão transformar a gestão de projetos ágeis.
        </Paragraph>

        <ServiceList>
          <ServiceItem onClick={handleHomePlanning}>
            <StyledPokerHand />
            <ServiceTitle>Planning Poker</ServiceTitle> {/* Título destacado */}
            <ServiceLink>Estime suas histórias de forma colaborativa e eficaz.</ServiceLink> {/* Descrição */}
          </ServiceItem>
          <ServiceItem onClick={handleHomeRetro}>
            <IconContainer>
              <StyledAiFillDislike />
              <StyledAiFillLike />
            </IconContainer>
            <ServiceTitle>Retro Agil</ServiceTitle> {/* Título destacado */}
            <ServiceLink>Reflexão e melhoria com retrospectiva ágil.</ServiceLink> {/* Descrição */}
          </ServiceItem>

        </ServiceList>
      </Container>

      {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}

    </div>
  );
};

export default HomePage;
