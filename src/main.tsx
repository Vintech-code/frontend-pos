import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { Routes , Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './assets/css/style.css';
import Dashboard from './pages/dashboard.tsx';
import Login from './pages/login.tsx';
import HomePage from './pages/homepage.tsx';
import Shop from './pages/ShopInformation/Shop.tsx';
import AddProduct from './pages/ShopInformation/AddProduct.tsx';
import Reports from './pages/reports.tsx';
import ProductHistoryArchive from './pages/ShopInformation/ProductHistoryArchive.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/producthistory" element={<ProductHistoryArchive />} />
        <Route path="/reports" element={<Reports/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);