import { PrismaClient } from '@prisma/client'

export default async function etudiantsMinistereSeeder(prisma: PrismaClient) {
  await prisma.etudiantMinistere.createMany({
    data: [
      {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@email.com",
        matricule: "MAT2023001",
        dateNaissance: new Date("2000-05-15"),
        lieuNaissance: "Paris"
      },
      {
        nom: "Martin",
        prenom: "Sophie",
        email: "sophie.martin@email.com",
        matricule: "MAT2023002",
        dateNaissance: new Date("1999-11-22"),
        lieuNaissance: "Lyon"
      }
    ],
    skipDuplicates: true
  })
  console.log('✔ Etudiants ministere seeded')
}