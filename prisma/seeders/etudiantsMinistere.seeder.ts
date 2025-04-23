import { PrismaClient } from '@prisma/client'

export default async function etudiantsMinistereSeeder(prisma: PrismaClient) {
  await prisma.etudiantMinistere.createMany({
    data: [
      {
        nom: 'Hanafi',
        prenom: 'Meriem',
        email: 'hanafi.meriem@email.com',
        matricule: '222231354808',
        dateNaissance: new Date('2004-11-17'),
        lieuNaissance: 'Kouba',
      },
      {
        nom: 'Behidj',
        prenom: 'Neila',
        email: 'behidj.neila@email.com',
        matricule: '222231640005',
        dateNaissance: new Date('2005-04-18'),
        lieuNaissance: 'Reghaia',
      },
      {
        nom: 'Ngono',
        prenom: 'Paul',
        email: 'paul.ngono@email.com',
        matricule: 'MAT20230003',
        dateNaissance: new Date('2001-03-30'),
        lieuNaissance: 'Garoua',
      },
      {
        nom: 'Kamga',
        prenom: 'Alice',
        email: 'alice.kamga@email.com',
        matricule: 'MAT20230004',
        dateNaissance: new Date('2000-08-17'),
        lieuNaissance: 'Bafoussam',
      },
      {
        nom: 'Mbappe',
        prenom: 'Kylian',
        email: 'kylian.mbappe@email.com',
        matricule: 'MAT20230005',
        dateNaissance: new Date('1998-12-20'),
        lieuNaissance: 'Paris',
      },
      {
        nom: 'Sow',
        prenom: 'Abdou',
        email: 'abdou.sow@email.com',
        matricule: 'MAT20230006',
        dateNaissance: new Date('2003-05-10'),
        lieuNaissance: 'Dakar',
      },
      {
        nom: 'Ndiaye',
        prenom: 'Sana',
        email: 'sana.ndiaye@email.com',
        matricule: 'MAT20230007',
        dateNaissance: new Date('2002-06-25'),
        lieuNaissance: 'Dakar',
      },
      {
        nom: 'Zahra',
        prenom: 'Yasmina',
        email: 'yasmina.zahra@email.com',
        matricule: 'MAT20230008',
        dateNaissance: new Date('2001-12-14'),
        lieuNaissance: 'Alger',
      },
      {
        nom: 'Diop',
        prenom: 'Mamadou',
        email: 'mamadou.diop@email.com',
        matricule: 'MAT20230009',
        dateNaissance: new Date('2000-11-02'),
        lieuNaissance: 'Dakar',
      },
      {
        nom: 'Bamba',
        prenom: 'Ousmane',
        email: 'ousmane.bamba@email.com',
        matricule: 'MAT20230010',
        dateNaissance: new Date('2002-02-19'),
        lieuNaissance: 'Abidjan',
      },
      {
        nom: 'Toure',
        prenom: 'Aissatou',
        email: 'aissatou.toure@email.com',
        matricule: 'MAT20230011',
        dateNaissance: new Date('2003-03-23'),
        lieuNaissance: 'Conakry',
      },
    ],
    skipDuplicates: true
  })
  console.log('✔ Etudiants ministere seeded')
}