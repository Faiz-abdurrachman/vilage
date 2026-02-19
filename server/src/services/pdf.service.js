const PDFDocument = require('pdfkit');
const { formatDateIndonesia } = require('../utils/formatDate');
const { SURAT_JUDUL } = require('../utils/constants');

function generateSuratPDF(surat, penduduk, desaProfil) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - 100; // 50 margin each side

    // ================================================
    // KOP SURAT
    // ================================================
    doc.fontSize(12).font('Helvetica-Bold')
      .text('PEMERINTAH KOTA KOTAMOBAGU', { align: 'center' });
    doc.fontSize(11)
      .text('KECAMATAN KOTAMOBAGU SELATAN', { align: 'center' });
    doc.fontSize(14)
      .text(`DESA ${(desaProfil?.namaDesa || 'MOTOBOI BESAR').toUpperCase()}`, { align: 'center' });
    doc.fontSize(9).font('Helvetica')
      .text(`Alamat: ${desaProfil?.alamatKantor || 'Jl. Trans Sulawesi, Desa Motoboi Besar'}, Kode Pos: ${desaProfil?.kodePos || '95716'}`, { align: 'center' });
    doc.text(`Telp: ${desaProfil?.telepon || '(0434) 123456'}`, { align: 'center' });

    // Garis double
    doc.moveDown(0.5);
    const y1 = doc.y;
    doc.moveTo(50, y1).lineTo(545, y1).lineWidth(2).stroke();
    doc.moveTo(50, y1 + 3).lineTo(545, y1 + 3).lineWidth(0.5).stroke();

    // ================================================
    // JUDUL SURAT
    // ================================================
    doc.moveDown(1);
    const judulSurat = SURAT_JUDUL[surat.jenisSurat] || 'SURAT KETERANGAN';
    doc.fontSize(13).font('Helvetica-Bold')
      .text(judulSurat, { align: 'center', underline: true });

    if (surat.nomorSurat) {
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica')
        .text(`Nomor: ${surat.nomorSurat}`, { align: 'center' });
    }

    // ================================================
    // BODY SURAT
    // ================================================
    doc.moveDown(1.5);
    doc.fontSize(11).font('Helvetica');

    const namaDesa = desaProfil?.namaDesa || 'Motoboi Besar';
    const kecamatan = desaProfil?.kecamatan || 'Kotamobagu Selatan';
    const kabupaten = desaProfil?.kabupatenKota || 'Kota Kotamobagu';
    const namaKades = desaProfil?.namaKades || 'Ibrahim Mokodompit';

    // Paragraf pembuka
    doc.text(
      `Yang bertanda tangan di bawah ini, Kepala Desa ${namaDesa}, Kecamatan ${kecamatan}, ` +
      `${kabupaten}, dengan ini menerangkan bahwa:`,
      { align: 'justify', lineGap: 4 }
    );

    // Data penduduk
    doc.moveDown(1);
    const labelWidth = 150;
    const dataFields = [
      ['Nama Lengkap', penduduk.namaLengkap],
      ['NIK', penduduk.nik],
      ['Tempat / Tgl. Lahir', `${penduduk.tempatLahir}, ${formatDateIndonesia(penduduk.tanggalLahir)}`],
      ['Jenis Kelamin', penduduk.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'],
      ['Agama', penduduk.agama.charAt(0) + penduduk.agama.slice(1).toLowerCase()],
      ['Pekerjaan', penduduk.pekerjaan],
      ['Kewarganegaraan', penduduk.kewarganegaraan],
      ['Alamat', `RT ${penduduk.rt} / RW ${penduduk.rw}, ${penduduk.alamat}`],
    ];

    dataFields.forEach(([label, value]) => {
      const currentY = doc.y;
      doc.font('Helvetica').text(label, 50, currentY, { width: labelWidth, continued: false });
      doc.text(':', 50 + labelWidth, currentY, { width: 15, continued: false });
      doc.text(value || '-', 50 + labelWidth + 20, currentY, { width: pageWidth - labelWidth - 20 });
    });

    // Paragraf isi sesuai jenis surat
    doc.moveDown(1.5);
    const dataTambahan = surat.dataTambahan || {};

    let isiSurat = '';

    switch (surat.jenisSurat) {
      case 'SK_DOMISILI':
        isiSurat = `Adalah benar merupakan warga Desa ${namaDesa} yang berdomisili di alamat tersebut di atas. ` +
          `Surat keterangan ini dibuat untuk keperluan: ${dataTambahan.keperluan || '-'}.`;
        break;

      case 'SKTM':
        const penghasilan = dataTambahan.penghasilan_perbulan || dataTambahan.penghasilanPerbulan || 0;
        isiSurat = `Adalah benar merupakan warga Desa ${namaDesa} yang termasuk dalam kategori ` +
          `Keluarga Tidak Mampu dengan penghasilan per bulan ± Rp ${Number(penghasilan).toLocaleString('id-ID')},- ` +
          `(${terbilang(penghasilan)} Rupiah). Surat keterangan ini dibuat untuk keperluan: ${dataTambahan.keperluan || '-'}.`;
        break;

      case 'SK_USAHA':
        isiSurat = `Adalah benar memiliki usaha dengan keterangan sebagai berikut:\n` +
          `Nama Usaha   : ${dataTambahan.nama_usaha || dataTambahan.namaUsaha || '-'}\n` +
          `Jenis Usaha  : ${dataTambahan.jenis_usaha || dataTambahan.jenisUsaha || '-'}\n` +
          `Alamat Usaha : ${dataTambahan.alamat_usaha || dataTambahan.alamatUsaha || '-'}\n` +
          `Berdiri Sejak: Tahun ${dataTambahan.sejak_tahun || dataTambahan.sejakTahun || '-'}`;
        break;

      case 'SK_KELAHIRAN':
        isiSurat = `Bahwa pada tanggal ${formatDateIndonesia(dataTambahan.tanggal_lahir || dataTambahan.tanggalLahir || new Date())}, ` +
          `telah lahir seorang anak ${dataTambahan.jenis_kelamin === 'PEREMPUAN' ? 'perempuan' : 'laki-laki'} bernama ` +
          `"${dataTambahan.nama_bayi || dataTambahan.namaBayi || '-'}", lahir di ${dataTambahan.tempat_lahir || dataTambahan.tempatLahir || '-'}, ` +
          `anak ke-${dataTambahan.anak_ke || dataTambahan.anakKe || '-'} dari pasangan ` +
          `${dataTambahan.nama_ayah || dataTambahan.namaAyah || '-'} dan ${dataTambahan.nama_ibu || dataTambahan.namaIbu || '-'}.`;
        break;

      case 'SK_KEMATIAN':
        isiSurat = `Bahwa berdasarkan laporan keluarga, yang bersangkutan tersebut di atas telah meninggal dunia pada ` +
          `tanggal ${formatDateIndonesia(dataTambahan.tanggal_meninggal || dataTambahan.tanggalMeninggal || new Date())}, ` +
          `bertempat di ${dataTambahan.tempat_meninggal || dataTambahan.tempatMeninggal || '-'}, ` +
          `dengan penyebab: ${dataTambahan.penyebab || '-'}.`;
        break;

      case 'SURAT_PENGANTAR':
        isiSurat = `Memberikan pengantar kepada yang bersangkutan di atas untuk keperluan: ` +
          `${dataTambahan.keperluan || '-'}, yang ditujukan kepada ${dataTambahan.tujuan || '-'}. ` +
          `${dataTambahan.keterangan ? 'Keterangan tambahan: ' + dataTambahan.keterangan + '.' : ''}`;
        break;

      default:
        isiSurat = 'Adalah benar merupakan warga Desa yang terdaftar dalam data kependudukan.';
    }

    doc.font('Helvetica').text(isiSurat, { align: 'justify', lineGap: 4 });

    // Paragraf penutup
    doc.moveDown(1);
    doc.text(
      'Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
      { align: 'justify', lineGap: 4 }
    );

    // ================================================
    // TANDA TANGAN
    // ================================================
    doc.moveDown(2);
    const tanggalApprove = surat.approvedAt ? formatDateIndonesia(surat.approvedAt) : formatDateIndonesia(new Date());
    const signX = 350;

    doc.font('Helvetica').fontSize(11)
      .text(`${namaDesa}, ${tanggalApprove}`, signX, doc.y, { width: 200, align: 'center' });
    doc.text(`Kepala Desa ${namaDesa}`, signX, doc.y + 5, { width: 200, align: 'center' });

    // Spasi tanda tangan
    doc.moveDown(4);

    doc.font('Helvetica-Bold').fontSize(11)
      .text(namaKades, signX, doc.y, { width: 200, align: 'center', underline: true });

    if (desaProfil?.nipKades) {
      doc.font('Helvetica').fontSize(10)
        .text(`NIP. ${desaProfil.nipKades}`, signX, doc.y + 5, { width: 200, align: 'center' });
    }

    doc.end();
  });
}

// Helper untuk SKTM (terbilang sederhana)
function terbilang(angka) {
  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan',
    'Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas',
    'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
  const n = parseInt(angka);
  if (n === 0) return 'Nol';
  if (n < 20) return satuan[n];
  if (n < 100) return satuan[Math.floor(n / 10) + 10 - 10] + ' Puluh' + (n % 10 !== 0 ? ' ' + satuan[n % 10] : '');
  if (n < 1000) return satuan[Math.floor(n / 100)] + ' Ratus' + (n % 100 !== 0 ? ' ' + terbilang(n % 100) : '');
  if (n < 1000000) {
    const ribuan = Math.floor(n / 1000);
    const sisa = n % 1000;
    return (ribuan === 1 ? 'Seribu' : terbilang(ribuan) + ' Ribu') + (sisa !== 0 ? ' ' + terbilang(sisa) : '');
  }
  if (n < 1000000000) {
    const juta = Math.floor(n / 1000000);
    const sisa = n % 1000000;
    return terbilang(juta) + ' Juta' + (sisa !== 0 ? ' ' + terbilang(sisa) : '');
  }
  return angka.toString();
}

module.exports = { generateSuratPDF };
