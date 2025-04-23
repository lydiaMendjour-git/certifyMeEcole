import Web3 from 'web3'; // ou const Web3 = require('web3') si tu utilises CommonJS

const provider = new Web3.providers.HttpProvider(
  'https://sepolia.infura.io/v3/e408e54ff9c84e699ea382c9fddd418c'
);

const web3 = new Web3(provider);

export default web3; // si tu es en ESM
