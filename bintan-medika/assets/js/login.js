/* ============================================================
   Login / Daftar — front-end logic.
   In Django this form would post to a real endpoint, e.g.:
     <form method="post" action="{% url 'login' %}">{% csrf_token %}
   The role + tab switching below is pure UI state and stays
   identical whether the backend is Django, an API, or nothing yet.
   ============================================================ */

const state = { role: 'pembeli', tab: 'masuk' };

const roleButtons = document.querySelectorAll('.roletoggle__btn');
const tabButtons = document.querySelectorAll('.authtabs__btn');
const formMasuk = document.getElementById('formMasuk');
const formDaftar = document.getElementById('formDaftar');
const submitMasuk = document.getElementById('submitMasuk');
const submitDaftar = document.getElementById('submitDaftar');
const toast = document.getElementById('toast');

const roleLabel = { pembeli: 'Pembeli', admin: 'Admin' };

function updateSubmitLabels() {
  submitMasuk.textContent = `Masuk sebagai ${roleLabel[state.role]}`;
  submitDaftar.textContent = `Daftar sebagai ${roleLabel[state.role]}`;
}

function showTab(tab) {
  state.tab = tab;
  tabButtons.forEach(b => {
    const active = b.dataset.tab === tab;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-selected', String(active));
  });
  formMasuk.hidden = tab !== 'masuk';
  formDaftar.hidden = tab !== 'daftar';
}

roleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    roleButtons.forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    state.role = btn.dataset.role;
    updateSubmitLabels();
    // Daftar akun baru only makes sense for pembeli in this flow;
    // admin accounts are provisioned separately.
    document.querySelector('[data-tab="daftar"]').style.display =
      state.role === 'admin' ? 'none' : '';
    if (state.role === 'admin' && state.tab === 'daftar') showTab('masuk');
  });
});

tabButtons.forEach(btn => btn.addEventListener('click', () => showTab(btn.dataset.tab)));

document.querySelectorAll('[data-goto]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showTab(link.dataset.goto);
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2000);
}

formMasuk.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast(`Memeriksa data masuk sebagai ${roleLabel[state.role]}…`);
  // Django note: on success this redirects — pembeli -> etalase (index.html),
  // admin -> dashboard (dashboard.html). Placeholder redirect below:
  setTimeout(() => {
    window.location.href = state.role === 'admin' ? 'dashboard.html' : 'index.html';
  }, 900);
});

formDaftar.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Membuat akun baru…');
  setTimeout(() => showTab('masuk'), 900);
});

updateSubmitLabels();
