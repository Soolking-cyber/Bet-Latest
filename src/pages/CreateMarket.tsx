import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deployPredictionMarket } from '../utils/web3';

const CreateMarket: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const duration = Math.floor((new Date(endDate).getTime() - Date.now()) / 1000);
      const contractAddress = await deployPredictionMarket(title, duration);
      console.log('Market created:', { title, description, endDate, contractAddress });
      navigate('/');
    } catch (error) {
      console.error('Error creating market:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-linea-primary">Create a New Prediction Market</h1>
      <form onSubmit={handleSubmit} className="bg-linea-background/50 border border-linea-primary/20 rounded-lg px-4 sm:px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-linea-text text-sm font-bold mb-2" htmlFor="title">
            Market Title
          </label>
          <input
            className="shadow appearance-none border border-linea-primary/20 rounded w-full py-2 px-3 text-linea-text bg-linea-background/50 leading-tight focus:outline-none focus:border-linea-primary"
            id="title"
            type="text"
            placeholder="Enter market title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-linea-text text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border border-linea-primary/20 rounded w-full py-2 px-3 text-linea-text bg-linea-background/50 leading-tight focus:outline-none focus:border-linea-primary"
            id="description"
            placeholder="Enter market description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-linea-text text-sm font-bold mb-2" htmlFor="endDate">
            End Date
          </label>
          <input
            className="shadow appearance-none border border-linea-primary/20 rounded w-full py-2 px-3 text-linea-text bg-linea-background/50 leading-tight focus:outline-none focus:border-linea-primary"
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-linea-primary hover:bg-linea-secondary text-linea-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto transition-colors duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Market'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMarket;