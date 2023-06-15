# 🎼 OpenMusic

OpenMusic adalah layanan backend yang digunakan untuk submission pada kelas "Fundamental Aplikasi Back-end" Dicoding Indonesia.

## ✅ To-do List

- [x] ~~Kriteria wajib~~
  - [x] CRUD `/albums` endpoint (gunakan plugin)
  - [x] CRUD `/songs` endpoint (gunakan plugin)
  - [x] Validasi data di kedua endpoint menggunakan `Joi`
  - [x] Error Handling (gunakan extension `onPreResponse` event dari Hapi)
  - [x] Menggunakan database dan `dotenv`
- [x] Kriteria opsional
  - [x] Memunculkan daftar lagu pada suatu album
  - [x] Query parameter untuk mencari lagu
- [x] Memenuhi semua postman request (Test API)
- [x] Menggunakan `ESLint` dan salah satu style guide
- [x] Clean code

## 💡 Tips

- Untuk menghindari kesalahan `binding` :
  - Gunakan arrow function pada berkas routes (Preferred, lighter, no need to install any packages)
  - Gunakan package `auto-bind`
