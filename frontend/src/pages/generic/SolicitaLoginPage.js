import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../generic/HeaderPages';

function SolicitaLoginPage() {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-black-custom">
      <Header goHome={() => navigate("/")} goAbout={() => navigate("/about") } handleOpen={() => setModalOpen(true)} />
        <p>redirect to login</p>
    </div>
  );

}

export default SolicitaLoginPage