import web3 from './web3';
//get the abi from .json
import GestionDiplome from './build/GestionDiplome.json';

const instance = new web3.eth.Contract(
	GestionDiplome.abi,
    '0xb6a8f4a28026F741c3B235D09b758cA513d8d755'

);

export default instance;