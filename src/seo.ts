const base='https://pavelfilichev8-cmd.github.io/laughing-rotary-phone';

const pages:Record<string,{title:string;description:string;heading:string;text:string;sections:[string,string][]}>={
  '/':{
    title:'Приём металлолома в Санкт-Петербурге и ЛО — Metal Hub',
    description:'Приём и вывоз цветного и чёрного металла в Санкт-Петербурге и Ленинградской области. Медь, алюминий, латунь, бронза, нержавейка, кабель, демонтаж и погрузка.',
    heading:'Приём металлолома в Санкт-Петербурге и Ленинградской области',
    text:'Metal Hub — информационный сайт об организации приёма, вывоза и демонтажа металлолома. На сайте собраны основные категории металла, порядок подготовки заявки, вопросы по вывозу и направления работ для частных клиентов и организаций.',
    sections:[
      ['Какие виды металла принимают','Медь, алюминий, латунь, бронза, нержавеющая сталь, свинец, медный кабель, чёрный металл и другие категории можно разделять по составу, форме и состоянию. Точная оценка зависит от фактического материала, его чистоты, засора и объёма.'],
      ['Как подготовить металл к сдаче','Перед обращением полезно указать вид металла, примерный вес или объём, адрес объекта и наличие погрузки. Для сложных партий можно заранее отправить фотографии и описание. Это помогает быстрее определить формат выезда и дополнительные работы.'],
      ['Вывоз металлолома с объекта','Для вывоза заранее согласуются адрес, подъезд, объём, необходимость погрузки и подходящий транспорт. Для предприятий и строительных объектов дополнительно можно подготовить график вывоза, документы и условия работы.'],
      ['Демонтаж и металлолом','Металлоконструкции, трубы, лист, оборудование и производственные остатки иногда требуют предварительного демонтажа. Такой объект оценивается отдельно: учитываются доступ, объём работ, безопасность и возможность погрузки.'],
      ['Приём металлолома в СПб и ЛО','Основная география сайта — Санкт-Петербург и Ленинградская область. В дальнейшем страницы можно расширять по городам и направлениям, добавляя только реальные условия обслуживания конкретной территории.']
    ]
  },
  '/priem-metalla':{
    title:'Приём металлолома в Санкт-Петербурге — цветной и чёрный металл',
    description:'Информация о приёме цветного и чёрного металлолома: медь, алюминий, латунь, бронза, нержавейка, кабель и сталь.',
    heading:'Приём металлолома: виды, подготовка и оценка',
    text:'Страница помогает определить категорию материала и подготовить данные для индивидуального расчёта. Итоговые условия зависят от фактического состояния и объёма партии.',
    sections:[['Цветной металл','К цветному лому относятся медь, алюминий, латунь, бронза, свинец и другие материалы. Разные виды и сплавы не следует смешивать без уточнения состава.'],['Чёрный металл','Сталь, железо, лист, профиль, трубы и металлоконструкции оцениваются с учётом вида материала, объёма, габаритов и условий погрузки.'],['Что указать в заявке','Укажите металл, ориентировочный вес, адрес, фотографии и особенности подъезда. Для организаций полезно добавить режим работы объекта и требования к документам.']]
  },
  '/vyvoz-metalla':{
    title:'Вывоз металлолома в Санкт-Петербурге и ЛО — погрузка и транспорт',
    description:'Организация вывоза металлолома с частных, коммерческих и производственных объектов в Санкт-Петербурге и Ленинградской области.',
    heading:'Вывоз металлолома с объекта',
    text:'Вывоз начинается с уточнения объёма, адреса, подъезда и необходимости погрузки. После получения исходных данных можно определить подходящий формат работ.',
    sections:[['Перед выездом','Подготовьте адрес, фотографии, примерный объём и информацию о том, где находится металл. Это сокращает количество уточняющих вопросов.'],['Погрузка','Если металл находится в подвале, на территории предприятия, в контейнере или в другом сложном месте, условия погрузки согласуются заранее.'],['Вывоз для бизнеса','Для производственных и строительных объектов удобно заранее согласовать график, ответственного сотрудника и порядок оформления документов.']]
  },
  '/demontazh':{
    title:'Демонтаж металлоконструкций в Санкт-Петербурге и ЛО — металл и оборудование',
    description:'Информация о демонтаже металлоконструкций, оборудования, труб, листа и производственных металлических элементов с последующим вывозом.',
    heading:'Демонтаж металлоконструкций и оборудования',
    text:'Демонтаж — отдельная услуга, которую необходимо оценивать по объекту. На стоимость и сроки влияют габариты, доступ, крепления, этажность, техника и объём последующей погрузки.',
    sections:[['Что можно подготовить к оценке','Фотографии объекта, адрес, размеры конструкции, примерный объём металла и описание существующих креплений.'],['Безопасность работ','Перед началом демонтажа необходимо определить безопасную технологию, ограничения объекта и требования ответственных лиц.'],['После демонтажа','Демонтированный металл сортируется по возможности по категориям, после чего согласуются погрузка, транспорт и дальнейшее обращение с материалом.']]
  }
};

function current(){const p=window.location.pathname.replace(base,'').replace(/\/$/,'')||'/';return pages[p]||pages['/'];}
function render(){
  const page=current();
  document.title=page.title;
  const d=document.querySelector('meta[name="description"]');if(d)d.setAttribute('content',page.description);
  const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.setAttribute('href',base+(window.location.pathname.replace(base,'')||'/'));
  let box=document.getElementById('seo-content');
  if(!box){box=document.createElement('section');box.id='seo-content';document.body.appendChild(box);}
  box.innerHTML=`<div class="seo-content-inner"><div class="seo-eyebrow">ИНФОРМАЦИЯ · METAL HUB</div><h2>${page.heading}</h2><p class="seo-lead">${page.text}</p><div class="seo-grid">${page.sections.map(([h,t])=>`<article><h3>${h}</h3><p>${t}</p></article>`).join('')}</div><div class="seo-cta"><strong>Нужен расчёт по конкретной партии?</strong><span>Укажите вид металла, объём, адрес и приложите фотографии — это поможет подготовить заявку.</span></div></div>`;
}

const style=document.createElement('style');
style.textContent=`#seo-content{background:#f3f5f4;color:#11181a;padding:80px 20px;border-top:1px solid #dfe5e2}#seo-content .seo-content-inner{max-width:1180px;margin:auto}.seo-eyebrow{font:700 12px/1.2 Manrope,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#537067;margin-bottom:18px}.seo-content-inner h2{font:700 clamp(30px,4vw,52px)/1.05 'Space Grotesk',sans-serif;max-width:850px;margin:0 0 20px}.seo-lead{font:400 18px/1.7 Manrope,sans-serif;max-width:900px;color:#52605d;margin:0 0 42px}.seo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.seo-grid article{background:#fff;border:1px solid #dfe5e2;border-radius:18px;padding:26px}.seo-grid h3{font:700 21px/1.2 'Space Grotesk',sans-serif;margin:0 0 10px}.seo-grid p{font:400 15px/1.7 Manrope,sans-serif;color:#596562;margin:0}.seo-cta{margin-top:22px;padding:24px;border-radius:18px;background:#11181a;color:#fff;display:flex;gap:18px;align-items:center;flex-wrap:wrap;font-family:Manrope,sans-serif}.seo-cta strong{font-size:17px}.seo-cta span{color:#c9d1cf}@media(max-width:700px){#seo-content{padding:55px 16px}.seo-grid{grid-template-columns:1fr}.seo-content-inner h2{font-size:34px}.seo-lead{font-size:16px}}`;
document.head.appendChild(style);

render();
window.addEventListener('popstate',render);
window.setTimeout(render,300);

const structured=document.createElement('script');structured.type='application/ld+json';structured.textContent=JSON.stringify({
  '@context':'https://schema.org','@type':'WebSite','name':'Metal Hub SPb','url':base+'/','inLanguage':'ru-RU',
  'about':['приём металлолома','вывоз металлолома','цветной металл','чёрный металл','демонтаж металлоконструкций']
});document.head.appendChild(structured);
