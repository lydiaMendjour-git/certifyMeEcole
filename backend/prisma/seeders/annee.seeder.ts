import { PrismaClient } from '@prisma/client'

export default async function anneeSeeder(prisma: PrismaClient) {
  await prisma.anneeUniversitaire.createMany({
    data: [
      { annee: 2023, isCurrent: false },
      { annee: 2024, isCurrent: true }
    ],
    skipDuplicates: true
  })
  console.log('✔ Années universitaires seeded')
}


