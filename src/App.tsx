import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/HomePage';

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
