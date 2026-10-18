const g=id=>document.getElementById(id);
const ob=BM.obat(),od=BM.orders(),today=new Date().toISOString().slice(0,10),
low=ob.filter(o=>o.stok<=10).length,exp=ob.filter(o=>new Date(o.exp)<=Date.now()+90*864e5).length,
td=od.filter(o=>o.tgl===today),wait=od.filter(o=>o.status==='Menunggu Verifikasi').length,inc=td.reduce((s,o)=>s+o.total,0);
const STATS=[{l:'Total jenis obat',v:ob.length,n:'Terdaftar di etalase'},{l:'Stok menipis',v:low,n:exp+' hampir kadaluarsa',w:1},{l:'Pesanan hari ini',v:td.length,n:wait+' menunggu verifikasi'},{l:'Pendapatan hari ini',v:BM.rp(inc),n:'Dari '+td.length+' pesanan'}];
g('statGrid').innerHTML=STATS.map((s,i)=>`<div class="stat${s.w?' stat--warn':''}" style="--w:${[78,32,60,85][i]}%"><div class="stat__label">${s.l}</div><div class="stat__value">${s.v}</div><div class="stat__note">${s.n}</div></div>`).join('');
g('orderTableBody').innerHTML=od.slice(0,5).map(o=>`<tr><td>${o.no}</td><td>${BM.esc(o.pembeli)}</td><td>${BM.rp(o.total)}</td><td>${BM.pill(o.status)}</td></tr>`).join('');
g('todayDate').textContent=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'short',year:'numeric'});
const al=BM.alerts();
g('bc').textContent=al.length;g('bc').hidden=!al.length;
g('nl').innerHTML=al.length?al.map(x=>`<p>${BM.esc(x)}</p>`).join(''):'<p>Tidak ada peringatan.</p>';
g('alertBox').innerHTML=al.length?`<div class="alertbox"><strong>${al.length} peringatan stok &amp; kadaluarsa:</strong> ${al.map(BM.esc).join(' · ')}</div>`:'';
g('bell').onclick=()=>g('nl').classList.toggle('is-open');
