import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Terms from './routes/Terms';
import Refund from './routes/Refund';
import Checkout from './components/Checkout';
import CheckoutStudent from './components/CheckoutStudent';
import CheckoutProfessional from './components/CheckoutProfessional';
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
        <Route path="/checkout-student" element={<CheckoutStudent />} />
        <Route path="/checkout-professional" element={<CheckoutProfessional />} />
        <Route path="/eticket" element={<Eticket />} />
        <Route path="/test-payment" element={<TestPayment />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



