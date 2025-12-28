# MotoMetric 🏍️

Aplikasi pencatat servis motor dengan **Dual Trigger System** - gabungan KM dan waktu untuk notifikasi yang akurat dan personal.

## ✨ Fitur Utama

- **Dual Trigger System**: Kombinasi trigger KM dan waktu untuk estimasi servis yang akurat
- **Multi Motor (Garasi)**: Kelola beberapa motor sekaligus
- **Smart Presets**: Template komponen otomatis berdasarkan tipe motor
- **Progress Bar Ganda**: Visualisasi status KM dan waktu terpisah
- **Riwayat Servis**: Log semua servis yang pernah dilakukan
- **Export/Import Data**: Backup dan restore data via file JSON
- **PWA Ready**: Bisa di-install sebagai aplikasi di HP

## 🚀 Tech Stack

- **Framework**: SvelteKit (Svelte 5)
- **Styling**: Tailwind CSS
- **Database**: LocalStorage (client-side)
- **Deployment**: Vercel

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
```

## 🎯 Cara Pakai

1. **Tambah Motor**: Klik tombol "+" atau "Tambah Motor Pertama"
2. **Pilih Tipe**: Pilih tipe motor (Matic Honda, Sport Yamaha, dll) - komponen akan otomatis dimuat
3. **Input Odometer**: Masukkan KM saat ini dari speedometer
4. **Set Pemakaian Harian**: Geser slider untuk estimasi km/hari
5. **Update Rutin**: Tap angka odometer di dashboard untuk update KM terbaru
6. **Catat Servis**: Tap tombol servis di komponen yang sudah diservis

## 📊 Logika Dual Trigger

Aplikasi menghitung dua persentase keausan:

- **Trigger KM**: `(KM Sekarang - KM Servis Terakhir) / Interval KM × 100%`
- **Trigger Waktu**: `(Hari Ini - Tanggal Servis Terakhir) / (Interval Bulan × 30) × 100%`

Sistem mengambil nilai **tertinggi** dari keduanya sebagai status keausan.

### Status Warna:
- 🟢 **Hijau (Aman)**: < 80%
- 🟡 **Kuning (Warning)**: 80% - 99%
- 🔴 **Merah (Bahaya)**: >= 100%

## 🏍️ Tipe Motor yang Didukung

- Matic Honda (Vario, Beat, Scoopy)
- Matic Yamaha (NMAX, Aerox, Mio)
- Sport Honda (CBR, CB150R, Sonic)
- Sport Yamaha (Vixion, R15, MT-15)
- Bebek Honda (Supra, Revo, Blade)
- Bebek Yamaha (Jupiter, Vega)

## 🔐 Privasi

Semua data disimpan **lokal di browser** kamu. Tidak ada data yang dikirim ke server manapun. Gunakan fitur Export untuk backup data.

## 📱 Install sebagai PWA

1. Buka aplikasi di browser HP
2. Tap ikon Share/Menu
3. Pilih "Add to Home Screen" atau "Install App"

## 🤝 Kontribusi

Pull requests are welcome! Untuk perubahan besar, buka issue terlebih dahulu untuk diskusi.

## 📄 License

MIT

---

Made with ❤️ for Indonesian Riders
