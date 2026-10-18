const BM={
get(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},
set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
rp:n=>'Rp '+Number(n).toLocaleString('id-ID'),
esc:s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
toast(m){let t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('is-show');setTimeout(()=>t.classList.remove('is-show'),2200)},
pill:s=>`<span class="pill ${{'Menunggu Verifikasi':'pill--wait','Ditolak':'pill--bad','Hangus':'pill--bad','Diproses':'pill--ok','Dikirim':'pill--ok','Selesai':'pill--ok'}[s]||''}">${s}</span>`,
alerts(){const lim=Date.now()+90*864e5;let a=[];this.obat().forEach(o=>{if(o.stok<=10)a.push(`Stok menipis: ${o.nama} (${o.stok})`);if(new Date(o.exp)<=lim)a.push(`Kadaluarsa dekat: ${o.nama} (${o.exp})`)});return a},
obat(){return this.get('bm_obat',null)||(this.set('bm_obat',SEED.obat),SEED.obat)},
supplier(){return this.get('bm_supplier',null)||(this.set('bm_supplier',SEED.supplier),SEED.supplier)},
orders(){return this.get('bm_orders',null)||(this.set('bm_orders',SEED.orders),SEED.orders)},
cart(){return this.get('bm_cart',[])},
cartCount(){return this.cart().reduce((s,i)=>s+i.qty,0)},
kode(m){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',o=this.orders();let k;do{k=m+'-'+[...Array(6)].map(()=>a[Math.random()*a.length|0]).join('')}while(o.some(x=>x.kode===k));return k},
antri(){const t=new Date().toISOString().slice(0,10);return 'A'+String(this.orders().filter(x=>x.metode==='COD'&&x.tgl===t).length+1).padStart(3,'0')},
sweep(){const o=this.orders(),ob=this.obat();let ch=0;o.forEach(x=>{if(x.metode==='COD'&&x.exp&&Date.now()>x.exp&&!/Lunas/.test(x.bayar)&&!['Selesai','Ditolak','Hangus'].includes(x.status)){x.status='Hangus';x.bayar='COD - Hangus';x.items.forEach(it=>{const z=ob.find(q=>q.id===it.id);if(z)z.stok+=it.qty});ch=1}});if(ch){this.set('bm_orders',o);this.set('bm_obat',ob)}},
qrSvg(seed){let h=0;for(const c of String(seed))h=(h*31+c.charCodeAt(0))>>>0;const r=()=>(h=(h*1664525+1013904223)>>>0)/4294967296,N=25;let s=`<svg viewBox="0 0 ${N} ${N}" width="200" height="200" shape-rendering="crispEdges"><rect width="${N}" height="${N}" fill="#fff"/>`;const f=(x,y)=>{for(let i=0;i<7;i++)for(let j=0;j<7;j++)if(i==0||i==6||j==0||j==6||(i>1&&i<5&&j>1&&j<5))s+=`<rect x="${x+i}" y="${y+j}" width="1" height="1"/>`};for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!((x<8&&y<8)||(x>N-9&&y<8)||(x<8&&y>N-9))&&r()>.5)s+=`<rect x="${x}" y="${y}" width="1" height="1"/>`}f(0,0);f(N-7,0);f(0,N-7);return s+'</svg>'},
user(){return this.get('bm_user',{name:'Atsilah Halimatus'})}
};
const K=['Obat bebas','Obat resep','Vitamin & suplemen','Alat kesehatan','Ibu & anak','Perawatan tubuh'];
const P=[[1,'Paracetamol 500 mg',0,12000,84,'2027-08-01',1],[2,'Amoxicillin 500 mg',1,38000,40,'2027-01-15',2],[3,'Vitamin C 1000 mg',2,55000,63,'2026-12-20',2],[4,'Termometer Digital',3,48000,22,'2030-01-01',3],[5,'Antasida Doen',0,9500,120,'2027-06-01',1],[6,'Omeprazole 20 mg',1,42000,30,'2027-03-10',1],[7,'Multivitamin Anak',4,67000,35,'2027-04-01',2],[8,'Alat Tensi Digital',3,285000,9,'2030-01-01',3],[9,'Minyak Kayu Putih',5,18000,90,'2028-01-01',1],[10,'Zinc 20 mg',2,31000,51,'2027-09-01',2],[11,'Susu Formula Tahap 2',4,142000,17,'2027-02-01',2],[12,'Hand Sanitizer 100 ml',5,15000,75,'2028-05-01',3]];
const SEED={
obat:P.map(p=>({id:p[0],nama:p[1],kategori:K[p[2]],harga:p[3],stok:p[4],exp:p[5],supplier:['PT Kimia Farma','PT Kalbe Farma','PT Mitra Alkes'][p[6]-1],resep:p[2]===1})),
supplier:[{id:1,nama:'PT Kimia Farma',kontak:'021-5551234',alamat:'Batam Centre'},{id:2,nama:'PT Kalbe Farma',kontak:'021-5559876',alamat:'Tanjungpinang'},{id:3,nama:'PT Mitra Alkes',kontak:'0770-445566',alamat:'Bintan'}],
orders:[
{no:'BM-0002',pembeli:'Rina Marlina',tgl:'2026-10-17',items:[{id:2,nama:'Amoxicillin 500 mg',qty:1,harga:38000}],total:48000,status:'Menunggu Verifikasi',metode:'COD',kode:'COD-7K3F9Q',antri:'A001',dibuat:Date.now()-36e5,exp:Date.now()+23*36e5,bayar:'COD - Belum dibayar',resep:{name:'resep-dr-andi.jpg',data:''}},
{no:'BM-0001',pembeli:'Atsilah Halimatus',tgl:'2026-10-10',items:[{id:1,nama:'Paracetamol 500 mg',qty:2,harga:12000}],total:34000,status:'Selesai',metode:'QR',kode:'QR-2M8XPA',dibuat:Date.now()-8*864e5,bayar:'QR - Lunas',resep:null}]};
if(BM.get('bm_ver',0)!==3){['bm_obat','bm_supplier','bm_orders','bm_cart'].forEach(k=>localStorage.removeItem(k));BM.set('bm_ver',3)}
document.addEventListener('click',e=>{if(e.target.closest('#logout'))localStorage.removeItem('bm_user')});
BM.sweep();
