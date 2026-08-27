/* Wardrobe editing: add, edit, replace photo, delete, persist active tab. */
(function(){
  if(window.__wardrobeEditorReady)return;
  window.__wardrobeEditorReady=true;
  const KEY='myStyleWardrobeV2';
  const TAB_KEY='myStyleActiveTab';
  const FILTER_KEY='myStyleWardrobeFilter';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const close=()=>document.getElementById('weModal')?.classList.remove('show');
  const write=w=>{localStorage.setItem(KEY,JSON.stringify(w));if(typeof window.renderW==='function')window.renderW();setTimeout(decorate,40)};
  function shell(html){
    let m=document.getElementById('weModal');
    if(!m){m=document.createElement('div');m.id='weModal';document.body.appendChild(m)}
    m.innerHTML='<div class="weBox"><button class="weClose" type="button">×</button>'+html+'</div>';
    m.classList.add('show');
    m.querySelector('.weClose').onclick=close;
    m.onclick=e=>{if(e.target===m)close()};
    return m;
  }
  function compress(file,done){
    if(!file){done(null);return}
    const r=new FileReader();
    r.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const max=1500,scale=Math.min(1,max/Math.max(img.width,img.height));
        const c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        done(c.toDataURL('image/jpeg',.86));
      };
      img.onerror=()=>done(r.result);
      img.src=r.result;
    };
    r.readAsDataURL(file);
  }
  function add(){
    const m=shell('<div class="weKicker">НОВАЯ ВЕЩЬ</div><h2>Добавить в гардероб</h2><label class="weDrop"><input id="newFile" type="file" accept="image/*"><b>Выбрать фотографию</b><span>Фото с телефона или компьютера</span></label><img id="newPreview" class="wePreview" hidden><div class="weForm"><label>Название<input id="newName" placeholder="Например, шоколадный кардиган"></label><label>Категория<select id="newCat"><option>Верх</option><option>Низ</option><option>Второй слой</option><option>Верхняя одежда</option><option>Обувь</option><option>Сумки</option><option>Аксессуары</option></select></label><label>Цвет<input id="newColor"></label><label>Фасон / посадка<input id="newFit"></label><label>Оценка<input id="newScore" type="number" min="0" max="10" step="0.1"></label><label class="wide">Комментарий<textarea id="newNote"></textarea></label></div><div class="weActions"><button class="weSecondary" id="cancel" type="button">Отмена</button><button class="wePrimary" id="saveNew" type="button">Добавить вещь</button></div>');
    m.querySelector('#cancel').onclick=close;
    m.querySelector('#newFile').onchange=e=>compress(e.target.files[0],src=>{if(src){m.querySelector('#newPreview').src=src;m.querySelector('#newPreview').hidden=false}});
    m.querySelector('#saveNew').onclick=()=>{
      const f=m.querySelector('#newFile').files[0],name=m.querySelector('#newName').value.trim();
      if(!name)return alert('Укажи название вещи');
      if(!f)return alert('Загрузи фотографию вещи');
      compress(f,img=>{const w=read();w.push({id:Date.now().toString(36),name,cat:m.querySelector('#newCat').value,color:m.querySelector('#newColor').value||'—',fit:m.querySelector('#newFit').value||'—',score:m.querySelector('#newScore').value||'—',note:m.querySelector('#newNote').value||'',img});try{write(w);close()}catch(e){alert('Не удалось сохранить фото. Попробуй другое или меньшее изображение.')}})
    };
  }
  function edit(i){
    const w=read(),x=w[i];if(!x)return;
    const m=shell('<div class="weKicker">МОЯ ВЕЩЬ</div><h2>Редактировать карточку</h2><div class="wePhoto"><img id="editPreview" src="'+esc(x.img||'')+'"><label class="weUpload">📷 Заменить фото<input id="editFile" type="file" accept="image/*"></label></div><div class="weForm"><label>Название<input id="editName"></label><label>Категория<select id="editCat"><option>Верх</option><option>Низ</option><option>Второй слой</option><option>Верхняя одежда</option><option>Обувь</option><option>Сумки</option><option>Аксессуары</option></select></label><label>Цвет<input id="editColor"></label><label>Фасон / посадка<input id="editFit"></label><label>Оценка<input id="editScore" type="number" min="0" max="10" step="0.1"></label><label class="wide">Комментарий<textarea id="editNote"></textarea></label></div><div class="weActions"><button class="weSecondary" id="cancel" type="button">Отмена</button><button class="wePrimary" id="saveEdit" type="button">Сохранить изменения</button></div>');
    m.querySelector('#editName').value=x.name||'';m.querySelector('#editCat').value=x.cat||'Верх';m.querySelector('#editColor').value=x.color||'';m.querySelector('#editFit').value=x.fit||'';m.querySelector('#editScore').value=x.score==='—'?'':(x.score||'');m.querySelector('#editNote').value=x.note||'';
    let newImage=null;
    m.querySelector('#cancel').onclick=close;
    m.querySelector('#editFile').onchange=e=>compress(e.target.files[0],src=>{if(src){newImage=src;m.querySelector('#editPreview').src=src}});
    m.querySelector('#saveEdit').onclick=()=>{
      x.name=m.querySelector('#editName').value.trim()||x.name;x.cat=m.querySelector('#editCat').value;x.color=m.querySelector('#editColor').value||'—';x.fit=m.querySelector('#editFit').value||'—';x.score=m.querySelector('#editScore').value||'—';x.note=m.querySelector('#editNote').value||'';if(newImage)x.img=newImage;
      w[i]=x;try{write(w);close()}catch(e){alert('Не удалось сохранить изменения. Попробуй другое или меньшее фото.')}
    };
  }
  function remove(i){const w=read(),x=w[i];if(!x)return;if(!confirm('Удалить «'+x.name+'» из гардероба?'))return;w.splice(i,1);write(w)}
  function decorate(){
    const w=read();
    document.querySelectorAll('#wardrobeGrid .card').forEach(card=>{
      const title=card.querySelector('.body h3');if(!title)return;
      const x=w.find(item=>item.name===title.textContent.trim());if(!x)return;
      const i=w.indexOf(x);let box=card.querySelector('.weCardActions');
      if(!box){box=document.createElement('div');box.className='weCardActions';card.querySelector('.body').appendChild(box)}
      box.innerHTML='';
      const eb=document.createElement('button');eb.type='button';eb.className='pill weEdit';eb.textContent='✎ Редактировать';eb.onclick=()=>edit(i);
      const db=document.createElement('button');db.type='button';db.className='pill weDelete';db.textContent='Удалить';db.onclick=()=>remove(i);
      box.append(eb,db);
    });
  }
  function enhance(){
    if(!document.getElementById('weStyle')){
      const st=document.createElement('style');st.id='weStyle';st.textContent='#weModal{display:none;position:fixed;inset:0;z-index:9999;background:rgba(25,23,20,.58);align-items:center;justify-content:center;padding:16px}#weModal.show{display:flex}.weBox{width:min(620px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:24px;padding:22px;color:#252421;border:1px solid #e5ddd4}.weClose{float:right;width:38px;height:38px;border:1px solid #ddd5cc;background:#fff;border-radius:50%;font-size:22px;cursor:pointer}.weKicker{font-size:9px;letter-spacing:.18em;color:#8b8278;font-weight:700}.weBox h2{font-size:28px;letter-spacing:-.04em;margin:8px 0 14px}.wePhoto{position:relative;background:#f1eee9;border-radius:16px;display:grid;place-items:center;overflow:hidden;margin:12px 0 14px}.wePhoto img{max-width:100%;max-height:390px;width:100%;height:auto;object-fit:contain}.weUpload{position:absolute;right:12px;bottom:12px;background:#fff;border:1px solid #ddd5cc;border-radius:999px;padding:10px 13px;font-size:11px;cursor:pointer}.weUpload input{display:none}.weForm{display:grid;grid-template-columns:1fr 1fr;gap:10px}.weForm label{font-size:10px;color:#756d64}.weForm .wide{grid-column:1/-1}.weForm input,.weForm select,.weForm textarea{display:block;width:100%;margin-top:5px;border:1px solid #ded7cf;border-radius:11px;padding:11px;background:#fff;color:#252421}.weForm textarea{min-height:85px}.weActions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.wePrimary,.weSecondary{border-radius:11px;padding:11px 16px;border:1px solid #282724;cursor:pointer}.wePrimary{background:#282724;color:#fff}.weSecondary{background:#fff}.weDrop{border:1px dashed #cfc5bb;border-radius:15px;padding:16px;display:flex;gap:12px;align-items:center;margin:12px 0;cursor:pointer}.weDrop span{font-size:10px;color:#8a8178}.wePreview{width:100%;max-height:250px;object-fit:contain;border-radius:14px;background:#f1eee9;margin-bottom:12px}.weCardActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.weEdit{background:#282724!important;color:#fff!important;border-color:#282724!important}.weDelete{color:#9a4e4e!important;border-color:#dfc7c7!important}@media(max-width:600px){.weForm{grid-template-columns:1fr}.weForm .wide{grid-column:auto}}';document.head.appendChild(st)
    }
    const head=document.querySelector('#wardrobe .head');
    if(head&&!head.querySelector('[data-we-add]')){const b=document.createElement('button');b.className='btn';b.dataset.weAdd='1';b.textContent='+ Добавить вещь';b.onclick=add;head.appendChild(b)}
    decorate();
  }
  const oldRender=window.renderW;
  if(typeof oldRender==='function'&&!oldRender.__wardrobeWrapped){
    const wrapped=function(){oldRender();setTimeout(decorate,30)};wrapped.__wardrobeWrapped=true;window.renderW=wrapped;
  }
  const oldGo=window.go;
  if(typeof oldGo==='function'&&!oldGo.__wardrobeWrapped){
    const wrappedGo=function(id,b){localStorage.setItem(TAB_KEY,id);return oldGo(id,b)};wrappedGo.__wardrobeWrapped=true;window.go=wrappedGo;
  }
  const oldSetTab=window.setTab;
  if(typeof oldSetTab==='function'&&!oldSetTab.__wardrobeWrapped){
    const wrappedTab=function(t,b){localStorage.setItem(TAB_KEY,'wardrobe');localStorage.setItem('myStyleWardrobeSubtab',t);return oldSetTab(t,b)};wrappedTab.__wardrobeWrapped=true;window.setTab=wrappedTab;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
  window.WardrobeEditor={add,edit,remove,decorate};
  setTimeout(()=>{
    enhance();
    const saved=localStorage.getItem(TAB_KEY);
    if(saved){const btn=[...document.querySelectorAll('.nav button')].find(b=>b.getAttribute('onclick')?.includes("go('"+saved+"'"));if(typeof window.go==='function')window.go(saved,btn)}
    if(saved==='wardrobe'){
      const sub=localStorage.getItem('myStyleWardrobeSubtab')||'owned';
      const b=[...document.querySelectorAll('.tabs .pill')].find(x=>x.textContent.toLowerCase().includes(sub==='wish'?'хочу':'у меня'));
      if(typeof window.setTab==='function'&&b)window.setTab(sub,b);
    }
  },80);
})();