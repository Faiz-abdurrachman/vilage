const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getProfilDesa() {
  const profil = await prisma.desaProfil.findFirst();
  if (!profil) throw { statusCode: 404, message: 'Profil desa belum dikonfigurasi.' };
  return profil;
}

async function updateProfilDesa(data) {
  // Strip undefined values
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );

  const profil = await prisma.desaProfil.findFirst();
  if (!profil) {
    return prisma.desaProfil.create({ data: cleanData });
  }
  return prisma.desaProfil.update({ where: { id: profil.id }, data: cleanData });
}

module.exports = { getProfilDesa, updateProfilDesa };
