// IMPORTS
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HeaderHome from './components/Header/HeaderHome.jsx';

// VIEWS
import Home from './views/Home/Home.jsx';
import Login from './views/Login/Login.jsx';
import Dashboard from './views/Dashboard/Dashboard.jsx';
import PlayerList from './views/PlayerList/PlayerList.jsx';
import PlayerDetail from './views/PlayerDetail/PlayerDetail.jsx';
import Cart from './views/Cart/Cart.jsx';

const AppContent = () => {
  const location = useLocation();
const path = location.pathname;

let headerComponent = null;
if (path === '/') {
  headerComponent = <HeaderHome />;
} else if (!['/login'].includes(path)) {
  headerComponent = <Header />;
}
  

  return (
    <div className="app">
      {headerComponent}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/player/:id" element={<PlayerDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      {<Footer />}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;