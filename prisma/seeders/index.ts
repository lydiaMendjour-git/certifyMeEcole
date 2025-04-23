import { PrismaClient } from '@prisma/client'
import universitiesSeeder from './universities.seeder.ts'
import facultiesSeeder from './faculties.seeder.ts'
import deparmentsSeeder from './deparments.seeder.ts'
import anneeSeeder from './annee.seeder.ts'
import etudiantsSeeder from './etudiants.seeder.ts'
import cursusSeeder from './cursus.seeder.ts'
import etudiantsMinistereSeeder from './etudiantsMinistere.seeder.ts'
import universityOfficialSeeder from './universityOFF.seeder.ts'
import ecolesSeeder from './ecole.seeder.ts'
import accountSeeder from './account.seeder.ts'


const main = async () => {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  })

  try {
    console.log('🧹 Nettoyage des données existantes...')
  
    await prisma.etudiantMinistere.deleteMany()
  
     console.log('🌱 Insertion des nouvelles données...')
    await etudiantsMinistereSeeder(prisma)
    
    console.log('✅ Base de données initialisée avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
    if (error instanceof Error) {
      console.error(error.stack)
    }
  }
   finally {
    await prisma.$disconnect()
  }
}

main()
