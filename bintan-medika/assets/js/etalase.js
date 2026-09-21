/* ============================================================
   Etalase Obat — front-end logic.
   Everything in PRODUCTS below is a stand-in for data that will
   later come from Django, e.g.:
     {{ produk_list|json_script:"produk-data" }}
   and this file would read it with:
     const PRODUCTS = JSON.parse(document.getElementById('produk-data').textContent);
   The rendering, filtering and cart logic below stays the same
   either way — only where PRODUCTS comes from changes.
   ============================================================ */

const ICONS = {
  bebas:   '<path d="M8.5 3.5 15 10a4.5 4.5 0 1 1-6.36 6.36L2.5 9.7a3 3 0 0 1 4.24-4.24" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M11 6.5 15.5 11" stroke="currentColor" stroke-width="1.5"/>',
  vitamin: '<path d="M12 3v4M12 17v4M4 12h4M16 12h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="5.2" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  resep:   '<rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  alat:    '<path d="M8 6h8v4a4 4 0 1 1-8 0V6Z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 14v3M9 20h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  ibu:     '<path d="M12 21s-7-4.4-7-10a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 11c0 5.6-7 10-7 10Z" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  tubuh:   '<path d="M12 2c-3 3-7 6-7 11a7 7 0 0 0 14 0c0-5-4-8-7-11Z" stroke="currentColor" stroke-width="1.5" fill="none"/>',
};

const TINTS = ['tint-mint', 'tint-peach', 'tint-sky', 'tint-sand', 'tint-lilac'];

const PRODUCTS = [
  { id: 1, cat: 'bebas',   catLabel: 'Obat Bebas',        name: 'Paracetamol 500mg',   unit: 'Strip · 10 tablet', price: 8500,  stock: 240 },
  { id: 2, cat: 'vitamin', catLabel: 'Vitamin & Suplemen', name: 'Vitamin C 1000mg',    unit: 'Botol · 30 tablet', price: 45000, stock: 86  },
  { id: 3, cat: 'bebas',   catLabel: 'Obat Bebas',        name: 'Tolak Angin Cair',     unit: 'Box · 12 sachet',   price: 22000, stock: 150 },
  { id: 4, cat: 'alat',    catLabel: 'Alat Kesehatan',    name: 'Masker Medis 3-Ply',   unit: 'Box · 50 pcs',      price: 35000, stock: 60  },
  { id: 5, cat: 'bebas',   catLabel: 'Obat Bebas',        name: 'Antasida Tablet Kunyah', unit: 'Strip · 10 tablet', price: 9500, stock: 40 },
  { id: 6, cat: 'vitamin', catLabel: 'Vitamin & Suplemen', name: 'Minyak Ikan Omega-3',  unit: 'Botol · 60 kapsul', price: 68000, stock: 120 },
  { id: 7, cat: 'resep',   catLabel: 'Obat Resep',        name: 'Amoxicillin 500mg',    unit: 'Strip · 10 kapsul', price: 18000, stock: 24  },
  { id: 8, cat: 'ibu',     catLabel: 'Ibu & Anak',        name: 'Minyak Telon Bayi',    unit: 'Botol · 60ml',      price: 21000, stock: 75  },
];

const state = { category: 'semua', query: '', cartCount: 3 };

const grid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');
const toast = document.getElementById('toast');
const cartCountEl = document.getElementById('cartCount');

function formatRupiah(n) {
  return 'Rp' + n.toLocaleString('id-ID');
}

function render() {
  const query = state.query.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const matchesCat = state.category === 'semua' || p.cat === state.category;
    const matchesQuery = !query || p.name.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  grid.innerHTML = filtered.map((p, i) => `
    <article class="card-product">
      <div class="card-product__media ${TINTS[i % TINTS.length]}">
        <span class="card-product__stock">Stok: ${p.stock}</span>
        <svg viewBox="0 0 24 24" fill="none">${ICONS[p.cat] || ICONS.bebas}</svg>
      </div>
      <div class="card-product__body">
        <span class="card-product__cat">${p.catLabel}</span>
        <h3 class="card-product__name">${p.name}</h3>
        <span class="card-product__unit">${p.unit}</span>
        <div class="card-product__footer">
          <span class="card-product__price">${formatRupiah(p.price)}</span>
          <button class="addbtn" data-id="${p.id}" data-name="${p.name}">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
            Keranjang
          </button>
        </div>
      </div>
    </article>
  `).join('');

  emptyState.hidden = filtered.length !== 0;
  resultCount.textContent = `${filtered.length} produk tersedia`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

document.getElementById('categoryRow').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
  chip.classList.add('is-active');
  state.category = chip.dataset.cat;
  render();
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  state.query = e.target.value;
  render();
});

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.addbtn');
  if (!btn) return;
  state.cartCount += 1;
  cartCountEl.textContent = state.cartCount;
  showToast(`${btn.dataset.name} ditambahkan ke keranjang`);
  // Django note: this is where a fetch('/keranjang/tambah/', {method:'POST', body:...})
  // call would go, posting product id + qty to a CartItemCreateView.
});

document.getElementById('cartBtn').addEventListener('click', () => {
  showToast('Membuka keranjang…');
});

render();
