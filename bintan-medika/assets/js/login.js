// Django note: hapus handler submit dummy saat form memakai method="post" + csrf_token
const $=id=>document.getElementById(id);
function show(tab){
  $('formMasuk').hidden=tab!=='masuk';$('formDaftar').hidden=tab!=='daftar';
  document.querySelectorAll('.authtabs__btn').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',on)});
}
document.querySelectorAll('.authtabs__btn').forEach(b=>b.addEventListener('click',()=>show(b.dataset.tab)));
document.querySelectorAll('[data-goto]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(a.dataset.goto)}));
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('is-show');setTimeout(()=>t.classList.remove('is-show'),2200)}
$('formMasuk').addEventListener('submit',e=>{if(!e.target.checkValidity()){e.preventDefault();toast('Isi email/No. HP dan kata sandi dulu')}else{const id=e.target.identifier.value.trim(),a=BM.get('bm_accounts',[]).find(x=>x.id===id),n=id.split('@')[0];BM.set('bm_user',{name:a?a.name:n.charAt(0).toUpperCase()+n.slice(1)})}});
$('formDaftar').addEventListener('submit',e=>{e.preventDefault();
  if(!e.target.checkValidity()){toast('Lengkapi data. Kata sandi minimal 8 karakter');return}
  const f=e.target,acc=BM.get('bm_accounts',[]);acc.push({id:f.identifier.value.trim(),name:f.querySelector('[name=name]').value.trim()});BM.set('bm_accounts',acc);
  toast('Akun dibuat. Silakan masuk');show('masuk')});
