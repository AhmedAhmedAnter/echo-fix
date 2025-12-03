import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import GlobalStyles from './components/GlobalStyles';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Chat from './pages/Chat';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

// Main App Layout
function AppLayout() {
  const { notification } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {notification && (
          <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 animate-fade-in flex items-center gap-3 font-bold ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'
            } text-white`}>
            {notification.type === 'error' ? <X size={18} /> : <CheckCircle size={18} />}
            {notification.msg}
          </div>
        )}
        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <AppProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}