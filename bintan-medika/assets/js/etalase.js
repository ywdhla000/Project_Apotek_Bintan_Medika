// Django note: ganti array PRODUCTS dengan JSON.parse(document.getElementById('produk-data').textContent)
const KEY={'Obat bebas':'bebas','Obat resep':'resep','Vitamin & suplemen':'vitamin','Alat kesehatan':'alat','Ibu & anak':'ibu','Perawatan tubuh':'tubuh'};
const PRODUCTS=BM.obat().map(o=>({id:o.id,name:o.nama,price:o.harga,stock:o.stok,cat:KEY[o.kategori]||'bebas',rx:o.resep?1:0}));
const CATS={bebas:['Obat bebas','#e4edff','#0f4bb5'],resep:['Obat resep','#fde9eb','#d9343f'],vitamin:['Vitamin & suplemen','#fdeef0','#e0525b'],alat:['Alat kesehatan','#dfe9fb','#0b2a6b'],ibu:['Ibu & anak','#eaf3ff','#4f86e8'],tubuh:['Perawatan tubuh','#edf1f8','#3a62b8']};
const ICON='<svg viewBox="0 0 24 24" fill="none"><path d="M8.5 3.5 15 10a4.5 4.5 0 1 1-6.36 6.36L2.5 9.7a3 3 0 0 1 4.24-4.24" stroke="currentColor" stroke-width="1.4"/><path d="M8.6 8.6l6.8 6.8" stroke="currentColor" stroke-width="1.4"/></svg>';
const rp=n=>'Rp '+n.toLocaleString('id-ID');
const $=id=>document.getElementById(id);
let cat='semua',q='',maxP=Infinity;$('cartCount').textContent=BM.cartCount();
function render(){
  const list=PRODUCTS.filter(p=>(cat==='semua'||p.cat===cat)&&p.price<=maxP&&p.name.toLowerCase().includes(q));
  $('productGrid').innerHTML=list.map(p=>`<article class="card"><div class="card__thumb" style="background:${CATS[p.cat][1]};color:${CATS[p.cat][2]}">${ICON}${p.rx?'<span class="card__rx">Resep dokter</span>':''}</div><div class="card__body"><span class="card__cat">${CATS[p.cat][0]}</span><h3 class="card__name">${p.name}</h3><span class="card__stock">Stok ${p.stock}</span><div class="card__foot"><span class="card__price">${rp(p.price)}</span><button class="btn btn-primary" data-id="${p.id}">+ Keranjang</button></div><div class="card__bar${p.stock<20?' is-low':''}" title="Stok ${p.stock}"><i style="width:${Math.min(100,p.stock)}%"></i></div></div></article>`).join('');
  $('resultCount').textContent=list.length+' produk tersedia';$('emptyState').hidden=list.length>0;
}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('is-show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('is-show'),2000)}
$('categoryRow').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('is-active',c===b));cat=b.dataset.cat;$('catSelect').value=cat;$('catSelect').dispatchEvent(new Event('sync'));render()});
$('searchInput').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase();render()});
$('productGrid').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b)return;
  // Django note: fetch('/keranjang/tambah/', {method:'POST', ...}) di sini
  const id=+b.dataset.id,p=PRODUCTS.find(x=>x.id===id),c=BM.cart(),it=c.find(x=>x.id===id);
  if((it?it.qty:0)>=p.stock){toast('Stok '+p.name+' tidak cukup');return}
  it?it.qty++:c.push({id,qty:1});BM.set('bm_cart',c);$('cartCount').textContent=BM.cartCount();toast(p.name+' masuk keranjang')});
render();

$('catSelect').addEventListener('change',e=>{cat=e.target.value;document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('is-active',c.dataset.cat===cat));render()});
$('priceSelect').addEventListener('change',e=>{maxP=+e.target.value||Infinity;render()});

$('cartBtn').onclick=()=>location.href='keranjang.html';
$('uName').textContent=BM.user().name;
document.querySelectorAll('[data-resep]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();cat='resep';$('catSelect').value='resep';$('catSelect').dispatchEvent(new Event('sync'));document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('is-active',c.dataset.cat==='resep'));render();$('productGrid').scrollIntoView({behavior:'smooth'});toast('Pilih obat resep, resep diunggah saat checkout')}));
