import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/HomePage';
import Clients from './pages/ClientsPage';
import ViewClient from './pages/ViewClientPage';
import EditClientPage from './pages/EditClientPage';

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={ <Login />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route path="/clients/:id/edit" element={<EditClientPage />} />
        <Route path="/clients/:id" element={<ViewClient />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
