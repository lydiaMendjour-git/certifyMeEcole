import { PrismaClient } from '@prisma/client'

export default async function cursusSeeder(prisma: PrismaClient) {
    console.log("🌱 Seeding Cursus Universitaire...")
  
    try {
      // Récupérer l'année universitaire actuelle
      const currentYear = await prisma.anneeUniversitaire.findFirst({
        where: { isCurrent: true }
      })
  
      if (!currentYear) {
        console.error("❌ Erreur : Aucune année universitaire actuelle trouvée !")
        return
      }
  
      // Récupérer les étudiants, facultés et départements
      const students = await prisma.etudiant.findMany()
      const faculties = await prisma.faculty.findMany()
      const departments = await prisma.department.findMany()
  
      if (students.length === 0 || faculties.length === 0 || departments.length === 0) {
        console.error("❌ Erreur : Manque des données nécessaires (étudiants, facultés ou départements).")
        return
      }
  
      // Vérification de l'existence des identifiants dans les relations
      const student1 = students.find(s => s.idEtudiant === 1)
      const student2 = students.find(s => s.idEtudiant === 2)
      const faculty1 = faculties.find(f => f.idFaculty === 1)
      const department1 = departments.find(d => d.idDepart === 1)
      const department2 = departments.find(d => d.idDepart === 2)
  
      if (!student1 || !student2 || !faculty1 || !department1 || !department2) {
        console.error("❌ Certaines relations manquent pour le seeding des cursus.")
        return
      }
  
      // Insérer les cursus universitaires
      await prisma.cursusUniversitaire.createMany({
        data: [
          {
            section: "A",
            groupe: "G1",
            filiere: "Informatique",
            idFaculty: faculty1.idFaculty,
            idDepart: department1.idDepart,
            specialite: "IA",
            moyenneAnnuelle: 14.5,
            idAnnee: currentYear.idAnnee, // Dynamique
            niveau: 3,
            idEtudiant: student1.idEtudiant // Jean Dupont
          },
          {
            section: "B",
            groupe: "G2",
            filiere: "Mathématiques",
            idFaculty: faculty1.idFaculty,
            idDepart: department2.idDepart,
            specialite: "Maths Appliquées",
            moyenneAnnuelle: 15.2,
            idAnnee: currentYear.idAnnee, // Dynamique
            niveau: 2,
            idEtudiant: student2.idEtudiant // Sophie Martin
          }
        ],
        skipDuplicates: true
      })
  
      console.log('✔ Cursus seeded')
    } catch (error) {
      console.error("❌ Erreur lors du seeding des cursus universitaires:", error)
    } finally {
      await prisma.$disconnect()
    }
  }
  