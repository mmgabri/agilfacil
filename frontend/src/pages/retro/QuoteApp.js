import React, { useState } from "react";
import { createUseStyles } from "react-jss"; // Biblioteca para criar estilos CSS usando JSS
import { colors } from "@atlaskit/theme"; // Fornece cores do tema Atlassian
import { DragDropContext } from "react-beautiful-dnd"; // Componente de contexto para gerenciar drag-and-drop
import QuoteList from "./QuoteList"; // Componente que renderiza uma lista de itens (quotes)
import { reorderQuoteMap } from "./Reorder"; // Função que reordena os itens após o movimento

// Definição de estilos usando JSS
const useStyles = createUseStyles({
  root: {
    backgroundColor: colors.B200, // Cor de fundo do container principal
    boxSizing: "border-box", // Ajusta como largura/altura são calculadas
    padding: 16, // Espaçamento interno do container
    minHeight: "100vh", // Altura mínima da tela
    display: "flex", // Define layout flexível
    justifyContent: "center", // Centraliza os elementos horizontalmente
    alignItems: "flex-start" // Alinha os elementos no topo verticalmente
  },
  column: {
    margin: "0 8px" // Margem horizontal entre as colunas
  }
});

// Componente principal
const QuoteApp = (props) => {
  const { initial, isCombineEnabled } = props; // Propriedades recebidas
  const [quoteMap, setQuoteMap] = useState(initial); // Estado para armazenar as listas de quotes

  const cl = useStyles(); // Gera as classes de estilo definidas acima

  // Função chamada ao soltar um item arrastado
  const onDragEnd = (result) => {
    const { source, destination, combine } = result;

    // Caso o item tenha sido solto em um destino válido
    if (destination) {
      console.log('Reordena')
      // Reordena os itens na lista com base na origem e no destino
      const updatedQuoteMap = reorderQuoteMap({
        quoteMap,
        source,
        destination
      });
      setQuoteMap(updatedQuoteMap); // Atualiza o estado com as listas reordenadas
    }
    // Caso o item tenha sido combinado com outro
    else if (combine) {
      console.log('combinou')
      // Verifica se o item foi combinado com algo da mesma lista

      if (combine.droppableId != source.droppableId) {

        // Copia os itens da origem e do destino para manipulação
        const sourceQuotes = [...quoteMap[source.droppableId]];
        console.log('sourceQuotes ==>', sourceQuotes)
        const combineQuotes = [...quoteMap[combine.droppableId]];
        console.log('combineQuotes ==>', combineQuotes)
        console.log('source.index ==>', source.index)

        // Remove o item da origem
        const sourceQuote = sourceQuotes[source.index];
        sourceQuotes.splice(source.index, 1);

        // Localiza o item com o qual foi combinado
        const combineQuoteIndex = combineQuotes.findIndex(
          (x) => x.id === combine.draggableId
        );
        const combineQuote = combineQuotes[combineQuoteIndex];

        // Atualiza o conteúdo do item combinado, concatenando os textos
        combineQuotes[combineQuoteIndex] = {
          ...combineQuote,
          content: `${combineQuote.content} ${sourceQuote.content}`
        };


        // Atualiza o mapa de listas com as novas versões das listas alteradas
        const updatedQuoteMap = {
          ...quoteMap,
          [source.droppableId]: sourceQuotes,
          [combine.droppableId]: combineQuotes
        };

        setQuoteMap(updatedQuoteMap); // Atualiza o estado
      } else {
        // Copia os itens da origem e do destino para manipulação
        const sourceQuotes = [...quoteMap[source.droppableId]];
        console.log('sourceQuotes ==>', sourceQuotes)
        const combineQuotes = [...quoteMap[combine.droppableId]];
        console.log('combineQuotes ==>', combineQuotes)
        console.log('source.index ==>', source.index)

        const sourceQuote = combineQuotes[source.index];


        // Remove o item da origem e destino
        combineQuotes.splice(source.index, 1);
        sourceQuotes.splice(source.index, 1);

        // Localiza o item com o qual foi combinado
        const combineQuoteIndex = combineQuotes.findIndex(
          (x) => x.id === combine.draggableId
        );
        const combineQuote = combineQuotes[combineQuoteIndex];


        // Atualiza o conteúdo do item combinado, concatenando os textos
        combineQuotes[combineQuoteIndex] = {
          ...combineQuote,
          content: `${combineQuote.content} ${sourceQuote.content}`
        };


        // Atualiza o mapa de listas com as novas versões das listas alteradas
        const updatedQuoteMap = {
          ...quoteMap,
          [source.droppableId]: combineQuotes,
          [combine.droppableId]: combineQuotes
        };

        setQuoteMap(updatedQuoteMap); // Atualiza o estado
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={cl.root}>
        {/* Coluna 1 */}
        <div className={cl.column}>
          <QuoteList
            title="alpha" // Título da lista
            listId="alpha" // Identificador único da lista
            listType="card" // Tipo da lista
            quotes={quoteMap.alpha} // Itens pertencentes à lista "alpha"
            isCombineEnabled={isCombineEnabled} // Habilita ou desabilita combinações
          />
        </div>
        {/* Coluna 2 */}
        <div className={cl.column}>
          <QuoteList
            title="beta" // Título da lista
            listId="beta" // Identificador único da lista
            listType="card" // Tipo da lista
            quotes={quoteMap.beta} // Itens pertencentes à lista "beta"
            isCombineEnabled={isCombineEnabled} // Descomentável se necessário
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default QuoteApp;
