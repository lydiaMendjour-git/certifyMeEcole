const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledGestionActeur = require('../build/GestionActeur.json');

const provider = new HDWalletProvider(
  'route ten method canoe spend used rapid notable creek toilet income pretty',
  'https://sepolia.infura.io/v3/a2bfd5b758a44a01bd76667d74a0aefb'
  
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);


      //get the abi of the compiled GestionActeur contract and deploy it and send that transaction of deployment
      gestionActeur = await new web3.eth.Contract(compiledGestionActeur.abi)
      .deploy({data:compiledGestionActeur.evm.bytecode.object})
      .send({from: accounts[0], gas:'1400000'});
     
  console.log("Contract gestionActeur deployed to", gestionActeur.options.address);
  provider.engine.stop();
};
deploy();


/*const { Web3 } = require('web3');
const compiledGestionActeur = require('../build/GestionActeur.json');

// Connexion à ton nœud Hyperledger Besu en local ou via RPC privé
const web3 = new Web3('http://localhost:8545'); // Ou IP d’un autre nœud privé

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('🔧 Tentative de déploiement depuis le compte :', accounts[0]);

  try {
    const gestionActeur = await new web3.eth.Contract(compiledGestionActeur.abi)
      .deploy({ data: compiledGestionActeur.evm.bytecode.object })
      .send({
        from: accounts[0],
        gas: 1400000 // Ajuste selon ton genesis.json
      });

    console.log("✅ Contrat déployé à l'adresse :", gestionActeur.options.address);
  } catch (err) {
    console.error("❌ Erreur de déploiement :", err);
  }
};

deploy();*/

