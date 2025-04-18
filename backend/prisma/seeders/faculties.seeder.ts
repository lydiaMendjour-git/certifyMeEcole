import { PrismaClient } from '@prisma/client'

export default async function facultiesSeeder(prisma: PrismaClient) {
  // Supposons que l'Université de Paris a l'id 1 et Lyon 1 a l'id 2
  await prisma.faculty.createMany({
    data: [
      { nomFaculty: "Faculté des Sciences", idUni: 1 },
      { nomFaculty: "Faculté de Médecine", idUni: 1 },
      { nomFaculty: "Faculté des Lettres", idUni: 2 }
    ],
    skipDuplicates: true
  })
  console.log('✔ Faculties seeded')
}