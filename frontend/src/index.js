import React from 'react';
import { createRoot } from 'react-dom/client'; // Importando createRoot
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';
import App from '../src/main/App';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root')); // Criando o root
root.render(<App />); // Renderizando o componente App

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

