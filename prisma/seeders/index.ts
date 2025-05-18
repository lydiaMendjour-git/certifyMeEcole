import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

const clearDatabaseTables = async () => {
  try {
    console.log('🚀 Début du processus de vidage des tables...')

    // Désactiver les contraintes de clé étrangère temporairement
    await prisma.$executeRaw`SET session_replication_role = 'replica';`

    // Ordre de suppression important à cause des relations
    const tablesToClear = [
      'DiplomeEcole',
      'CursusEcole',
      'EtudiantEcole',
      'Formation',
      'EcoleAnnee'
    ]

    for (const table of tablesToClear) {
      console.log(`🧹 Nettoyage de la table ${table}...`)
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
      console.log(`✅ Table ${table} vidée avec succès`)
    }

    // Réactiver les contraintes
    await prisma.$executeRaw`SET session_replication_role = 'origin';`

    console.log('🎉 Toutes les tables ont été vidées avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors du vidage des tables:', error)
    if (error instanceof Error) {
      console.error(error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
clearDatabaseTables()