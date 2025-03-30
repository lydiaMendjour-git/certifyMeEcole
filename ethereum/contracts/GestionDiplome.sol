// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./GestionActeur.sol";
contract GestionDiplome {
    //Definir la structure du diplome
        struct Diploma {
        string diplomaHash;
        string etablissement;
        string studentName;
        string birthDate;
        string diplomaTitle;
        GestionActeur.DiplomaType diplomaType;
        string dateOfIssue;
        string speciality;
        bool complete;
    }
    // Mapping pour stocker les diplômes en fonction de leur hash
    mapping(string => Diploma) private diplomas;
    //instance du smart contract GestionActeur
    GestionActeur public gestionActeur;

    event ApprovedDiploma(address indexed approver, string indexed diplomaHash);

    constructor(address _gestionActeurDeploye){
        gestionActeur= GestionActeur(_gestionActeurDeploye);  
    }


        function createDiploma(
        string memory _diplomaHash,
        string memory _etablissement,
        string memory _studentName,
        string memory _birthDate,
        string memory _diplomaTitle,
        GestionActeur.DiplomaType _diplomaType,
        string memory _dateOfIssue,
        string memory _speciality
    ) public {
        require(gestionActeur.isEtablissementValid(msg.sender),"Vous n'etes pas autoriser a creer des diplomes");
        require(  gestionActeur.getEtablissementType(msg.sender)  == _diplomaType, "Vous n'avez pas le droit d'enregistrer ce diplome: probleme de type de diplome");
        Diploma memory newDiploma = Diploma(_diplomaHash, _etablissement, _studentName, _birthDate, _diplomaTitle,_diplomaType, _dateOfIssue, _speciality, false);
        diplomas[_diplomaHash] = newDiploma;
    }

    function approveDiploma(string memory diplomaHash) public {
    require(gestionActeur.isApproverValid(msg.sender), "Vous n'avez pas le droit d'approver ce diplome.");
     // Vérifier que le diplôme existe
    require(bytes(diplomas[diplomaHash].diplomaHash).length != 0, "Le diplome n'existe pas.");
    Diploma storage d = diplomas[diplomaHash];
    require (gestionActeur.getApproverType(msg.sender) == d.diplomaType, "Le type de l'approver ne correspond pas au type du diplome.");
    require(!diplomas[diplomaHash].complete,"Le diplome est deja valide");
    d.complete = true;
    // Envoyer un événement pour informer les approveurs qu'un diplôme a été approuvé
    emit ApprovedDiploma(msg.sender, diplomaHash);
}

    function getDiplome(string memory diplomaHash) public view returns (Diploma memory) {
        // Vérifie si le diplôme existe
        require(bytes(diplomas[diplomaHash].diplomaHash).length != 0, "Le diplome n'existe pas.");
        Diploma memory diploma = diplomas[diplomaHash];
        require(diploma.complete, "Le diplome n'est pas pas encore valide");
        return diploma;
    }
}