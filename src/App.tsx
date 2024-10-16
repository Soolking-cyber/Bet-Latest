import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateMarket from './pages/CreateMarket';
import MarketDetails from './pages/MarketDetails';
import { initWeb3 } from './utils/web3';

function App() {
  useEffect(() => {
    initWeb3();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-linea-background flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-4 sm:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMarket />} />
            <Route path="/market/:id" element={<MarketDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;