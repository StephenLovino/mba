import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Checkout from './routes/Checkout';
import Eticket from './routes/Eticket';
import TestPayment from './routes/TestPayment';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/eticket" element={<Eticket />} />
        <Route path="/test-payment" element={<TestPayment />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



