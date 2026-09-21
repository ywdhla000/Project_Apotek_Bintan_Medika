/* ============================================================
   Dashboard Admin — front-end logic.
   STATS and ORDERS below stand in for context passed from a
   Django view, e.g.:
     return render(request, "dashboard.html", {
         "stats": stats_qs, "orders": Pesanan.objects.order_by("-id")[:4]
     })
   ============================================================ */

const STATS = [
  { icon: 'pill',    tint: 'tint-mint',  value: 312, label: 'Total Jenis Obat' },
  { icon: 'alert',   tint: 'tint-sand',  value: 14,  label: 'Stok Menipis' },
  { icon: 'order',   tint: 'tint-peach', value: 23,  label: 'Pesanan Baru' },
  { icon: 'truck',   tint: 'tint-lilac', value: 9,   label: 'Supplier Aktif' },
];

const STAT_ICONS = {
  pill:  '<path d="M8.5 3.5 15 10a4.5 4.5 0 1 1-6.36 6.36L2.5 9.7a3 3 0 0 1 4.24-4.24" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  alert: '<path d="M12 3v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17.5" r="1.1" fill="currentColor"/><path d="M4.9 19h14.2a1 1 0 0 0 .87-1.5L12.87 5a1 1 0 0 0-1.74 0L4.03 17.5A1 1 0 0 0 4.9 19Z" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  order: '<rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  truck: '<path d="M3 6h11v10H3z" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M14 10h4l3 3v3h-7z" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="7.5" cy="17.5" r="1.6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="17" cy="17.5" r="1.6" stroke="currentColor" stroke-width="1.4" fill="none"/>',
};

const STAT_ICON_COLOR = { 'tint-mint': '#2f7a52', 'tint-sand': '#b3654f', 'tint-peach': '#b5822b', 'tint-lilac': '#5f57a8' };

const ORDERS = [
  { no: '#BM-1042', buyer: 'Rani A.',  total: 64500,  status: 'new' },
  { no: '#BM-1041', buyer: 'Yusuf H.', total: 128000, status: 'progress' },
  { no: '#BM-1040', buyer: 'Siti N.',  total: 35000,  status: 'done' },
  { no: '#BM-1039', buyer: 'Agus P.',  total: 92500,  status: 'done' },
];

const STATUS_LABEL = { new: 'Baru', progress: 'Diproses', done: 'Selesai' };
const STATUS_CLASS = { new: 'badge--new', progress: 'badge--progress', done: 'badge--done' };

function formatRupiah(n) {
  return 'Rp' + n.toLocaleString('id-ID');
}

function renderStats() {
  const grid = document.getElementById('statGrid');
  grid.innerHTML = STATS.map(s => `
    <article class="statcard">
      <div class="statcard__icon ${s.tint}" style="color:${STAT_ICON_COLOR[s.tint]}">
        <svg viewBox="0 0 24 24" fill="none">${STAT_ICONS[s.icon]}</svg>
      </div>
      <div class="statcard__value">${s.value}</div>
      <div class="statcard__label">${s.label}</div>
    </article>
  `).join('');
}

function renderOrders() {
  const body = document.getElementById('orderTableBody');
  body.innerHTML = ORDERS.map(o => `
    <tr>
      <td>${o.no}</td>
      <td>${o.buyer}</td>
      <td>${formatRupiah(o.total)}</td>
      <td><span class="badge ${STATUS_CLASS[o.status]}">${STATUS_LABEL[o.status]}</span></td>
    </tr>
  `).join('');
}

function renderDate() {
  const el = document.getElementById('todayDate');
  const formatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  el.textContent = formatted;
}

// Sidebar nav — highlights the clicked section. Only "Ringkasan" has a
// real view built here; the others are placeholders for future pages.
document.getElementById('sidebarNav').addEventListener('click', (e) => {
  const link = e.target.closest('.sidebar__link');
  if (!link || link.dataset.view === 'ringkasan') return;
  e.preventDefault();
  document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('is-active'));
  link.classList.add('is-active');
});

renderStats();
renderOrders();
renderDate();
