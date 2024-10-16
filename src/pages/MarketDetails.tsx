import React from 'react';
import { useParams } from 'react-router-dom';

const MarketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // TODO: Fetch market details from blockchain or API
  const market = {
    id,
    title: "Will BTC reach $100k by end of 2024?",
    description: "This market predicts whether Bitcoin will reach a price of $100,000 USD by December 31, 2024.",
    endDate: "2024-12-31",
    yesPrice: 0.65,
    noPrice: 0.35,
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-linea-primary">{market.title}</h1>
      <p className="text-linea-text/80 mb-6 text-center">{market.description}</p>
      <div className="bg-linea-background/50 border border-linea-primary/20 rounded-lg p-4 sm:p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-linea-primary">Market Information</h2>
        <p className="text-linea-text"><strong>End Date:</strong> {market.endDate}</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-linea-primary">Current Prices</h3>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="bg-linea-primary/10 p-3 rounded-md flex-1 text-center">
              <p className="font-bold text-linea-primary">Yes</p>
              <p className="text-linea-text">{(market.yesPrice * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-md flex-1 text-center">
              <p className="font-bold text-red-500">No</p>
              <p className="text-linea-text">{(market.noPrice * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-linea-background/50 border border-linea-primary/20 rounded-lg p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 text-linea-primary">Place a Prediction</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button className="bg-linea-primary hover:bg-linea-secondary text-linea-background font-bold py-2 px-4 rounded flex-1 transition-colors duration-200">
            Predict Yes
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-linea-text font-bold py-2 px-4 rounded flex-1 transition-colors duration-200">
            Predict No
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketDetails;