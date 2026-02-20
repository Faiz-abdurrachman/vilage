const ExcelJS = require('exceljs');
const pendudukService = require('../services/penduduk.service');
const { hitungUmur } = require('../utils/formatDate');

async function getAll(req, res, next) {
  try {
    const result = await pendudukService.getAllPenduduk(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await pendudukService.getPendudukById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await pendudukService.createPenduduk(req.body);
    res.status(201).json({ success: true, message: 'Data penduduk berhasil ditambahkan.', data });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await pendudukService.updatePenduduk(req.params.id, req.body);
    res.json({ success: true, message: 'Data penduduk berhasil diperbarui.', data });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await pendudukService.deletePenduduk(req.params.id);
    res.json({ success: true, message: 'Data penduduk berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
}

async function exportExcel(req, res, next) {
  try {
    const pendudukList = await pendudukService.exportPenduduk(req.query);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Penduduk');

    sheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'Nama Lengkap', key: 'namaLengkap', width: 30 },
      { header: 'Tempat Lahir', key: 'tempatLahir', width: 20 },
      { header: 'Tanggal Lahir', key: 'tanggalLahir', width: 15 },
      { header: 'Umur', key: 'umur', width: 8 },
      { header: 'Jenis Kelamin', key: 'jenisKelamin', width: 15 },
      { header: 'Agama', key: 'agama', width: 12 },
      { header: 'Status Kawin', key: 'statusPerkawinan', width: 15 },
      { header: 'Pekerjaan', key: 'pekerjaan', width: 20 },
      { header: 'Pendidikan', key: 'pendidikanTerakhir', width: 12 },
      { header: 'Alamat', key: 'alamat', width: 30 },
      { header: 'RT', key: 'rt', width: 6 },
      { header: 'RW', key: 'rw', width: 6 },
      { header: 'Dusun', key: 'dusun', width: 12 },
      { header: 'No. KK', key: 'noKk', width: 20 },
      { header: 'Status', key: 'statusPenduduk', width: 12 },
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    headerRow.height = 30;

    // Freeze header row
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    pendudukList.forEach((p, index) => {
      const row = sheet.addRow({
        no: index + 1,
        nik: p.nik,
        namaLengkap: p.namaLengkap,
        tempatLahir: p.tempatLahir,
        tanggalLahir: new Date(p.tanggalLahir).toLocaleDateString('id-ID'),
        umur: hitungUmur(p.tanggalLahir),
        jenisKelamin: p.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan',
        agama: p.agama,
        statusPerkawinan: p.statusPerkawinan.replace(/_/g, ' '),
        pekerjaan: p.pekerjaan,
        pendidikanTerakhir: p.pendidikanTerakhir,
        alamat: p.alamat,
        rt: p.rt,
        rw: p.rw,
        dusun: p.kartuKeluarga?.dusun || '-',
        noKk: p.kartuKeluarga?.noKk || '-',
        statusPenduduk: p.statusPenduduk,
      });

      // Alternating row color
      if (index % 2 === 1) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      }
      row.font = { size: 10 };

      // Format NIK and noKK as text (prevent leading zero removal)
      row.getCell('nik').numFmt = '@';
      row.getCell('noKk').numFmt = '@';
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="data-penduduk-${Date.now()}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, exportExcel };
