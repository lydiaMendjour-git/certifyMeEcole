const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledGestionActeur = require('../ethereum/build/GestionActeur.json');
const compiledGestionDiplome = require('../ethereum/build/GestionDiplome.json');

const provider = new HDWalletProvider(
  /*'REPLACE_WITH_YOUR_MNEMONIC',
  // remember to change this to your own phrase!
  'REPLACE WITH YOUR INFURA URL'
  // remember to change this to your own endpoint!*/
  
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);


      //get the abi of the compiled GestionActeur contract and deploy it and send that transaction of deployment
      gestionActeur = await new web3.eth.Contract(compiledGestionActeur.abi)
      .deploy({data:compiledGestionActeur.evm.bytecode.object})
      .send({from: accounts[0], gas:'1400000'});
     
      
        // Déployer le contrat GestionDiplome avec l'adresse de GestionActeur
        gestionDiplome = await new web3.eth.Contract(compiledGestionDiplome.abi)
        .deploy({
        data: compiledGestionDiplome.evm.bytecode.object,
        arguments: [gestionActeur.options.address], // Passer l'adresse de GestionActeur
        })
       .send({ from: accounts[0], gas: '2000000' });

  console.log("Contract gestionActeur deployed to", gestionActeur.options.address);
  console.log("Contract gestionDiplome deployed to", gestionDiplome.options.address);
  provider.engine.stop();
};
deploy();
