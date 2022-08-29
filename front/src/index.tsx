import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import PlanningPoker from './page/planning-poker/PlanningPoker';
import axios from 'axios';
import JoinGame from './page/join/JoinGame';

axios.defaults.baseURL =  process.env.NODE_ENV.toLowerCase() === 'production' ? process.env.REACT_APP_API_URL : 'http://localhost:3002/';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="planning/:game/:player" element={<PlanningPoker />} />
      <Route path="join/:game" element={<JoinGame />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
