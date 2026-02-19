const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getProfilDesa() {
  const profil = await prisma.desaProfil.findFirst();
  if (!profil) throw { statusCode: 404, message: 'Profil desa belum dikonfigurasi.' };
  return profil;
}

async function updateProfilDesa(data) {
  const profil = await prisma.desaProfil.findFirst();
  if (!profil) {
    return prisma.desaProfil.create({ data });
  }
  return prisma.desaProfil.update({ where: { id: profil.id }, data });
}

module.exports = { getProfilDesa, updateProfilDesa };
