import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useSwipeable } from 'react-swipeable';
import { web3 } from '../utils/web3';

interface Market {
  id: number;
  title: string;
  endDate: string;
  image: string;
  yesPercentage: number;
  noPercentage: number;
  contractAddress: string;
}

interface TinderCardProps {
  market: Market;
  onSwipe: (direction: 'left' | 'right', amount: string) => void;
}

const TinderCard: React.FC<TinderCardProps> = ({ market, onSwipe }) => {
  const [{ x, rot }, api] = useSpring(() => ({ x: 0, rot: 0 }));
  const [betAmount, setBetAmount] = useState('0');
  const [maxBalance, setMaxBalance] = useState('0');

  useEffect(() => {
    const fetchBalance = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          const balance = await web3.eth.getBalance(accounts[0]);
          setMaxBalance(web3.utils.fromWei(balance, 'ether'));
        }
      }
    };
    fetchBalance();
  }, []);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      api.start({ x: e.deltaX, rot: e.deltaX / 5 });
    },
    onSwipedLeft: () => onSwipe('left', betAmount),
    onSwipedRight: () => onSwipe('right', betAmount),
    onSwiped: () => {
      api.start({ x: 0, rot: 0 });
    },
    trackMouse: true,
    trackTouch: true,
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  return (
    <animated.div
      {...handlers}
      style={{
        transform: x.to((x) => `translateX(${x}px) rotate(${rot.get()}deg)`),
      }}
      className="absolute w-full h-full"
    >
      <div
        className="w-full h-full rounded-2xl shadow-md overflow-hidden border-2 border-linea-primary flex flex-col"
        style={{
          backgroundImage: `url(${market.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex-grow"></div>
        <div className="bg-gradient-to-t from-linea-background to-transparent p-4 sm:p-6 text-linea-text">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-linea-primary">{market.title}</h2>
          <p className="text-sm sm:text-base mb-2">Ends on: {market.endDate}</p>
          <div className="flex justify-between text-sm sm:text-base mb-4">
            <span className="text-red-500">No: {market.noPercentage}%</span>
            <span className="text-linea-primary">Yes: {market.yesPercentage}%</span>
          </div>
          <div className="mb-2">
            <label htmlFor="betAmount" className="block text-sm font-medium text-linea-text mb-1">
              Bet Amount (ETH): {betAmount}
            </label>
            <input
              type="range"
              id="betAmount"
              name="betAmount"
              min="0"
              max={maxBalance}
              step="0.01"
              value={betAmount}
              onChange={handleSliderChange}
              className="w-full h-2 bg-linea-primary rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs">
            <span>0 ETH</span>
            <span>{maxBalance} ETH</span>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default TinderCard;