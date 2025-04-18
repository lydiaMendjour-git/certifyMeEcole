import { PrismaClient } from '@prisma/client'
import universitiesSeeder from './universities.seeder.js'
import facultiesSeeder from './faculties.seeder.js'
import deparmentsSeeder from './deparments.seeder.js'
import anneeSeeder from './annee.seeder.js'
import etudiantsSeeder from './etudiants.seeder.js'
import cursusSeeder from './cursus.seeder.js'
import etudiantsMinistereSeeder from './etudiantsMinistere.seeder.js'

const main = async () => {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  })

  try {
    console.log('🧹 Nettoyage des données existantes...')

    await prisma.cursusUniversitaire.deleteMany()
    await prisma.etudiant.deleteMany()
    await prisma.anneeUniversitaire.deleteMany()
    await prisma.department.deleteMany()
    await prisma.faculty.deleteMany()
    await prisma.university.deleteMany()
    await prisma.etudiantMinistere.deleteMany()

    console.log('🌱 Insertion des nouvelles données...')

    await universitiesSeeder(prisma)
    await facultiesSeeder(prisma)
    await deparmentsSeeder(prisma)
    await anneeSeeder(prisma)
    await etudiantsSeeder(prisma)
    await cursusSeeder(prisma)
    await etudiantsMinistereSeeder(prisma)

    console.log('✅ Base de données initialisée avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
