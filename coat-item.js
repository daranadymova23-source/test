(function(){
const KEY='myStyleWardrobeV2';
const COAT_ID='coat-gray-drape-mp002xw1d6a6';
const COAT={
 id:COAT_ID,
 name:'Серое полупальто',
 cat:'Верхняя одежда',
 color:'Серый',
 fit:'Прямой свободный силуэт',
 score:'9.2',
 note:'Серое полупальто из драпа — сильная базовая вещь для твоего гардероба. Спокойный серый поддерживает твою мягкую палитру, а прямой силуэт и длина 65 см хорошо работают как второй слой: создают вертикаль и не перегружают фигуру. Лучше носить расстёгнутым или с частично застёгнутыми кнопками с прямыми джинсами, wide-leg и спокойными брюками.',
 img:'data:image/webp;base64,BASE64_IMAGE'
};
const DETAILS={
 description:'Полупальто выполнено из драпа. Отложной воротник, застёжка на кнопки, 2 внешних кармана, гладкая подкладка.',
 composition:'Полиэстер — 100%',
 lining:'Полиэстер — 100%',
 insulation:'Без утеплителя',
 season:'Мульти',
 modelSize:'S INT',
 length:'65 см (S INT)',
 sleeveLength:'80 см (S INT)',
 modelMeasurements:'82–60–90',
 modelHeight:'177 см',
 color:'Серый',
 pattern:'Однотонный',
 pockets:'2',
 closure:'Кнопки',
 hood:'Нет',
 country:'Китай',
 article:'MP002XW1D6A6',
 warranty:'30 дней'
};
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(w){localStorage.setItem(KEY,JSON.stringify(w));if(typeof window.renderW==='function')window.renderW();setTimeout(enhanceDetail,30)}
function ensure(){
 const w=read();
 const i=w.findIndex(x=>x.id===COAT_ID||x.name==='Серое полупальто');
 if(i<0)w.push(COAT);else w[i]=Object.assign({},w[i],COAT);
 save(w);
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function show(i){
 const w=read(),x=w[i];
 if(!x || !(x.id===COAT_ID || x.name==='Серое полупальто'))return false;
 const mc=window.modalContent,modal=window.modal;
 if(!mc||!modal)return false;
 mc.innerHTML='<span class="tag good">УЖЕ ЕСТЬ В ГАРДЕРОБЕ</span>'+
 '<h2>'+esc(x.name)+'</h2>'+ 
 '<img src="'+esc(x.img)+'" style="width:100%;max-height:420px;object-fit:contain;border-radius:14px;background:#f2efea">'+
 '<div class="rule"><b>'+esc(x.score||'9.2')+'/10 — персонально для тебя</b><span>'+esc(x.note)+'</span></div>'+
 '<div class="rule"><b>Описание</b><span>'+esc(DETAILS.description)+'</span></div>'+ 
 '<div class="rule"><b>Характеристики</b><span>'+ 
 '<b>Состав:</b> '+DETAILS.composition+'<br>'+ 
 '<b>Материал подкладки:</b> '+DETAILS.lining+'<br>'+ 
 '<b>Утеплитель:</b> '+DETAILS.insulation+'<br>'+ 
 '<b>Сезон:</b> '+DETAILS.season+'<br>'+ 
 '<b>Размер товара на модели:</b> '+DETAILS.modelSize+'<br>'+ 
 '<b>Длина:</b> '+DETAILS.length+'<br>'+ 
 '<b>Длина рукава:</b> '+DETAILS.sleeveLength+'<br>'+ 
 '<b>Параметры модели:</b> '+DETAILS.modelMeasurements+'<br>'+ 
 '<b>Рост модели на фото:</b> '+DETAILS.modelHeight+'<br>'+ 
 '<b>Цвет:</b> '+DETAILS.color+'<br>'+ 
 '<b>Узор:</b> '+DETAILS.pattern+'<br>'+ 
 '<b>Внешние карманы:</b> '+DETAILS.pockets+'<br>'+ 
 '<b>Застёжка:</b> '+DETAILS.closure+'<br>'+ 
 '<b>Капюшон:</b> '+DETAILS.hood+'<br>'+ 
 '<b>Страна производства:</b> '+DETAILS.country+'<br>'+ 
 '<b>Артикул:</b> '+DETAILS.article+'<br>'+ 
 '<b>Гарантийный срок:</b> '+DETAILS.warranty+ 
 '</span></div>'+ 
 '<div class="rule"><b>С чем носить</b><span>Лучше всего — с прямыми джинсами, wide-leg или брюками с высокой посадкой. Под ним хорошо работают молочный, бежевый, шоколадный и голубой.</span></div>';
 modal.classList.add('show');
 return true;
}
function enhanceDetail(){
 const old=window.detail;
 if(typeof old!=='function'||old.__coatDetails)return;
 function detail(i){return show(i)?undefined:old(i)}
 detail.__coatDetails=true;
 window.detail=detail;
}
function init(){ensure();enhanceDetail();setTimeout(enhanceDetail,100);setTimeout(enhanceDetail,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();