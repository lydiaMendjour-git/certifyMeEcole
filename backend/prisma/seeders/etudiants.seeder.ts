import { PrismaClient } from '@prisma/client'

export default async function etudiantsSeeder(prisma: PrismaClient) {
  await prisma.etudiant.createMany({
    data: [
      {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@email.com",
        matricule: "MAT2023001",
        telephone: "+33612345678",
        dateNaissance: new Date("2000-05-15"),
        lieuNaissance: "Paris"
      },
      {
        nom: "Martin",
        prenom: "Sophie",
        email: "sophie.martin@email.com",
        matricule: "MAT2023002",
        telephone: "+33687654321",
        dateNaissance: new Date("1999-11-22"),
        lieuNaissance: "Lyon"
      }
    ],
    skipDuplicates: true
  })
  console.log('✔ Etudiants seeded')
}