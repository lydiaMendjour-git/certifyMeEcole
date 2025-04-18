import web3 from './web3';
//get the abi from .json
import GestionActeur from './build/GestionActeur.json';

const instance = new web3.eth.Contract(
	GestionActeur.abi,
    '0x6198F0494c06e639D5DC1064D87F616F18696045'

);

export default instance;