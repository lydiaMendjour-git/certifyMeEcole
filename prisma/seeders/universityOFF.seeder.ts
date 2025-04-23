import { PrismaClient } from '@prisma/client'

export default async function universityOfficialSeeder(prisma: PrismaClient) {
  await prisma.university_OFFICIAL.createMany({
    data: [
      { nomUni: "Université d'Alger 1 – Benyoucef Benkhedda", adresseUni: "Alger", telephoneUni: "021000001", emailUni: "certifymeuniversity1@gmail.com" },
      { nomUni: "Université d'Alger 2 – Abou El Kacem Saâdallah", adresseUni: "Alger", telephoneUni: "021000002", emailUni: "certifymeuniversity2@gmail.com" },
      { nomUni: "Université d'Alger 3 – Brahim Soltane Chaibout", adresseUni: "Alger", telephoneUni: "021000003", emailUni: "certifymeuniversity3@gmail.com" },
      { nomUni: "Université des Sciences et de la Technologie Houari Boumédiène", adresseUni: "Bab Ezzouar, Alger", telephoneUni: "021000004", emailUni: "certifymeuniversity@gmail.com" },
      { nomUni: "Université Blida 1 – Saâd Dahlab", adresseUni: "Blida", telephoneUni: "025000001", emailUni: "certifymeuniversity5@gmail.com" },
      { nomUni: "Université Blida 2 – Lounici Ali", adresseUni: "El Affroun, Blida", telephoneUni: "025000002", emailUni: "certifymeuniversity6@gmail.com" },
      { nomUni: "Université M'Hamed Bougara", adresseUni: "Boumerdès", telephoneUni: "024000001", emailUni: "certifymeuniversity7@gmail.com" },
      { nomUni: "Université Akli Mohand Oulhadj", adresseUni: "Bouira", telephoneUni: "026000001", emailUni: "certifymeuniversity8@gmail.com" },
      { nomUni: "Université Mouloud Mammeri", adresseUni: "Tizi Ouzou", telephoneUni: "026000002", emailUni: "certifymeuniversity9@gmail.com" },
      { nomUni: "Université Yahia Farès", adresseUni: "Médéa", telephoneUni: "025000003", emailUni: "certifymeuniversity10@gmail.com" },
      { nomUni: "Université Ziane Achour", adresseUni: "Djelfa", telephoneUni: "027000001", emailUni: "certifymeuniversity11@gmail.com" },
      { nomUni: "Centre universitaire Abdallah Morsli", adresseUni: "Tipaza", telephoneUni: "024000002", emailUni: "certifymeuniversity12@gmail.com" },
      { nomUni: "Université Djilali Bounaâma", adresseUni: "Aïn Defla", telephoneUni: "027000002", emailUni: "certifymeuniversity13@gmail.com" },
      { nomUni: "Université Constantine 1 – Frères Mentouri", adresseUni: "Constantine", telephoneUni: "031000001", emailUni: "certifymeuniversity14@gmail.com" },
      { nomUni: "Université Badji Mokhtar", adresseUni: "Annaba", telephoneUni: "038000001", emailUni: "certifymeuniversity15@gmail.com" },
      { nomUni: "Université Sétif 1 – Ferhat Abbas", adresseUni: "Sétif", telephoneUni: "036000001", emailUni: "certifymeuniversity16@gmail.com" },
      { nomUni: "Université Batna 1 – Hadj Lakhder", adresseUni: "Batna", telephoneUni: "033000001", emailUni: "certifymeuniversity17@gmail.com" },
      { nomUni: "Université Mohamed Khider", adresseUni: "Biskra", telephoneUni: "033000002", emailUni: "certifymeuniversity18@gmail.com" },
      { nomUni: "Université Larbi Ben M'hidi", adresseUni: "Oum El Bouaghi", telephoneUni: "032000001", emailUni: "certifymeuniversity19@gmail.com" },
      { nomUni: "Université Mohamed-Chérif Messaadia", adresseUni: "Souk Ahras", telephoneUni: "037000001", emailUni: "certifymeuniversity20@gmail.com" },
      { nomUni: "Université Oran 1 – Ahmed Ben Bella", adresseUni: "Oran", telephoneUni: "041000001", emailUni: "certifymeuniversity21@gmail.com" },
      { nomUni: "Université Abou Bekr Belkaid", adresseUni: "Tlemcen", telephoneUni: "043000001", emailUni: "certifymeuniversity22@gmail.com" },
      { nomUni: "Université Abdelhamid Ibn Badis", adresseUni: "Mostaganem", telephoneUni: "045000001", emailUni: "certifymeuniversity23@gmail.com" },
      { nomUni: "Université Ibn Khaldoun", adresseUni: "Tiaret", telephoneUni: "046000001", emailUni: "certifymeuniversity24@gmail.com" },
      { nomUni: "Université Hassiba Benbouali", adresseUni: "Chlef", telephoneUni: "027000003", emailUni: "certifymeuniversity25@gmail.com" },
      { nomUni: "Université Ahmed Draïa", adresseUni: "Adrar", telephoneUni: "049000001", emailUni: "certifymeuniversity26@gmail.com" },
      { nomUni: "Université Amar Telidji", adresseUni: "Laghouat", telephoneUni: "029000001", emailUni: "certifymeuniversity27@gmail.com" },
      { nomUni: "Université de Ghardaïa", adresseUni: "Ghardaïa", telephoneUni: "029000002", emailUni: "certifymeuniversity28@gmail.com" },
    ],
    skipDuplicates: true
  })
  console.log('✔ Universities seeded')
}
