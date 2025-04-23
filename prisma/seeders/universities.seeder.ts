import { PrismaClient } from '@prisma/client'

export default async function universitiesSeeder(prisma: PrismaClient) {
  await prisma.university.createMany({
    data: [
      {
        nomUni: "Université de Paris",
        adresseUni: "12 rue de l'Université, 75005 Paris",
        telephoneUni: "+33123456789",
        emailUni: "contact@u-paris.fr",
        accountId: 1 // un ID existant dans Account
      },
      {
        nomUni: "Université Lyon 1",
        adresseUni: "43 bd du 11 Novembre, 69622 Villeurbanne",
        telephoneUni: "+33478965412",
        emailUni: "contact@univ-lyon1.fr",
        accountId: 2
      }
    ],
    skipDuplicates: true
  })
  console.log('✔ Universities seeded')
}