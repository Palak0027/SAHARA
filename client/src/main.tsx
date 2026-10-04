import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/index.css";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
 
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container element #root not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
      
    
   
  </React.StrictMode>
);
