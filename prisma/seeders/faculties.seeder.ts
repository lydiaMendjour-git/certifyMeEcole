import { PrismaClient } from '@prisma/client'

export default async function facultiesSeeder(prisma: PrismaClient) {

    console.log("🌱 Seeding Faculties...")
  
    try {
      // Récupérer toutes les universités
      const universities = await prisma.university.findMany()
  
      if (universities.length === 0) {
        console.error("❌ Aucun université trouvée, impossible de seeder les facultés.")
        return
      }
  
      // Insérer des facultés pour chaque université
      for (const university of universities) {
        await prisma.faculty.createMany({
          data: [
            {
              nomFaculty: 'Faculty of Science',
              idUni: university.idUni
            },
            {
              nomFaculty: 'Faculty of Arts',
              idUni: university.idUni
            },
            {
              nomFaculty: 'Faculty of Engineering',
              idUni: university.idUni
            }
          ],
          skipDuplicates: true // Assurer que les doublons ne sont pas insérés
        })
      }
  
      console.log("✅ Faculties seeded")
    } catch (error) {
      console.error("❌ Erreur lors du seeding des facultés:", error)
    } finally {
      await prisma.$disconnect()
    }
  }
  