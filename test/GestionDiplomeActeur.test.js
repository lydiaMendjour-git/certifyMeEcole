//1. Les module
const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

const web3 = new Web3(ganache.provider());
//2.get the compiled contracts
const compiledGestionActeur = require('../ethereum/build/GestionActeur.json');
const compiledGestionDiplome = require('../ethereum/build/GestionDiplome.json');

let accounts;
let gestionActeur;
let gestionDiplome;
beforeEach(async()=>{
    //ici je vais avoir tous les compte ganache pour pouvoir les manipuler
      accounts = await web3.eth.getAccounts();
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
});

// 3. Tests
describe('GestionDiplome', () => {
    it('déploie les contrats GestionActeur et GestionDiplome', () => {
      assert.ok(gestionActeur.options.address); // Vérifie que GestionActeur est déployé
      assert.ok(gestionDiplome.options.address); // Vérifie que GestionDiplome est déployé
    });
    //confirmer que la personne qui creer GestionActeur is the validator
    it('Confirmer l\'addresse du validateur',async()=>{
    const validator= await gestionActeur.methods.validator().call();
    assert.equal(accounts[0],validator);
  });
  //ajouter le minister a la liste des approvers
  it('Ajout approver par le validateur',async()=>{
    await gestionActeur.methods.addApprover('Ministere de l\'enseignement et de la recherche scientifique',accounts[0],0)
    .send({      
      from: accounts[0],
      gas: '1400000'});

      const approver = await gestionActeur.methods.approvers(accounts[0]).call();
      console.log('structure approver',approver);
       // Vérifier que l'approver a bien été ajouté
       assert.equal(
        approver.nameApp,
        'Ministere de l\'enseignement et de la recherche scientifique',
        "Le nom de l'approver ne correspond pas"
    );
  });

});