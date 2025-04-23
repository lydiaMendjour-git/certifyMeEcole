import { PrismaClient } from '@prisma/client'

export default async function anneeSeeder(prisma: PrismaClient) {
  await prisma.anneeUniversitaire.createMany({
    data: [
      { annee: "2023/2024",  anneediplome: 2024, isCurrent: false },
      { annee: "2024/2025",  anneediplome: 2025 , isCurrent: true }
    ],
    skipDuplicates: true
  })
  console.log('✔ Années universitaires seeded')
}


