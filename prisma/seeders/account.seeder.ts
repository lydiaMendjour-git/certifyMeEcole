import { PrismaClient } from '@prisma/client'

export default async function accountSeeder(prisma: PrismaClient) {
  console.log("🌱 Seeding Accounts...")

  try {
      await prisma.account.createMany({
      data: [
        {
          id: 1,
          username: 'adminparis',
          email: 'adminparis@u-paris.fr',
          password: 'hashedPassword1', // Remplace par un vrai hash
          role: 'UNIVERSITY'
        },
        {
          id: 2,
          username: 'adminlyon',
          email: 'adminlyon@univ-lyon1.fr',
          password: 'hashedPassword2',
          role: 'UNIVERSITY'
        },
      ],
      skipDuplicates: true
    })

    console.log("✅ Accounts seeded")
  } catch (error) {
    console.error("❌ Erreur lors du seeding des comptes:", error)
  } finally {
    await prisma.$disconnect()
  }
}
