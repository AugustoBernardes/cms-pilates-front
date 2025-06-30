import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/HomePage';
import Clients from './pages/ClientsPage';
import ViewClient from './pages/ViewClientPage';
import EditClientPage from './pages/EditClientPage';
import AddClientPage from './pages/AddClientPage';

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
        <Route path="/clients/:id/edit" element={
           <ProtectedRoute> 
            <EditClientPage />
           </ProtectedRoute>
         } />
        <Route path="/clients/:id" element={
          <ProtectedRoute>
            <ViewClient />
          </ProtectedRoute>
        } />
        <Route path="/clients/create" element={
          <ProtectedRoute>
            <AddClientPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
