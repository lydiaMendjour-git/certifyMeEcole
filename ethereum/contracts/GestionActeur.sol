// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GestionActeur {
    /*-------------------PARTIE ETABLISSEMENT---------------------------------------*/
    //Enumeration pour les types d'etablissement
    enum DiplomaType { Universite, EcolePrivee, EcoleProfessionnelle }    

   //Structure pour stocke les informations d'établissement
    struct Etablissement {
        string name;
        address ethAddress;
        DiplomaType etabType; 
        bool isValid;
    }

    // Mapping pour stocker les établissements validés
    mapping(address => Etablissement) public etablissementsValides;
    //le validateur qui gere les approvers
    address public validator;

    //Structure pour stocke les informations de l'approver
       struct Approver {
        string nameApp;
        address approverAddress;
        DiplomaType typeApp;
        bool isApprover;
        }

    mapping (address => Approver) public approvers;

    // Events pour suivre les changements
    event EtablissementAjoute(address indexed etablissement, string name, DiplomaType etabType);
    event EtablissementRevoque(address indexed etablissement);

    // Constructeur : initialise l'owner du smart contract
    constructor() {
        validator = msg.sender;
    }

    // Modificateur pour s'assurer que seul le validateur peut modifier les approvers
    modifier onlyValidator() {
        require(msg.sender == validator, "Seul le validateur peut enregistrer un approver.");
        _;
    }
    
    // Modificateur pour s'assurer que seul l'approver peut modifier les établissements
        modifier onlyApprover() {
        require(approvers[msg.sender].isApprover, "Seul l'approver peut enregistrer une universite.");
        _;
    }

    /*--------------------------Definir les methodes-----------------------*/

//Methodes pour la gestion des approvers
//ajouter un approver dans le mapping
    function addApprover(        
        string memory _nameApp,
        address _approverAddress,
        DiplomaType _typeApp
        ) public onlyValidator {
        require(_approverAddress != address(0), "Adresse invalide.");
        Approver storage a = approvers[_approverAddress];
        a.nameApp =_nameApp;
        a.approverAddress = _approverAddress;
        a.typeApp = _typeApp;
        a.isApprover = true;
    }  

//retirer un approver du mapping
    function removeApprover(address _approverAddress) public onlyValidator {
        require(approvers[_approverAddress].isApprover, "L'approver demande n'existe pas.");
        delete approvers[_approverAddress];
    }

    function isApproverValid(address _approver) public view returns (bool) {
    return approvers[_approver].isApprover;
}


//retourner le type de l'approver
    function getApproverType(address _approverAddress) public view returns (DiplomaType) {
        return approvers[_approverAddress].typeApp;
    }

//Methodes pour la gestion des etablissements
    // Ajout d'un établissement valide
    function addEtablissementValid(string memory _name, address _etablissementAddress, DiplomaType _etabType) public onlyApprover {
        require(_etablissementAddress != address(0), "Adresse invalide.");
        require(!etablissementsValides[_etablissementAddress].isValid, "L'etablissement est deja valide.");
        
        etablissementsValides[_etablissementAddress] = Etablissement(_name, _etablissementAddress, _etabType, true);

        // Émettre un événement pour informer qu'un établissement a été ajouté
        emit EtablissementAjoute(_etablissementAddress, _name, _etabType);
    }
        
    // Révoquer un établissement
    function revokeEtablissement(address etablissement) public onlyApprover {
        require(etablissement != address(0), "Adresse invalide.");
        require(etablissementsValides[etablissement].isValid, "L'etablissement n'est pas enregistre ou deja invalide.");
        etablissementsValides[etablissement].isValid=false;
    
        // Émettre un événement pour informer qu'un établissement a été révoqué
        emit EtablissementRevoque(etablissement);
    }

function isEtablissementValid(address _etablissement) public view returns (bool) {
    return etablissementsValides[_etablissement].isValid;
}

function getEtablissementType(address _etablissement) public view returns (DiplomaType) {
    return etablissementsValides[_etablissement].etabType;
}

}