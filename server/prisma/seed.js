const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database SIDESA...');

  // ==========================================
  // PROFIL DESA
  // ==========================================
  const desaProfil = await prisma.desaProfil.create({
    data: {
      namaDesa: 'Motoboi Besar',
      kodeDesa: 'MB',
      kecamatan: 'Kotamobagu Selatan',
      kabupatenKota: 'Kota Kotamobagu',
      provinsi: 'Sulawesi Utara',
      alamatKantor: 'Jl. Trans Sulawesi, Desa Motoboi Besar',
      kodePos: '95716',
      telepon: '(0434) 123456',
      namaKades: 'Ibrahim Mokodompit',
      nipKades: '19780315 200501 1 003',
    },
  });
  console.log('✅ Profil desa created');

  // ==========================================
  // USERS
  // ==========================================
  const saltRounds = 10;
  const [admin, kades, sekdes, operator1] = await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin',
        password: await bcrypt.hash('admin123', saltRounds),
        namaLengkap: 'Administrator Sistem',
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        username: 'kades',
        password: await bcrypt.hash('kades123', saltRounds),
        namaLengkap: 'Ibrahim Mokodompit',
        role: 'KADES',
      },
    }),
    prisma.user.create({
      data: {
        username: 'sekdes',
        password: await bcrypt.hash('sekdes123', saltRounds),
        namaLengkap: 'Fatmawati Mamonto',
        role: 'SEKDES',
      },
    }),
    prisma.user.create({
      data: {
        username: 'operator1',
        password: await bcrypt.hash('operator123', saltRounds),
        namaLengkap: 'Rizky Makalalag',
        role: 'OPERATOR',
      },
    }),
  ]);
  console.log('✅ Users created (4 users)');

  // ==========================================
  // KARTU KELUARGA (12 KK) - buat tanpa kepalaKeluargaId dulu
  // ==========================================
  const [kk1, kk2, kk3, kk4, kk5, kk6, kk7, kk8, kk9, kk10, kk11, kk12] = await Promise.all([
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301780001', alamat: 'Jl. Dusun 1 No. 1', rt: '001', rw: '001', dusun: 'Dusun 1', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301750002', alamat: 'Jl. Dusun 1 No. 5', rt: '001', rw: '001', dusun: 'Dusun 1', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301850003', alamat: 'Jl. Dusun 1 No. 10', rt: '002', rw: '001', dusun: 'Dusun 1', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301700004', alamat: 'Jl. Dusun 2 No. 3', rt: '001', rw: '001', dusun: 'Dusun 2', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301680005', alamat: 'Jl. Dusun 2 No. 7', rt: '001', rw: '001', dusun: 'Dusun 2', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301800006', alamat: 'Jl. Dusun 2 No. 15', rt: '002', rw: '001', dusun: 'Dusun 2', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301650007', alamat: 'Jl. Dusun 3 No. 2', rt: '001', rw: '002', dusun: 'Dusun 3', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301720008', alamat: 'Jl. Dusun 3 No. 8', rt: '001', rw: '002', dusun: 'Dusun 3', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301780009', alamat: 'Jl. Dusun 3 No. 12', rt: '002', rw: '002', dusun: 'Dusun 3', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301600010', alamat: 'Jl. Dusun 4 No. 1', rt: '001', rw: '002', dusun: 'Dusun 4', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301880011', alamat: 'Jl. Dusun 4 No. 6', rt: '001', rw: '002', dusun: 'Dusun 4', kodePos: '95716' } }),
    prisma.kartuKeluarga.create({ data: { noKk: '7174012301850012', alamat: 'Jl. Dusun 4 No. 11', rt: '002', rw: '002', dusun: 'Dusun 4', kodePos: '95716' } }),
  ]);
  console.log('✅ Kartu Keluarga created (12 KK)');

  // ==========================================
  // PENDUDUK - KK1: Keluarga Mokodompit
  // ==========================================
  const ibrahim = await prisma.penduduk.create({
    data: {
      nik: '7174011503780001', namaLengkap: 'Ibrahim Mokodompit', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1978-03-15'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 1 No. 1',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Kepala Desa',
      pendidikanTerakhir: 'S1', golonganDarah: 'O', namaAyah: 'Hamid Mokodompit', namaIbu: 'Siti Rahayu',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk1.id,
    },
  });
  const nurlaela = await prisma.penduduk.create({
    data: {
      nik: '7174014507820002', namaLengkap: 'Nurlaela Paputungan', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1982-07-05'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 1 No. 1',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Ibu Rumah Tangga',
      pendidikanTerakhir: 'SMA', golonganDarah: 'A', namaAyah: 'Ahmad Paputungan', namaIbu: 'Halijah Mamonto',
      statusDalamKK: 'ISTRI', kkId: kk1.id,
    },
  });
  const fahri = await prisma.penduduk.create({
    data: {
      nik: '7174011201050003', namaLengkap: 'Fahri Mokodompit', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2005-01-12'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 1 No. 1',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Mahasiswa',
      pendidikanTerakhir: 'SMA', golonganDarah: 'O', namaAyah: 'Ibrahim Mokodompit', namaIbu: 'Nurlaela Paputungan',
      statusDalamKK: 'ANAK', kkId: kk1.id,
    },
  });
  const aisyah = await prisma.penduduk.create({
    data: {
      nik: '7174015506100004', namaLengkap: 'Aisyah Mokodompit', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2010-06-15'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 1 No. 1',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Pelajar',
      pendidikanTerakhir: 'SMP', golonganDarah: 'A', namaAyah: 'Ibrahim Mokodompit', namaIbu: 'Nurlaela Paputungan',
      statusDalamKK: 'ANAK', kkId: kk1.id,
    },
  });

  // KK2: Keluarga Mamonto
  const hasan = await prisma.penduduk.create({
    data: {
      nik: '7174012008750005', namaLengkap: 'Hasan Mamonto', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1975-08-20'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 1 No. 5',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Petani',
      pendidikanTerakhir: 'SMP', golonganDarah: 'B', namaAyah: 'Umar Mamonto', namaIbu: 'Rohani Gubali',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk2.id,
    },
  });
  const fatmawati = await prisma.penduduk.create({
    data: {
      nik: '7174010304800006', namaLengkap: 'Fatmawati Mamonto', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1980-04-03'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 1 No. 5',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Sekretaris Desa',
      pendidikanTerakhir: 'S1', golonganDarah: 'O', namaAyah: 'Rustam Gubali', namaIbu: 'Aminah Mokodompit',
      statusDalamKK: 'ISTRI', kkId: kk2.id,
    },
  });
  const ilham = await prisma.penduduk.create({
    data: {
      nik: '7174011507030007', namaLengkap: 'Ilham Mamonto', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2003-07-15'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 1 No. 5',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Mahasiswa',
      pendidikanTerakhir: 'SMA', golonganDarah: 'B', namaAyah: 'Hasan Mamonto', namaIbu: 'Fatmawati Mamonto',
      statusDalamKK: 'ANAK', kkId: kk2.id,
    },
  });

  // KK3: Keluarga Makalalag
  const yunus = await prisma.penduduk.create({
    data: {
      nik: '7174011105850008', namaLengkap: 'Yunus Makalalag', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1985-05-11'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 1 No. 10',
      rt: '002', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Wiraswasta',
      pendidikanTerakhir: 'S1', golonganDarah: 'AB', namaAyah: 'Dominggus Makalalag', namaIbu: 'Agnes Korompis',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk3.id,
    },
  });
  const meiske = await prisma.penduduk.create({
    data: {
      nik: '7174012209880009', namaLengkap: 'Meiske Korompis', tempatLahir: 'Manado',
      tanggalLahir: new Date('1988-09-22'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 1 No. 10',
      rt: '002', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Guru',
      pendidikanTerakhir: 'S1', golonganDarah: 'A', namaAyah: 'Joppy Korompis', namaIbu: 'Maria Tumbelaka',
      statusDalamKK: 'ISTRI', kkId: kk3.id,
    },
  });
  const david = await prisma.penduduk.create({
    data: {
      nik: '7174010803150010', namaLengkap: 'David Makalalag', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2015-03-08'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 1 No. 10',
      rt: '002', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Pelajar',
      pendidikanTerakhir: 'SD', golonganDarah: 'AB', namaAyah: 'Yunus Makalalag', namaIbu: 'Meiske Korompis',
      statusDalamKK: 'ANAK', kkId: kk3.id,
    },
  });
  const samuel = await prisma.penduduk.create({
    data: {
      nik: '7174011712200011', namaLengkap: 'Samuel Makalalag', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2020-12-17'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 1 No. 10',
      rt: '002', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Belum Bekerja',
      pendidikanTerakhir: 'TIDAK_SEKOLAH', golonganDarah: 'A', namaAyah: 'Yunus Makalalag', namaIbu: 'Meiske Korompis',
      statusDalamKK: 'ANAK', kkId: kk3.id,
    },
  });

  // KK4: Keluarga Dongoran
  const hendrik = await prisma.penduduk.create({
    data: {
      nik: '7174010602700012', namaLengkap: 'Hendrik Dongoran', tempatLahir: 'Tondano',
      tanggalLahir: new Date('1970-02-06'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 2 No. 3',
      rt: '001', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Pensiunan PNS',
      pendidikanTerakhir: 'S1', golonganDarah: 'O', namaAyah: 'Rudi Dongoran', namaIbu: 'Lely Tumbel',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk4.id,
    },
  });
  const martha = await prisma.penduduk.create({
    data: {
      nik: '7174011803730013', namaLengkap: 'Martha Tumbel', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1973-03-18'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 2 No. 3',
      rt: '001', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Ibu Rumah Tangga',
      pendidikanTerakhir: 'SMA', golonganDarah: 'A', namaAyah: 'Yusuf Tumbel', namaIbu: 'Agustina Mokalu',
      statusDalamKK: 'ISTRI', kkId: kk4.id,
    },
  });
  const frenky = await prisma.penduduk.create({
    data: {
      nik: '7174012505950014', namaLengkap: 'Frenky Dongoran', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1995-05-25'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 2 No. 3',
      rt: '001', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Karyawan Swasta',
      pendidikanTerakhir: 'D3', golonganDarah: 'O', namaAyah: 'Hendrik Dongoran', namaIbu: 'Martha Tumbel',
      statusDalamKK: 'ANAK', kkId: kk4.id,
    },
  });

  // KK5: Keluarga Olii
  const abdul = await prisma.penduduk.create({
    data: {
      nik: '7174010109680015', namaLengkap: 'Abdul Olii', tempatLahir: 'Gorontalo',
      tanggalLahir: new Date('1968-09-01'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 2 No. 7',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Pedagang',
      pendidikanTerakhir: 'SMA', golonganDarah: 'B', namaAyah: 'Usman Olii', namaIbu: 'Halija Mohamad',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk5.id,
    },
  });
  const siti = await prisma.penduduk.create({
    data: {
      nik: '7174012504720016', namaLengkap: 'Siti Mohamad', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1972-04-25'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 2 No. 7',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Pedagang',
      pendidikanTerakhir: 'SMP', golonganDarah: 'O', namaAyah: 'Zainal Mohamad', namaIbu: 'Nurhayati Olii',
      statusDalamKK: 'ISTRI', kkId: kk5.id,
    },
  });
  const fikri = await prisma.penduduk.create({
    data: {
      nik: '7174011406970017', namaLengkap: 'Fikri Olii', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1997-06-14'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 2 No. 7',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Petani',
      pendidikanTerakhir: 'SMA', golonganDarah: 'B', namaAyah: 'Abdul Olii', namaIbu: 'Siti Mohamad',
      statusDalamKK: 'ANAK', kkId: kk5.id,
    },
  });
  const rahma = await prisma.penduduk.create({
    data: {
      nik: '7174015511000018', namaLengkap: 'Rahma Olii', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2000-11-15'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 2 No. 7',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Mahasiswa',
      pendidikanTerakhir: 'SMA', golonganDarah: 'O', namaAyah: 'Abdul Olii', namaIbu: 'Siti Mohamad',
      statusDalamKK: 'ANAK', kkId: kk5.id,
    },
  });

  // KK6: Keluarga Sumual
  const jefri = await prisma.penduduk.create({
    data: {
      nik: '7174012301800019', namaLengkap: 'Jefri Sumual', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1980-01-23'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 2 No. 15',
      rt: '002', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'PNS',
      pendidikanTerakhir: 'S1', golonganDarah: 'A', namaAyah: 'Pieter Sumual', namaIbu: 'Hetty Wongkar',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk6.id,
    },
  });
  const grace = await prisma.penduduk.create({
    data: {
      nik: '7174010807830020', namaLengkap: 'Grace Wongkar', tempatLahir: 'Manado',
      tanggalLahir: new Date('1983-07-08'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 2 No. 15',
      rt: '002', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Bidan',
      pendidikanTerakhir: 'D3', golonganDarah: 'B', namaAyah: 'Ronald Wongkar', namaIbu: 'Sandra Tambunan',
      statusDalamKK: 'ISTRI', kkId: kk6.id,
    },
  });
  const kevin = await prisma.penduduk.create({
    data: {
      nik: '7174011002100021', namaLengkap: 'Kevin Sumual', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2010-02-10'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 2 No. 15',
      rt: '002', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Pelajar',
      pendidikanTerakhir: 'SMP', golonganDarah: 'A', namaAyah: 'Jefri Sumual', namaIbu: 'Grace Wongkar',
      statusDalamKK: 'ANAK', kkId: kk6.id,
    },
  });
  const kezia = await prisma.penduduk.create({
    data: {
      nik: '7174015204130022', namaLengkap: 'Kezia Sumual', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2013-04-12'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 2 No. 15',
      rt: '002', rw: '001', agama: 'KRISTEN', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Pelajar',
      pendidikanTerakhir: 'SD', golonganDarah: 'B', namaAyah: 'Jefri Sumual', namaIbu: 'Grace Wongkar',
      statusDalamKK: 'ANAK', kkId: kk6.id,
    },
  });

  // KK7: Keluarga Lasut
  const ventje = await prisma.penduduk.create({
    data: {
      nik: '7174010506650023', namaLengkap: 'Ventje Lasut', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1965-06-05'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 3 No. 2',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'CERAI_MATI', pekerjaan: 'Petani',
      pendidikanTerakhir: 'SD', golonganDarah: 'O', namaAyah: 'Frans Lasut', namaIbu: 'Nona Mokalu',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk7.id,
    },
  });
  const christian = await prisma.penduduk.create({
    data: {
      nik: '7174011208900024', namaLengkap: 'Christian Lasut', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1990-08-12'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 3 No. 2',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Tukang',
      pendidikanTerakhir: 'SMP', golonganDarah: 'A', namaAyah: 'Ventje Lasut', namaIbu: 'Almh. Rosalina Potabuga',
      statusDalamKK: 'ANAK', kkId: kk7.id,
    },
  });

  // KK8: Keluarga Monoarfa
  const ismail = await prisma.penduduk.create({
    data: {
      nik: '7174010704720025', namaLengkap: 'Ismail Monoarfa', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1972-04-07'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 3 No. 8',
      rt: '001', rw: '002', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Petani',
      pendidikanTerakhir: 'SMP', golonganDarah: 'B', namaAyah: 'Usman Monoarfa', namaIbu: 'Hasna Gobel',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk8.id,
    },
  });
  const halima = await prisma.penduduk.create({
    data: {
      nik: '7174011209760026', namaLengkap: 'Halima Gobel', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1976-09-12'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 3 No. 8',
      rt: '001', rw: '002', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Ibu Rumah Tangga',
      pendidikanTerakhir: 'SD', golonganDarah: 'O', namaAyah: 'Bakar Gobel', namaIbu: 'Nursia Pomalingo',
      statusDalamKK: 'ISTRI', kkId: kk8.id,
    },
  });
  const rizal = await prisma.penduduk.create({
    data: {
      nik: '7174012603000027', namaLengkap: 'Rizal Monoarfa', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2000-03-26'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 3 No. 8',
      rt: '001', rw: '002', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Buruh',
      pendidikanTerakhir: 'SMA', golonganDarah: 'B', namaAyah: 'Ismail Monoarfa', namaIbu: 'Halima Gobel',
      statusDalamKK: 'ANAK', kkId: kk8.id,
    },
  });
  const fadil = await prisma.penduduk.create({
    data: {
      nik: '7174011811040028', namaLengkap: 'Fadil Monoarfa', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2004-11-18'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 3 No. 8',
      rt: '001', rw: '002', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Pelajar',
      pendidikanTerakhir: 'SMA', golonganDarah: 'O', namaAyah: 'Ismail Monoarfa', namaIbu: 'Halima Gobel',
      statusDalamKK: 'ANAK', kkId: kk8.id,
    },
  });
  const nurul = await prisma.penduduk.create({
    data: {
      nik: '7174010207080029', namaLengkap: 'Nurul Monoarfa', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2008-07-02'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 3 No. 8',
      rt: '001', rw: '002', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Pelajar',
      pendidikanTerakhir: 'SMP', golonganDarah: 'A', namaAyah: 'Ismail Monoarfa', namaIbu: 'Halima Gobel',
      statusDalamKK: 'ANAK', kkId: kk8.id,
    },
  });

  // KK9: Keluarga Pandeirot
  const ronny = await prisma.penduduk.create({
    data: {
      nik: '7174011408780030', namaLengkap: 'Ronny Pandeirot', tempatLahir: 'Tomohon',
      tanggalLahir: new Date('1978-08-14'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 3 No. 12',
      rt: '002', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Nelayan',
      pendidikanTerakhir: 'SMP', golonganDarah: 'O', namaAyah: 'Paulus Pandeirot', namaIbu: 'Erna Pangkey',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk9.id,
    },
  });
  const trisnawati = await prisma.penduduk.create({
    data: {
      nik: '7174012101820031', namaLengkap: 'Trisnawati Mokoagow', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1982-01-21'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 3 No. 12',
      rt: '002', rw: '002', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Ibu Rumah Tangga',
      pendidikanTerakhir: 'SMA', golonganDarah: 'A', namaAyah: 'Hamid Mokoagow', namaIbu: 'Rohani Potabuga',
      statusDalamKK: 'ISTRI', kkId: kk9.id,
    },
  });
  const chrisanto = await prisma.penduduk.create({
    data: {
      nik: '7174010505050032', namaLengkap: 'Chrisanto Pandeirot', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2005-05-05'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 3 No. 12',
      rt: '002', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Mahasiswa',
      pendidikanTerakhir: 'SMA', golonganDarah: 'O', namaAyah: 'Ronny Pandeirot', namaIbu: 'Trisnawati Mokoagow',
      statusDalamKK: 'ANAK', kkId: kk9.id,
    },
  });
  const putri = await prisma.penduduk.create({
    data: {
      nik: '7174011103080033', namaLengkap: 'Putri Pandeirot', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2008-03-11'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 3 No. 12',
      rt: '002', rw: '002', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Pelajar',
      pendidikanTerakhir: 'SMP', golonganDarah: 'A', namaAyah: 'Ronny Pandeirot', namaIbu: 'Trisnawati Mokoagow',
      statusDalamKK: 'ANAK', kkId: kk9.id,
    },
  });

  // KK10: Keluarga Dotu
  const marthen = await prisma.penduduk.create({
    data: {
      nik: '7174010309600034', namaLengkap: 'Marthen Dotu', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1960-09-03'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 4 No. 1',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Pensiunan TNI',
      pendidikanTerakhir: 'SMA', golonganDarah: 'O', namaAyah: 'Abner Dotu', namaIbu: 'Betsy Mokodompit',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk10.id,
    },
  });
  const nelly = await prisma.penduduk.create({
    data: {
      nik: '7174011507630035', namaLengkap: 'Nelly Moningka', tempatLahir: 'Amurang',
      tanggalLahir: new Date('1963-07-15'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 4 No. 1',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Ibu Rumah Tangga',
      pendidikanTerakhir: 'SMP', golonganDarah: 'A', namaAyah: 'Yacob Moningka', namaIbu: 'Tineke Sumual',
      statusDalamKK: 'ISTRI', kkId: kk10.id,
    },
  });

  // KK11: Keluarga Tangkere
  const steven = await prisma.penduduk.create({
    data: {
      nik: '7174011205880036', namaLengkap: 'Steven Tangkere', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1988-05-12'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 4 No. 6',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Sopir',
      pendidikanTerakhir: 'SMA', golonganDarah: 'B', namaAyah: 'Dolfie Tangkere', namaIbu: 'Marta Kalalo',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk11.id,
    },
  });
  const merry = await prisma.penduduk.create({
    data: {
      nik: '7174010608910037', namaLengkap: 'Merry Kalalo', tempatLahir: 'Manado',
      tanggalLahir: new Date('1991-08-06'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 4 No. 6',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'KAWIN', pekerjaan: 'Pedagang',
      pendidikanTerakhir: 'SMA', golonganDarah: 'O', namaAyah: 'Andre Kalalo', namaIbu: 'Juliet Roring',
      statusDalamKK: 'ISTRI', kkId: kk11.id,
    },
  });
  const blessing = await prisma.penduduk.create({
    data: {
      nik: '7174010203180038', namaLengkap: 'Blessing Tangkere', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2018-03-02'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 4 No. 6',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Belum Bekerja',
      pendidikanTerakhir: 'TIDAK_SEKOLAH', golonganDarah: 'B', namaAyah: 'Steven Tangkere', namaIbu: 'Merry Kalalo',
      statusDalamKK: 'ANAK', kkId: kk11.id,
    },
  });
  const joy = await prisma.penduduk.create({
    data: {
      nik: '7174011509210039', namaLengkap: 'Joy Tangkere', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2021-09-15'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 4 No. 6',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Belum Bekerja',
      pendidikanTerakhir: 'TIDAK_SEKOLAH', golonganDarah: 'O', namaAyah: 'Steven Tangkere', namaIbu: 'Merry Kalalo',
      statusDalamKK: 'ANAK', kkId: kk11.id,
    },
  });

  // KK12: Keluarga Pomalingo
  const arifin = await prisma.penduduk.create({
    data: {
      nik: '7174010811850040', namaLengkap: 'Arifin Pomalingo', tempatLahir: 'Gorontalo',
      tanggalLahir: new Date('1985-11-08'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 4 No. 11',
      rt: '002', rw: '002', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Guru',
      pendidikanTerakhir: 'S1', golonganDarah: 'A', namaAyah: 'Umar Pomalingo', namaIbu: 'Hasna Hulopi',
      statusDalamKK: 'KEPALA_KELUARGA', kkId: kk12.id,
    },
  });
  const dian = await prisma.penduduk.create({
    data: {
      nik: '7174012003890041', namaLengkap: 'Dian Hulopi', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1989-03-20'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 4 No. 11',
      rt: '002', rw: '002', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Bidan',
      pendidikanTerakhir: 'D3', golonganDarah: 'B', namaAyah: 'Zainuddin Hulopi', namaIbu: 'Zainab Pomalingo',
      statusDalamKK: 'ISTRI', kkId: kk12.id,
    },
  });
  const alif = await prisma.penduduk.create({
    data: {
      nik: '7174011407150042', namaLengkap: 'Alif Pomalingo', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2015-07-14'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 4 No. 11',
      rt: '002', rw: '002', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Pelajar',
      pendidikanTerakhir: 'SD', golonganDarah: 'A', namaAyah: 'Arifin Pomalingo', namaIbu: 'Dian Hulopi',
      statusDalamKK: 'ANAK', kkId: kk12.id,
    },
  });
  const zahra = await prisma.penduduk.create({
    data: {
      nik: '7174010201190043', namaLengkap: 'Zahra Pomalingo', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('2019-01-02'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 4 No. 11',
      rt: '002', rw: '002', agama: 'ISLAM', statusPerkawinan: 'BELUM_KAWIN', pekerjaan: 'Belum Bekerja',
      pendidikanTerakhir: 'TIDAK_SEKOLAH', golonganDarah: 'B', namaAyah: 'Arifin Pomalingo', namaIbu: 'Dian Hulopi',
      statusDalamKK: 'ANAK', kkId: kk12.id,
    },
  });

  // Penduduk non-aktif (tanpa KK)
  const jusuf = await prisma.penduduk.create({
    data: {
      nik: '7174011002550044', namaLengkap: 'Jusuf Potabuga', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1955-10-02'), jenisKelamin: 'LAKI_LAKI', alamat: 'Jl. Dusun 3 No. 2',
      rt: '001', rw: '002', agama: 'KRISTEN', statusPerkawinan: 'CERAI_MATI', pekerjaan: 'Petani',
      pendidikanTerakhir: 'SD', golonganDarah: 'O', namaAyah: 'Yohanes Potabuga', namaIbu: 'Leni Lasut',
      statusDalamKK: 'FAMILI_LAIN', statusPenduduk: 'MENINGGAL', kkId: kk7.id,
    },
  });
  const dewi = await prisma.penduduk.create({
    data: {
      nik: '7174012703920045', namaLengkap: 'Dewi Sahilatua', tempatLahir: 'Kotamobagu',
      tanggalLahir: new Date('1992-03-27'), jenisKelamin: 'PEREMPUAN', alamat: 'Jl. Dusun 2 No. 7',
      rt: '001', rw: '001', agama: 'ISLAM', statusPerkawinan: 'KAWIN', pekerjaan: 'Karyawan Swasta',
      pendidikanTerakhir: 'S1', golonganDarah: 'A', namaAyah: 'Ahmad Sahilatua', namaIbu: 'Siti Olii',
      statusDalamKK: 'ANAK', statusPenduduk: 'PINDAH', kkId: null,
    },
  });

  console.log('✅ Penduduk created (45 records)');

  // Update kepalaKeluargaId di setiap KK
  await Promise.all([
    prisma.kartuKeluarga.update({ where: { id: kk1.id }, data: { kepalaKeluargaId: ibrahim.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk2.id }, data: { kepalaKeluargaId: hasan.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk3.id }, data: { kepalaKeluargaId: yunus.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk4.id }, data: { kepalaKeluargaId: hendrik.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk5.id }, data: { kepalaKeluargaId: abdul.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk6.id }, data: { kepalaKeluargaId: jefri.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk7.id }, data: { kepalaKeluargaId: ventje.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk8.id }, data: { kepalaKeluargaId: ismail.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk9.id }, data: { kepalaKeluargaId: ronny.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk10.id }, data: { kepalaKeluargaId: marthen.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk11.id }, data: { kepalaKeluargaId: steven.id } }),
    prisma.kartuKeluarga.update({ where: { id: kk12.id }, data: { kepalaKeluargaId: arifin.id } }),
  ]);
  console.log('✅ Kepala keluarga updated for all KK');

  // ==========================================
  // MUTASI (8 records)
  // ==========================================
  await prisma.mutasi.createMany({
    data: [
      {
        pendudukId: joy.id, jenisMutasi: 'LAHIR', tanggalMutasi: new Date('2021-09-15'),
        keterangan: 'Anak ke-2 keluarga Tangkere', createdById: operator1.id,
      },
      {
        pendudukId: jusuf.id, jenisMutasi: 'MENINGGAL', tanggalMutasi: new Date('2024-08-15'),
        keterangan: 'Meninggal dunia di RSUD Kotamobagu', createdById: sekdes.id,
      },
      {
        pendudukId: dewi.id, jenisMutasi: 'PINDAH_KELUAR', tanggalMutasi: new Date('2025-01-10'),
        keterangan: 'Pindah ke Kota Manado, ikut suami', desaTujuan: 'Kota Manado', createdById: sekdes.id,
      },
      {
        pendudukId: blessing.id, jenisMutasi: 'LAHIR', tanggalMutasi: new Date('2018-03-02'),
        keterangan: 'Anak ke-1 keluarga Tangkere', createdById: operator1.id,
      },
      {
        pendudukId: zahra.id, jenisMutasi: 'LAHIR', tanggalMutasi: new Date('2019-01-02'),
        keterangan: 'Anak ke-2 keluarga Pomalingo', createdById: operator1.id,
      },
      {
        pendudukId: meiske.id, jenisMutasi: 'PINDAH_MASUK', tanggalMutasi: new Date('2015-06-20'),
        keterangan: 'Pindah dari Manado, setelah menikah', desaAsal: 'Kota Manado', createdById: sekdes.id,
      },
      {
        pendudukId: frenky.id, jenisMutasi: 'PINDAH_MASUK', tanggalMutasi: new Date('2020-03-01'),
        keterangan: 'Kembali dari merantau di Jakarta', desaAsal: 'Kota Jakarta Selatan', createdById: operator1.id,
      },
      {
        pendudukId: trisnawati.id, jenisMutasi: 'PINDAH_MASUK', tanggalMutasi: new Date('2006-05-15'),
        keterangan: 'Pindah dari Desa Bilalang, setelah menikah', desaAsal: 'Desa Bilalang', createdById: admin.id,
      },
    ],
  });
  console.log('✅ Mutasi created (8 records)');

  // ==========================================
  // SURAT (6 records)
  // ==========================================
  await prisma.surat.createMany({
    data: [
      {
        jenisSurat: 'SK_DOMISILI', pendudukId: fikri.id, perihal: 'Surat Keterangan Domisili',
        dataTambahan: { keperluan: 'Melamar pekerjaan di PT. Sejahtera Bersama Kotamobagu' },
        status: 'DISETUJUI', nomorSurat: '001/SKD/MB/I/2026',
        createdById: operator1.id, approvedById: kades.id, approvedAt: new Date('2026-01-10'),
      },
      {
        jenisSurat: 'SKTM', pendudukId: halima.id, perihal: 'Surat Keterangan Tidak Mampu',
        dataTambahan: { keperluan: 'Beasiswa pendidikan anak', penghasilan_perbulan: 800000 },
        status: 'DISETUJUI', nomorSurat: '001/SKTM/MB/I/2026',
        createdById: sekdes.id, approvedById: kades.id, approvedAt: new Date('2026-01-15'),
      },
      {
        jenisSurat: 'SK_USAHA', pendudukId: abdul.id, perihal: 'Surat Keterangan Usaha',
        dataTambahan: { nama_usaha: 'Toko Kelontong Barokah', jenis_usaha: 'Perdagangan Eceran', alamat_usaha: 'Jl. Dusun 2 No. 7', sejak_tahun: 2010 },
        status: 'MENUNGGU', createdById: operator1.id,
      },
      {
        jenisSurat: 'SURAT_PENGANTAR', pendudukId: christian.id, perihal: 'Surat Pengantar ke Kecamatan',
        dataTambahan: { keperluan: 'Pengurusan KTP', tujuan: 'Kantor Kecamatan Kotamobagu Selatan', keterangan: 'Perpanjangan KTP yang sudah habis masa berlakunya' },
        status: 'MENUNGGU', createdById: sekdes.id,
      },
      {
        jenisSurat: 'SK_DOMISILI', pendudukId: rizal.id, perihal: 'Surat Keterangan Domisili',
        dataTambahan: { keperluan: 'Pendaftaran kerja online' },
        status: 'DRAFT', createdById: operator1.id,
      },
      {
        jenisSurat: 'SKTM', pendudukId: ronny.id, perihal: 'Surat Keterangan Tidak Mampu',
        dataTambahan: { keperluan: 'Bantuan sosial BPNT', penghasilan_perbulan: 3500000 },
        status: 'DITOLAK', rejectedReason: 'Data penghasilan tidak sesuai dengan kondisi sebenarnya. Penghasilan pemohon melebihi batas kelayakan penerima bantuan.',
        createdById: operator1.id, approvedById: kades.id,
      },
    ],
  });
  console.log('✅ Surat created (6 records)');

  console.log('\n🎉 Seeding selesai! Database SIDESA siap digunakan.');
  console.log('\n📊 Summary:');
  console.log('  - 1 Profil Desa');
  console.log('  - 4 Users (admin, kades, sekdes, operator1)');
  console.log('  - 12 Kartu Keluarga');
  console.log('  - 45 Penduduk (43 aktif, 1 meninggal, 1 pindah)');
  console.log('  - 8 Mutasi');
  console.log('  - 6 Surat');
  console.log('\n🔑 Login credentials:');
  console.log('  admin     / admin123');
  console.log('  kades     / kades123');
  console.log('  sekdes    / sekdes123');
  console.log('  operator1 / operator123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
