const ExcelJS = require('exceljs');
const suratService = require('../services/surat.service');
const { generateSuratPDF } = require('../services/pdf.service');

async function getAll(req, res, next) {
  try {
    const result = await suratService.getAllSurat(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await suratService.getSuratById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await suratService.createSurat(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Draft surat berhasil dibuat.', data });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await suratService.updateSurat(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: 'Surat berhasil diperbarui.', data });
  } catch (err) {
    next(err);
  }
}

async function submit(req, res, next) {
  try {
    const data = await suratService.submitSurat(req.params.id, req.user.id);
    res.json({ success: true, message: 'Surat berhasil diajukan untuk persetujuan.', data });
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const data = await suratService.approveSurat(req.params.id, req.user.id);
    res.json({ success: true, message: `Surat berhasil disetujui. Nomor: ${data.nomorSurat}`, data });
  } catch (err) {
    next(err);
  }
}

async function reject(req, res, next) {
  try {
    const { rejectedReason } = req.body;
    const data = await suratService.rejectSurat(req.params.id, req.user.id, rejectedReason);
    res.json({ success: true, message: 'Surat berhasil ditolak.', data });
  } catch (err) {
    next(err);
  }
}

async function downloadPDF(req, res, next) {
  try {
    const surat = await suratService.getSuratById(req.params.id);

    if (surat.status !== 'DISETUJUI') {
      return res.status(400).json({ success: false, message: 'PDF hanya tersedia untuk surat yang sudah disetujui.' });
    }

    const desaProfil = await suratService.getDesaProfil();
    const pdfBuffer = await generateSuratPDF(surat, surat.penduduk, desaProfil);

    const filename = `surat-${surat.nomorSurat?.replace(/\//g, '-') || surat.id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}

async function exportExcel(req, res, next) {
  try {
    const suratList = await suratService.exportSuratList(req.query);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Surat');

    sheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nomor Surat', key: 'nomorSurat', width: 25 },
      { header: 'Jenis Surat', key: 'jenisSurat', width: 20 },
      { header: 'Nama Penduduk', key: 'namaLengkap', width: 30 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Dibuat Oleh', key: 'createdBy', width: 25 },
      { header: 'Disetujui Oleh', key: 'approvedBy', width: 25 },
      { header: 'Tanggal Dibuat', key: 'createdAt', width: 18 },
      { header: 'Tanggal Disetujui', key: 'approvedAt', width: 18 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };

    suratList.forEach((s, index) => {
      sheet.addRow({
        no: index + 1,
        nomorSurat: s.nomorSurat || '-',
        jenisSurat: s.jenisSurat.replace(/_/g, ' '),
        namaLengkap: s.penduduk?.namaLengkap || '-',
        nik: s.penduduk?.nik || '-',
        status: s.status,
        createdBy: s.createdBy?.namaLengkap || '-',
        approvedBy: s.approvedBy?.namaLengkap || '-',
        createdAt: new Date(s.createdAt).toLocaleDateString('id-ID'),
        approvedAt: s.approvedAt ? new Date(s.approvedAt).toLocaleDateString('id-ID') : '-',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="data-surat-${Date.now()}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, submit, approve, reject, downloadPDF, exportExcel };
