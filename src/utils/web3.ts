import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import PredictionMarketABI from '../contracts/PredictionMarket.json';

let web3: Web3;

export const initWeb3 = async () => {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error("User denied account access");
    }
  } else {
    console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
    web3 = new Web3('https://rpc.linea.build');
  }
};

export const deployPredictionMarket = async (question: string, duration: number) => {
  const accounts = await web3.eth.getAccounts();
  const predictionMarketContract = new web3.eth.Contract(PredictionMarketABI.abi as AbiItem[]);

  const deployedContract = await predictionMarketContract
    .deploy({
      data: PredictionMarketABI.bytecode,
      arguments: [question, duration],
    })
    .send({
      from: accounts[0],
      gas: 2000000,
    });

  return deployedContract.options.address;
};

export const getPredictionMarketContract = (address: string) => {
  return new web3.eth.Contract(PredictionMarketABI.abi as AbiItem[], address);
};

export const voteYes = async (contractAddress: string, amount: string) => {
  const accounts = await web3.eth.getAccounts();
  const contract = getPredictionMarketContract(contractAddress);
  await contract.methods.voteYes().send({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') });
};

export const voteNo = async (contractAddress: string, amount: string) => {
  const accounts = await web3.eth.getAccounts();
  const contract = getPredictionMarketContract(contractAddress);
  await contract.methods.voteNo().send({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') });
};

export const getVotePercentages = async (contractAddress: string) => {
  const contract = getPredictionMarketContract(contractAddress);
  const result = await contract.methods.getVotePercentages().call();
  return {
    yesPercentage: parseInt(result.yesPercentage),
    noPercentage: parseInt(result.noPercentage),
  };
};

export { web3 };