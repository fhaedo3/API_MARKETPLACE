// IMPORTS
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';

// VIEWS
import Home from './views/Home/Home.jsx';
import Login from './views/Login/Login.jsx';
import Dashboard from './views/Dashboard/Dashboard.jsx';
import PlayerList from './views/PlayerList/PlayerList.jsx';
import PlayerDetail from './views/PlayerDetail/PlayerDetail.jsx';
import Cart from './views/Cart/Cart.jsx';

// COMPONENTE APP PRINCIPAL
const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />

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

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;