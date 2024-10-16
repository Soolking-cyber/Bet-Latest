import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Menu, X, Wallet } from 'lucide-react';
import { web3 } from '../utils/web3';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet to connect.');
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-linea-background border-b border-linea-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-linea-primary">
            <TrendingUp size={24} />
            <span>Linea Predictions</span>
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden sm:block">
              <ul className="flex space-x-4">
                <li><Link to="/" className="text-linea-text hover:text-linea-primary transition-colors">Home</Link></li>
                <li><Link to="/create" className="text-linea-text hover:text-linea-primary transition-colors">Create Market</Link></li>
              </ul>
            </nav>
            <button
              onClick={walletAddress ? undefined : connectWallet}
              className="flex items-center space-x-2 bg-linea-primary text-linea-background px-3 py-2 rounded-full text-sm font-medium hover:bg-linea-secondary transition-colors duration-200"
            >
              <Wallet size={16} />
              <span>{walletAddress ? truncateAddress(walletAddress) : 'Connect Wallet'}</span>
            </button>
            <button
              className="sm:hidden text-linea-text"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 sm:hidden">
            <ul className="flex flex-col space-y-2">
              <li><Link to="/" className="block py-2 text-linea-text hover:text-linea-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link to="/create" className="block py-2 text-linea-text hover:text-linea-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Create Market</Link></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;