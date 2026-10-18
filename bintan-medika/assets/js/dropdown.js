// Dropdown kustom: membungkus <select> asli (tetap dipakai untuk nilai & form) dengan menu bergaya kaca.
document.querySelectorAll('.seg select').forEach(sel=>{
  const dd=document.createElement('div');dd.className='dd';
  dd.innerHTML='<button type="button" class="dd__btn" aria-haspopup="listbox" aria-expanded="false"><span class="dd__val"></span></button><ul class="dd__menu" role="listbox" tabindex="-1"></ul>';
  sel.after(dd);
  const btn=dd.querySelector('.dd__btn'),val=dd.querySelector('.dd__val'),menu=dd.querySelector('.dd__menu');
  menu.innerHTML=[...sel.options].map(o=>`<li role="option" data-v="${o.value}">${o.text}</li>`).join('');
  const items=[...menu.children];
  const sync=()=>{const o=sel.options[sel.selectedIndex];val.textContent=o.text;items.forEach(li=>{const on=li.dataset.v===sel.value;li.classList.toggle('is-selected',on);li.setAttribute('aria-selected',on)})};
  const open=on=>{dd.classList.toggle('is-open',on);btn.setAttribute('aria-expanded',on)};
  const pick=li=>{sel.value=li.dataset.v;sync();open(false);sel.dispatchEvent(new Event('change'));btn.focus()};
  btn.addEventListener('click',()=>{const on=!dd.classList.contains('is-open');document.querySelectorAll('.dd.is-open').forEach(d=>d.classList.remove('is-open'));open(on)});
  menu.addEventListener('click',e=>{const li=e.target.closest('li');if(li)pick(li)});
  dd.addEventListener('keydown',e=>{
    if(e.key==='Escape'){open(false);btn.focus()}
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const i=sel.selectedIndex+(e.key==='ArrowDown'?1:-1);if(i>=0&&i<items.length){sel.selectedIndex=i;sync();sel.dispatchEvent(new Event('change'))}}
  });
  sel.addEventListener('sync',sync);sync();
});
document.addEventListener('click',e=>{if(!e.target.closest('.dd'))document.querySelectorAll('.dd.is-open').forEach(d=>d.classList.remove('is-open'))});
