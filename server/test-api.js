/**
 * SIDESA API Test Script
 * Run: node test-api.js (saat server sudah running)
 */

const BASE_URL = 'http://localhost:5000/api';

let token = '';
let firstPendudukId = '';
let firstKKId = '';
let firstMutasiId = '';
let firstSuratId = '';
let approvedSuratId = '';

let passCount = 0;
let failCount = 0;

async function request(method, path, body, authToken) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (authToken || token) opts.headers['Authorization'] = `Bearer ${authToken || token}`;
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${path}`, opts);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  } catch (e) {
    return { status: 0, error: e.message };
  }
}

function pass(name, detail = '') {
  console.log(`✅ PASS: ${name}${detail ? ' — ' + detail : ''}`);
  passCount++;
}

function fail(name, detail = '') {
  console.error(`❌ FAIL: ${name}${detail ? ' — ' + detail : ''}`);
  failCount++;
}

function check(name, condition, detail = '') {
  condition ? pass(name, detail) : fail(name, detail);
}

async function runTests() {
  console.log('\n🔍 SIDESA API Test Suite\n' + '='.repeat(50));

  // ===== AUTH =====
  console.log('\n--- AUTH ---');

  // 1. Login berhasil
  let r = await request('POST', '/auth/login', { username: 'admin', password: 'admin123' });
  if (r.data?.token) {
    token = r.data.token;
    pass('POST /auth/login (admin/admin123)', `token: ${token.slice(0, 20)}...`);
  } else {
    fail('POST /auth/login (admin/admin123)', JSON.stringify(r.data));
  }

  // 2. Login gagal
  r = await request('POST', '/auth/login', { username: 'admin', password: 'wrongpassword' });
  check('POST /auth/login (wrong password) → 401', r.status === 401, `status: ${r.status}`);

  // 3. GET /me
  r = await request('GET', '/auth/me');
  check('GET /auth/me', r.data?.data?.username === 'admin', `user: ${r.data?.data?.username}`);
  check('GET /auth/me — no password field', !r.data?.data?.password, 'password tidak ada');

  // ===== DASHBOARD =====
  console.log('\n--- DASHBOARD ---');

  r = await request('GET', '/dashboard/stats');
  check('GET /dashboard/stats', r.status === 200 && r.data?.data?.totalPenduduk >= 0,
    `total: ${r.data?.data?.totalPenduduk} penduduk`);

  r = await request('GET', '/dashboard/demografi');
  check('GET /dashboard/demografi', r.status === 200, `status: ${r.status}`);

  r = await request('GET', '/dashboard/mutasi-bulanan');
  check('GET /dashboard/mutasi-bulanan', r.status === 200, `status: ${r.status}`);

  // ===== PENDUDUK =====
  console.log('\n--- PENDUDUK ---');

  r = await request('GET', '/penduduk?page=1&limit=5');
  check('GET /penduduk?page=1&limit=5', r.data?.data?.length <= 5, `count: ${r.data?.data?.length}`);
  check('GET /penduduk — meta exists', !!r.data?.meta?.totalPages, `totalPages: ${r.data?.meta?.totalPages}`);
  if (r.data?.data?.[0]) firstPendudukId = r.data.data[0].id;

  r = await request('GET', '/penduduk?search=Ibrahim');
  check('GET /penduduk?search=Ibrahim', r.status === 200, `results: ${r.data?.data?.length}`);

  if (firstPendudukId) {
    r = await request('GET', `/penduduk/${firstPendudukId}`);
    check('GET /penduduk/:id', r.status === 200, `nama: ${r.data?.data?.namaLengkap}`);
    check('GET /penduduk/:id — has mutasi', Array.isArray(r.data?.data?.mutasi), `mutasi count: ${r.data?.data?.mutasi?.length}`);
    check('GET /penduduk/:id — has surat', Array.isArray(r.data?.data?.surat), `surat count: ${r.data?.data?.surat?.length}`);
  }

  // ===== KARTU KELUARGA =====
  console.log('\n--- KARTU KELUARGA ---');

  r = await request('GET', '/kartu-keluarga');
  check('GET /kartu-keluarga', r.status === 200, `count: ${r.data?.meta?.total}`);
  if (r.data?.data?.[0]) firstKKId = r.data.data[0].id;

  if (firstKKId) {
    r = await request('GET', `/kartu-keluarga/${firstKKId}`);
    check('GET /kartu-keluarga/:id', r.status === 200, `noKk: ${r.data?.data?.noKk}`);
  }

  // ===== MUTASI =====
  console.log('\n--- MUTASI ---');

  r = await request('GET', '/mutasi');
  check('GET /mutasi', r.status === 200, `total: ${r.data?.meta?.total}`);
  if (r.data?.data?.[0]) firstMutasiId = r.data.data[0].id;

  if (firstMutasiId) {
    r = await request('GET', `/mutasi/${firstMutasiId}`);
    check('GET /mutasi/:id', r.status === 200);
  }

  // ===== SURAT =====
  console.log('\n--- SURAT ---');

  r = await request('GET', '/surat');
  check('GET /surat', r.status === 200, `total: ${r.data?.meta?.total}`);
  if (r.data?.data?.[0]) firstSuratId = r.data.data[0].id;

  // Cari surat DISETUJUI untuk test PDF
  r = await request('GET', '/surat?status=DISETUJUI');
  if (r.data?.data?.[0]) {
    approvedSuratId = r.data.data[0].id;
    check('GET /surat?status=DISETUJUI', true, `found: ${approvedSuratId}`);
  } else {
    check('GET /surat?status=DISETUJUI', false, 'tidak ada surat disetujui');
  }

  // Test PDF
  if (approvedSuratId) {
    const res = await fetch(`${BASE_URL}/surat/${approvedSuratId}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    check('GET /surat/:id/pdf', res.status === 200 && res.headers.get('content-type')?.includes('pdf'),
      `content-type: ${res.headers.get('content-type')}`);
  }

  if (firstSuratId) {
    r = await request('GET', `/surat/${firstSuratId}`);
    check('GET /surat/:id', r.status === 200, `jenis: ${r.data?.data?.jenisSurat}`);
  }

  // ===== USERS =====
  console.log('\n--- USERS ---');

  r = await request('GET', '/users');
  check('GET /users', r.status === 200, `count: ${r.data?.data?.length}`);
  check('GET /users — no password', !r.data?.data?.[0]?.password, 'password tidak ada di response');

  // ===== PENGATURAN =====
  console.log('\n--- PENGATURAN ---');

  r = await request('GET', '/pengaturan/profil-desa');
  check('GET /pengaturan/profil-desa', r.status === 200, `desa: ${r.data?.data?.namaDesa}`);

  // ===== SUMMARY =====
  console.log('\n' + '='.repeat(50));
  console.log(`📊 HASIL: ${passCount} PASS, ${failCount} FAIL`);
  if (failCount === 0) {
    console.log('🎉 Semua test PASS! API berfungsi dengan baik.\n');
  } else {
    console.log(`⚠️  Ada ${failCount} test yang FAIL. Perlu diperbaiki.\n`);
  }
}

runTests().catch(console.error);
