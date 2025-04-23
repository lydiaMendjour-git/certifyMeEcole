import { PrismaClient } from '@prisma/client'

export default async function deparmentsSeeder(prisma: PrismaClient) {
  console.log("🌱 Seeding Departments...")

  try {
    // Récupérer toutes les facultés et les universités
    const faculties = await prisma.faculty.findMany()
    const universities = await prisma.university.findMany()

    if (faculties.length === 0 || universities.length === 0) {
      console.error("❌ Aucune faculté ou université trouvée, impossible de seeder les départements.")
      return
    }

    // Insérer des départements pour chaque faculté et université
    for (const faculty of faculties) {
      const university = universities.find(u => u.idUni === faculty.idUni)
      if (!university) {
        console.error(`❌ Université avec id ${faculty.idUni} introuvable pour la faculté ${faculty.nomFaculty}.`)
        continue
      }

      await prisma.department.createMany({
        data: [
          { nomDepart: "Informatique", idFaculty: faculty.idFaculty, idUni: faculty.idUni },
          { nomDepart: "Mathématiques", idFaculty: faculty.idFaculty, idUni: faculty.idUni },
          { nomDepart: "Chirurgie", idFaculty: faculty.idFaculty, idUni: faculty.idUni },
          { nomDepart: "Littérature Française", idFaculty: faculty.idFaculty, idUni: faculty.idUni }
        ],
        skipDuplicates: true
      })
    }

    console.log('✔ Departments seeded')
  } catch (error) {
    console.error("❌ Erreur lors du seeding des départements:", error)
  } finally {
    await prisma.$disconnect()
  }
}