import React, { useEffect, useState } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate, useLocation } from 'react-router-dom'
import styled from "styled-components";

const users = [
  { name: "John Doe", email: "john@gmail.com", age: 34 },
  { name: "David Smith", email: "david@yahoo.com", age: 29 },
  { name: "Alice Johnson", email: "alice@gmail.com", age: 40 },
];

const GeneratePDF = () => {
  const location = useLocation();
  const [boardData, setBoardData] = useState({ columns: [] });
  const [userLoggedData, setuserLoggedData] = useState({});

  useEffect(() => {
    console.log('useEffect', location.state)
    setBoardData(location.state.board);
    setuserLoggedData(location.state.userLoggedData);



  }, []);


  const generatePDF = () => {
    const doc = new jsPDF();
  
    // 🟣 Definir cor de fundo (exemplo: roxo)
    doc.setFillColor(50, 50, 50); // RGB (50, 50, 50) - Cinza escuro
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F"); // "F" = Fill
  
    // 📌 Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // Texto branco para contraste
    doc.text("Board de Retrospectiva", 14, 10);
  
    // 🔄 Cabeçalhos e Linhas
    const columns = boardData.columns.map(col => col.title);
    const maxRows = Math.max(...boardData.columns.map(col => col.cards.length));
    const rows = Array.from({ length: maxRows }).map((_, rowIndex) =>
      boardData.columns.map(column => column.cards[rowIndex]?.content || "")
    );
  
    // 🏗️ Criar tabela
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 4, textColor: [0, 0, 0] }, // Texto preto nos dados
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Cabeçalho branco com texto preto
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Alternar cor das linhas
    });
  
    // 📄 Salvar PDF
    doc.save("board-retrospectiva.pdf");
  };
  
  

  return (
    <Container>
      <Title>Gerar PDF com Tabela</Title>
      <Table>
        <thead>
          <tr>
            {boardData.columns.map((column, index) => (
              <Th key={index}>{column.title}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(...boardData.columns.map(col => col.cards.length)) }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {boardData.columns.map((column, colIndex) => (
                <Td key={colIndex}>
                  {column.cards[rowIndex] ? column.cards[rowIndex].content : ""}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={generatePDF}>Baixar PDF</Button>
    </Container>
  );
};

// Estilização com Styled Components
const Container = styled.div`
  text-align: center;
  margin: 40px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #2c3e50;
  color: white;
  padding: 10px;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #219150;
  }
`;

export default GeneratePDF;
