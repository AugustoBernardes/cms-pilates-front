import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/HomePage';
import Clients from './pages/ClientsPage';
import ViewClient from './pages/ViewClientPage';
import EditClientPage from './pages/EditClientPage';
import AddClientPage from './pages/AddClientPage';
import MonthsListPage from './pages/ListMonthsPages';
import MonthInvoicesPage from './pages/MonthInvoicesPages';
import PendingInvoicesPage from './pages/PendingInvoicesPage';

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
        <Route path="/months" element={
          <ProtectedRoute>
            <MonthsListPage />
          </ProtectedRoute>
        } />
        <Route path="/months/:monthId" element={ 
        <ProtectedRoute>
          <MonthInvoicesPage />
        </ProtectedRoute> 
        } />
        <Route path="/pending-invoices" element={ 
        <ProtectedRoute>
          <PendingInvoicesPage />
        </ProtectedRoute> 
        } />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
