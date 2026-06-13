# 🐉 DnD Master Bot — Panduan Setup (untuk Pemula)

Bot **Dungeon Master D&D** berbasis **Telegram + Make.com + Google Sheets + AI (DeepSeek)**.
Panduan ini menjelaskan cara meng-import file `FILE FOR MAKE COM/DnD_Master_Bot_Blueprint.json` ke Make.com dan menjalankannya dari nol.

---

## 🗺️ Cara Kerja Bot

```
Pemain kirim pesan di Telegram
            ↓
   Make.com (telegram:WatchUpdates)
            ↓
   Simpan variabel (player_id, chat_id, username, text)
            ↓
   Router cek isi pesan:
     /join /status /inventory /party /scene /shortrest /longrest /help
     atau pesan biasa  →  AI Dungeon Master (DeepSeek)
            ↓
   Baca/tulis data ke Google Sheets (karakter, scene, history)
            ↓
   Balas ke Telegram (telegram:SendReplyMessage)
```

---

## ✅ Yang Harus Disiapkan Dulu

| # | Kebutuhan | Cara dapat |
|---|-----------|-----------|
| 1 | **Akun Make.com** | Daftar gratis di make.com |
| 2 | **Telegram Bot Token** | Chat **@BotFather** → `/newbot` → simpan token |
| 3 | **Akun Google** (untuk Google Sheets) | Akun Google biasa |
| 4 | **DeepSeek API Key** | Daftar di platform.deepseek.com → API Keys (atau pakai OpenAI, lihat bagian opsi) |

---

## 📊 LANGKAH 1 — Buat Google Spreadsheet

Buat **1 spreadsheet** baru, lalu buat **4 sheet/tab** dengan nama PERSIS seperti di bawah.
**Baris pertama tiap tab WAJIB berisi header** dengan urutan kolom yang sama persis (karena blueprint menulis berdasarkan posisi kolom A, B, C, ...).

### Tab `characters` (26 kolom, A → Z)
| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| char_id | player_id | campaign_id | username | char_name | race | class | level | hp_max | hp_current | ac | str | dex |

| N | O | P | Q | R | S | T | U | V | W | X | Y | Z |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| con | int | wis | cha | proficiency_bonus | inventory | conditions | death_saves_success | death_saves_fail | xp_total | background | alignment | character_status |

### Tab `campaigns` (kolom A → I)
`campaign_id` · `chat_id` · `campaign_name` · `current_scene_id` · `combat_active` · `round_number` · `created_at` · `dm_style` · `status`

### Tab `scenes` (kolom A → I)
`scene_id` · `campaign_id` · `scene_name` · `location_desc` · `enemies_json` · `key_clues` · `dm_notes` · `scene_order` · `status`

### Tab `history` (kolom A → J)
`timestamp` · `campaign_id` · `scene_id` · `player_id` · `username` · `char_name` · `player_message` · `dm_response` · `dice_rolled` · `state_changes`

> 💡 **Penting:** urutan kolom harus sama persis. Bot menulis data ke kolom berdasarkan posisi (A=0, B=1, dst), bukan berdasarkan nama.

---

## 📥 LANGKAH 2 — Import Blueprint ke Make.com

1. Login ke Make.com → menu **Scenarios** → tombol **Create a new scenario**.
2. Klik ikon **titik tiga (•••)** di bawah → **Import Blueprint**.
3. Upload file **`DnD_Master_Bot_Blueprint.json`**.
4. Scenario "DnD Master Bot" akan muncul dengan semua modul.

---

## 🔌 LANGKAH 3 — Hubungkan Koneksi (Connections)

Setelah import, beberapa modul akan bertanda peringatan (⚠️) karena koneksi perlu dipilih ulang. Ini **normal** untuk semua blueprint yang di-import.

1. **Modul Telegram** (modul pertama "Watch Updates" + semua "Send a Message"):
   - Klik modul → **Add/Select connection** → masukkan **Bot Token** dari BotFather.
2. **Modul Google Sheets** (semua modul Search/Add/Update Rows):
   - Klik modul → **Add/Select connection** → login dengan akun Google kamu.
   - Pilih **Spreadsheet** yang kamu buat di Langkah 1.
   - Pilih **Sheet** sesuai nama tab (`characters`, `campaigns`, `scenes`, atau `history`).

> 🔁 Karena koneksi & spreadsheet di-set ulang per modul, **periksa setiap modul Google Sheets** dan pastikan:
> - Spreadsheet sudah benar
> - Sheet/tab sudah benar
> - Pada modul **Search Rows**, kolom filter (`player_id`, `chat_id`, atau `campaign_id`) terpilih dari dropdown
> - Pada modul **Update a Row**, field **Row Number** ter-map ke **"Row number"** dari modul Search Rows tepat sebelumnya

---

## 🤖 LANGKAH 4 — Pasang API Key AI (DeepSeek)

1. Buka modul **HTTP** (modul "Make a request" di jalur "game" / pesan biasa).
2. Di bagian **Headers → Authorization**, ganti teks:
   ```
   Bearer YOUR_DEEPSEEK_API_KEY
   ```
   menjadi API key kamu, contoh:
   ```
   Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Simpan.

### (Opsional) Pakai OpenAI alih-alih DeepSeek
Pada modul HTTP yang sama, ubah:
- **URL** → `https://api.openai.com/v1/chat/completions`
- **Authorization** → `Bearer sk-OPENAI-KEY-KAMU`
- Di body, ubah `"model":"deepseek-chat"` → `"model":"gpt-4o-mini"` (atau model lain)

Format respons OpenAI sama (`choices[].message.content`), jadi tidak ada perubahan lain.

---

## ▶️ LANGKAH 5 — Aktifkan & Tes

1. Klik tombol **ON** (kiri bawah) untuk mengaktifkan scenario.
2. Modul Telegram "Watch Updates" otomatis mendaftarkan webhook ke bot kamu (tidak perlu setting manual).
3. Buka Telegram, chat bot kamu, lalu coba:
   ```
   /join        → buat karakter (stats di-roll otomatis 3d6)
   /status      → lihat karaktermu
   /help        → daftar perintah
   Halo, aku masuk ke kedai tua...   → main bareng DM (AI)
   ```

---

## ⌨️ Daftar Perintah

| Perintah | Fungsi |
|----------|--------|
| `/join` | Buat karakter baru (roll STR/DEX/CON/INT/WIS/CHA otomatis) |
| `/status` | Lihat stats & HP karakter |
| `/inventory` | Lihat isi tas |
| `/party` | Lihat semua karakter di campaign ini |
| `/scene` | Lihat lokasi/adegan saat ini |
| `/shortrest` | Istirahat singkat (pulih HP via Hit Die + CON mod) |
| `/longrest` | Istirahat panjang (HP penuh, kondisi pulih) |
| `/help` atau `/start` | Tampilkan bantuan |
| *(pesan biasa)* | Bermain bersama AI Dungeon Master |

---

## 🧩 Detail Teknis Blueprint

- **Trigger:** `telegram:WatchUpdates` — Make mengelola webhook otomatis (lebih mudah untuk pemula daripada custom webhook).
- **Kirim pesan:** `telegram:SendReplyMessage` dengan field `chatId` + `text`. `parseMode` sengaja dikosongkan agar karakter khusus dari AI tidak menyebabkan error Markdown.
- **Database:** Google Sheets. **Membaca** data pakai nama header (`{{20.char_name}}`), **menulis** data pakai posisi kolom (`"0"`, `"1"`, ...) — ini sesuai cara kerja Make.
- **Update HP:** modul Update a Row butuh **Row Number**, yang diambil dari modul Search Rows sebelumnya (`{{40.__ROW_NUMBER__}}`). Seluruh kolom di-tulis ulang agar data lain tidak terhapus.
- **AI DM:** modul HTTP POST ke DeepSeek dengan prompt yang berisi konteks scene, karakter, dan history percakapan terakhir.

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Modul Google Sheets error "Missing rowNumber" | Buka Update a Row → map field **Row Number** ke "Row number" dari Search Rows tepat sebelumnya |
| Data tersimpan di kolom yang salah | Pastikan urutan & nama header di tab sheet sama persis dengan Langkah 1 |
| Bot tidak membalas | Pastikan scenario **ON**, dan koneksi Telegram memakai token bot yang benar |
| AI error 401 | API key DeepSeek/OpenAI salah atau saldo habis |
| Filter Search Rows tidak menemukan data | Buka modul → pilih ulang kolom filter dari dropdown |

---

## 📁 File dalam Repo

```
DND-MASTER-BOT/
├── SETUP_GUIDE.md                         ← panduan ini
└── FILE FOR MAKE COM/
    ├── DnD_Master_Bot_Blueprint.json      ← blueprint utama (import file ini ke Make.com)
    ├── BLUPRINT                           ← draf konsep awal (referensi)
    └── EXAMPLE                            ← contoh blueprint Make.com (referensi skema)
```

> ⚠️ Catatan: Make.com kadang perlu sedikit penyesuaian field di GUI setelah import (memilih ulang spreadsheet, sheet, kolom filter, dan koneksi). Ini wajar untuk semua blueprint dan sudah dijelaskan di Langkah 3.
