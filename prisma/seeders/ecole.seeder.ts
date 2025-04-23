import { PrismaClient, RoleEcole } from '@prisma/client'

export default async function ecolesSeeder(prisma: PrismaClient) {
  await prisma.ecole_OFFICIAL.createMany({
    data: [
      // === PRIVÉES ===
      {
        nomEcole: "Ecole Supérieure d’Hôtellerie et de Restauration d’Alger (ESHRA)",
        telephoneEcole: "023456789",
        emailEcole: "certifymeecole1@gmail.com",
        role: RoleEcole.PRIVEE
      },
      {
        nomEcole: "Institut de Management d’Alger (IMA)",
        telephoneEcole: "023456781",
        emailEcole: "certifymeecole2@gmail.com",
        role: RoleEcole.PRIVEE
      },
      {
        nomEcole: "Ecole de Management de Tizi-Ouzou (EMTO)",
        telephoneEcole: "026123456",
        emailEcole: "certifymeecole3@gmail.com",
        role: RoleEcole.PRIVEE
      },
      {
        nomEcole: "Institut Supérieur des Sciences (ISS)",
        telephoneEcole: "023987654",
        emailEcole: "iss@algerie.edu.dz",
        role: RoleEcole.PRIVEE
      },
      {
        nomEcole: "Ecole Supérieure de Management d’Oran (ESMO)",
        telephoneEcole: "0415671234",
        emailEcole: "esmo@algerie.edu.dz",
        role: RoleEcole.PRIVEE
      },

      // === FORMATION ===
      {
        nomEcole: "Ecole de Formation en Techniques de Gestion (EFTG)",
        telephoneEcole: "0550123456",
        emailEcole: "eftg@algerie.edu.dz",
        role: RoleEcole.FORMATION
      },
      {
        nomEcole: "Institut de Formation d’Assurances et de Gestion (IFAG)",
        telephoneEcole: "0560987654",
        emailEcole: "ifag@algerie.edu.dz",
        role: RoleEcole.FORMATION
      },
      {
        nomEcole: "Centre International de Formation et de Perfectionnement (CIFOP)",
        telephoneEcole: "0552233445",
        emailEcole: "cifop@algerie.edu.dz",
        role: RoleEcole.FORMATION
      },
      {
        nomEcole: "Centre de Formation et de Conseil Professionnel (CFCP)",
        telephoneEcole: "0566778899",
        emailEcole: "cfcp@algerie.edu.dz",
        role: RoleEcole.FORMATION
      },

      // === PROFESSIONNELLES ===
      {
        nomEcole: "CFPA BIR EL DJIR",
        telephoneEcole: "0415678912",
        emailEcole: "cfpa.bireldjir@formation.dz",
        role: RoleEcole.PROFESSIONNEL
      },
      {
        nomEcole: "CFPA EL KARMA",
        telephoneEcole: "0415678923",
        emailEcole: "cfpa.elkarma@formation.dz",
        role: RoleEcole.PROFESSIONNEL
      },
      {
        nomEcole: "Etablissement Business Leads Algeria",
        telephoneEcole: "0555567890",
        emailEcole: "bla@formation.dz",
        role: RoleEcole.PROFESSIONNEL
      },
      {
        nomEcole: "CFPA Sidi Bel Abbès",
        telephoneEcole: "0487654321",
        emailEcole: "cfpa.sba@formation.dz",
        role: RoleEcole.PROFESSIONNEL
      },
      {
        nomEcole: "CFPA Constantine",
        telephoneEcole: "0316543210",
        emailEcole: "cfpa.constantine@formation.dz",
        role: RoleEcole.PROFESSIONNEL
      }
    ],
    skipDuplicates: true
  })

  console.log('✔ Écoles officielles seedées')
}
