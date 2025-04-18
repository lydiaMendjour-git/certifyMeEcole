import { PrismaClient } from '@prisma/client'

export default async function cursusSeeder(prisma: PrismaClient) {
  const currentYear = await prisma.anneeUniversitaire.findFirst({
    where: { isCurrent: true }
  })

  if (!currentYear) {
    console.error("❌ Erreur : Aucune année universitaire actuelle trouvée !")
    return
  }

  await prisma.cursusUniversitaire.createMany({
    data: [
      {
        section: "A",
        groupe: "G1",
        filiere: "Informatique",
        idFaculty: 1,
        idDepart: 1,
        specialite: "IA",
        moyenneAnnuelle: 14.5,
        idAnnee: currentYear.idAnnee, // Dynamique
        niveau: 3,
        idEtudiant: 1 // Jean Dupont
      },
      {
        section: "B",
        groupe: "G2",
        filiere: "Mathématiques",
        idFaculty: 1,
        idDepart: 2,
        specialite: "Maths Appliquées",
        moyenneAnnuelle: 15.2,
        idAnnee: currentYear.idAnnee, // Dynamique
        niveau: 2,
        idEtudiant: 2 // Sophie Martin
      }
    ],
    skipDuplicates: true
  })

  console.log('✔ Cursus seeded')
}
