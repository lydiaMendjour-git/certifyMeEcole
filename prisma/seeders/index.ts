// clearModeleDiplome.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

const clearModeleDiplomeTable = async () => {
  try {
    console.log('🚀 Début du vidage de la table ModeleDiplome...')

    // Désactiver les contraintes temporairement
    await prisma.$executeRaw`SET session_replication_role = 'replica';`

    // Vider la table
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "ModeleDiplome" CASCADE;`)
    console.log('✅ Table ModeleDiplome vidée avec succès')

    // Réactiver les contraintes
    await prisma.$executeRaw`SET session_replication_role = 'origin';`

    console.log('🎉 Opération terminée avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors du vidage:', error)
    if (error instanceof Error) {
      console.error(error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
clearModeleDiplomeTable()