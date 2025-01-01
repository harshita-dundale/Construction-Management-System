import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


// import '@syncfusion/ej2-react-charts/styles/material.css';
// import '@syncfusion/ej2-react-charts/styles/bootstrap.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
