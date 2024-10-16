import React, { useState, useEffect } from 'react';
import TinderCard from '../components/TinderCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getVotePercentages, voteYes, voteNo } from '../utils/web3';

interface Market {
  id: number;
  title: string;
  endDate: string;
  image: string;
  contractAddress: string;
  yesPercentage: number;
  noPercentage: number;
}

const Home: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([
    { id: 1, title: "Will BTC reach $100k by end of 2024?", endDate: "2024-12-31", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", contractAddress: "0x123...", yesPercentage: 0, noPercentage: 0 },
    { id: 2, title: "Will Ethereum 2.0 launch successfully in Q3 2024?", endDate: "2024-09-30", image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", contractAddress: "0x456...", yesPercentage: 0, noPercentage: 0 },
    { id: 3, title: "Will Linea achieve 1 million daily active users by 2025?", endDate: "2024-12-31", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", contractAddress: "0x789...", yesPercentage: 0, noPercentage: 0 },
  ]);

  useEffect(() => {
    const fetchVotePercentages = async () => {
      const updatedMarkets = await Promise.all(
        markets.map(async (market) => {
          const { yesPercentage, noPercentage } = await getVotePercentages(market.contractAddress);
          return { ...market, yesPercentage, noPercentage };
        })
      );
      setMarkets(updatedMarkets);
    };

    fetchVotePercentages();
  }, []);

  const handleSwipe = async (direction: 'left' | 'right', amount: string) => {
    const currentMarket = markets[markets.length - 1];
    console.log(`Swiped ${direction} on market ${currentMarket.id} with amount ${amount} ETH`);
    
    try {
      if (direction === 'right') {
        await voteYes(currentMarket.contractAddress, amount);
      } else {
        await voteNo(currentMarket.contractAddress, amount);
      }
      // Remove the voted market from the list
      setMarkets((prevMarkets) => prevMarkets.slice(0, -1));
    } catch (error) {
      console.error("Error voting:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-linea-primary">Prediction Markets</h1>
      <p className="mb-4 text-linea-text/80 text-center">Swipe right for Yes, left for No</p>
      <div className="relative w-full max-w-sm h-[70vh] sm:h-[80vh]">
        {markets.map((market, index) => (
          <TinderCard
            key={market.id}
            market={market}
            onSwipe={handleSwipe}
          />
        ))}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button 
            className="bg-red-500 text-linea-text p-2 sm:p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
            onClick={() => handleSwipe('left', '0')}
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button 
            className="bg-linea-primary text-linea-background p-2 sm:p-3 rounded-full shadow-lg hover:bg-linea-secondary transition-colors duration-200"
            onClick={() => handleSwipe('right', '0')}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;