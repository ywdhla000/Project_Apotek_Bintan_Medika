# Bintan Medika — Frontend (HTML/CSS/JS)

Tiga halaman sesuai mockup:

- `index.html` — Etalase Obat (POV Pembeli)
- `login.html` — Login / Daftar (POV Pembeli & Admin)
- `dashboard.html` — Dashboard Admin

```
assets/
  css/
    style.css      -> token warna, tipografi, komponen bersama (tombol, avatar, toast)
    etalase.css     -> khusus halaman etalase
    login.css       -> khusus halaman login/daftar
    dashboard.css   -> khusus halaman dashboard admin
  js/
    etalase.js      -> data produk dummy + filter kategori + search + keranjang
    login.js        -> toggle Pembeli/Admin, tab Masuk/Daftar, submit
    dashboard.js     -> data statistik & pesanan dummy + render tabel
```

Buka langsung di browser (double-click `index.html`, `login.html`, atau
`dashboard.html`) — semuanya jalan tanpa server, karena datanya masih dummy
(array JS di masing-masing file `.js`).

## Rencana migrasi ke Django

Setiap file punya komentar `Django note:` di titik yang nanti berubah.
Ringkasannya:

1. **Static files** — pindahkan folder `assets/` apa adanya ke
   `yourapp/static/`. Ganti semua `href="assets/..."` / `src="assets/..."`
   jadi `{% load static %}` + `{% static 'css/style.css' %}`.

2. **Template inheritance** — pecah bagian yang berulang jadi partial:
   - Navbar di `index.html` → `partials/navbar.html`
   - Sidebar di `dashboard.html` → `partials/sidebar.html`
   Lalu buat `base.html` dengan `{% block content %}`.

3. **Data dummy → context** — array `PRODUCTS`, `ORDERS`, `STATS` di file
   `.js` masing-masing sudah dibuat menyerupai bentuk data model
   (`id, name, price, stock, cat`, dst). Cara paling gampang tanpa
   menulis ulang JS:
   ```django
   {{ produk_list|json_script:"produk-data" }}
   ```
   lalu di `etalase.js` ganti baris `const PRODUCTS = [...]` dengan:
   ```js
   const PRODUCTS = JSON.parse(document.getElementById('produk-data').textContent);
   ```
   Filter kategori, search, dan render grid tidak perlu diubah sama sekali.

4. **Form login/daftar** — di `login.html`, ganti:
   ```html
   <form id="formMasuk" class="authform" novalidate>
   ```
   menjadi
   ```html
   <form id="formMasuk" class="authform" method="post" action="{% url 'login' %}">
     {% csrf_token %}
   ```
   dan hapus `e.preventDefault()` + redirect dummy di `login.js` (biarkan
   Django yang redirect lewat `LOGIN_REDIRECT_URL` / `success_url`,
   dibedakan per role pembeli/admin di view).

5. **Keranjang & pesanan** — tombol "+ Keranjang" dan aksi sidebar admin
   sudah diberi komentar di JS persis di titik mana `fetch()` ke endpoint
   Django (mis. `/keranjang/tambah/`, `/pesanan/<id>/status/`) akan
   dipasang nanti.

Intinya: struktur, class CSS, dan alur interaksi sudah final — bagian yang
berubah saat masuk Django cuma sumber datanya (dummy array → context/API)
dan cara file di-serve (folder lokal → `{% static %}`).
