import { PrismaClient } from '@prisma/client'

export default async function deparmentsSeeder(prisma: PrismaClient) {
  // Faculté des Sciences (id 1), Médecine (id 2), Lettres (id 3)
  await prisma.department.createMany({
    data: [
      { nomDepart: "Informatique", idFaculty: 1, idUni: 1 },
      { nomDepart: "Mathématiques", idFaculty: 1, idUni: 1 },
      { nomDepart: "Chirurgie", idFaculty: 2, idUni: 1 },
      { nomDepart: "Littérature Française", idFaculty: 3, idUni: 2 }
    ],
    skipDuplicates: true
  })
  console.log('✔ Departments seeded')
}