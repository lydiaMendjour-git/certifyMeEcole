import { prisma } from "../prismaClient.js"; // Mets Prisma dans un fichier séparé

export default {
  async getAll() {
    return await prisma.faculty.findMany();
  }
,
  async getByUniversity(universityId) {
    return await prisma.faculty.findMany({
      where: { idUni: parseInt(universityId) },
      select: { idFaculty: true, nomFaculty: true },
    });
  },

  async createMany(faculties) {
    return await prisma.$transaction(async (prisma) => {
      for (const faculty of faculties) {
        const existing = await prisma.faculty.findFirst({
          where: { nomFaculty: faculty.nomFaculty, idUni: faculty.idUni },
        });
        if (!existing) {
          await prisma.faculty.create({ data: faculty });
        }
      }
    });
  },
  
   async create(facultyData) {
    return prisma.faculty.create({
      data: {
        nomFaculty: facultyData.nomFaculty,
        idUni: parseInt(facultyData.idUni) // Directly set the foreign key
      }
    });
  },
   async update(id, newName) {
    return prisma.faculty.update({
      where: { idFaculty: parseInt(id) },
      data: { nomFaculty: newName }
    });
  }
,
 async delete(id) {
    return prisma.faculty.delete({
      where: { idFaculty: parseInt(id) }
    });
  }
};