//1.importer plusieur modules
const path = require('path');
   //importer le compilateur solidity
const solc = require('solc');
//fs fait partie du node library short for file system et nous donne acces au systeme de fichier dans notre ordinateur local
const fs = require('fs-extra');

//2.delete the build folder if it exists
//first get the path of the build dir: __dirname stands for the current dir (ethereum) and build is the directory that is in the ethereum dir
const buildPath = path.resolve(__dirname,'build');
//remove now the dir avec fs 
fs.removeSync(buildPath);

//3.read the 'GestionActeur.sol'  from the 'Contracts' folder
//d'abord get a path of the contracts file
const gestionActeurPath = path.resolve(__dirname, '..', 'contracts', 'GestionActeur.sol');

const gestionActeurSource = fs.readFileSync(gestionActeurPath, 'utf8');




// 4. Configurer l'entrée pour le compilateur Solidity
//specifier le language, sources et outputSelection:
const input = {
    language: 'Solidity',
    sources: {
      'GestionActeur.sol': {
        content: gestionActeurSource,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };


// 5. Compiler les contrats
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;
//on peut commenter le console c juste pour voir le contenu de 'output'
console.log(output);

// 6. Créer le dossier 'build' s'il n'existe pas
fs.ensureDirSync(buildPath);

// 7. Écrire les fichiers JSON compilés dans le dossier 'build'
for (let contractFile in output) {
  for (let contractName in output[contractFile]) {
    const contract = output[contractFile][contractName];
    fs.outputJsonSync(
      path.resolve(buildPath, `${contractName}.json`),
      contract
    );
  }
}

console.log('Compilation terminée. Les fichiers JSON ont été générés dans le dossier "build".');