# 🌸 Rifka Birthday Website

Website ulang tahun romantis untuk Rifka Wang, dibuat dengan React + Vite.

---

## 🚀 Cara Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka: http://localhost:3000

---

## ✏️ Cara Edit Konten

Semua konfigurasi ada di satu file: **`src/config.js`**

Kamu bisa mengubah:
- `recipientName` → nama penerima
- `senderName` → nama pengirim
- `correctAnswer` → jawaban pertanyaan akses
- `openDate` / `closeDate` → tanggal buka dan tutup
- `adminPassword` → password halaman admin
- `photos` → path foto dan caption
- `video` → path video dan caption
- `wishText` → isi ucapan ulang tahun (array paragraf)
- `memoriesText` → kata-kata di halaman memories

---

## 🖼️ Cara Menambah Foto dan Video

Taruh file di folder: `public/assets/`

| File | Keterangan |
|------|-----------|
| `photo1.jpg` | Foto polaroid kiri |
| `photo2.jpg` | Foto polaroid kanan |
| `video1.mp4` | Video memories |

**Tips iPhone Safari:**
- Foto: JPG/WEBP, < 2MB per foto
- Video: MP4 (H.264 + AAC audio), < 30MB

---

## 🔥 Setup Firebase

1. Buat project di [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database**
3. Salin config Firebase ke **`src/config.js`** bagian `FIREBASE_CONFIG`
4. Set Firestore rules (development):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
5. Untuk production, batasi rules sesuai kebutuhan

---

## 📊 Firestore Collections

| Collection | Isi |
|-----------|-----|
| `visits` | Data kunjungan & session |
| `access_logs` | Log jawaban pertanyaan akses |
| `interactions` | Klik menu, durasi, video plays |

---

## 🔐 Halaman Admin

Akses di: `yourdomain.com/admin`

Password default: `rifkawang2026`

Ganti di `src/config.js` → `adminPassword`

---

## ☁️ Deploy ke Vercel

```bash
npm run build
```

Lalu:
1. Push ke GitHub
2. Connect repo di [vercel.com](https://vercel.com)
3. Deploy otomatis ✅

File `vercel.json` sudah ada untuk handle SPA routing (termasuk route `/admin`).

---

## 📁 Struktur File

```
src/
├── App.jsx                    # Root app + date logic
├── main.jsx                   # Entry point
├── config.js                  # ✏️ EDIT INI untuk ubah konten
├── firebase.js                # Analytics & tracking
├── styles.css                 # Global styles
└── components/
    ├── FloatingHearts.jsx     # Background animation
    ├── CountdownPage.jsx      # Halaman countdown
    ├── AccessQuestionPage.jsx # Halaman pertanyaan
    ├── HomePage.jsx           # Halaman utama
    ├── WishPage.jsx           # Halaman wish
    ├── MemoriesPage.jsx       # Halaman memories
    ├── ClosedPage.jsx         # Halaman closed
    └── AdminPage.jsx          # Halaman admin

public/
└── assets/
    ├── photo1.jpg             # Taruh foto di sini
    ├── photo2.jpg
    └── video1.mp4
```

---

## 📱 Mobile / iPhone Notes

- Tested untuk Safari iOS (iPhone SE → iPhone Pro Max)
- Safe area insets untuk notch / dynamic island
- Video `playsInline` untuk autoplay policy iOS
- Font minimum 16px di input untuk avoid zoom
- Touch targets minimum 44-56px height

---

Made with 💕 for Rifka Wang
