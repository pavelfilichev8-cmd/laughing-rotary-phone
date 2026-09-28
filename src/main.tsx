import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, MapPin, Phone, Recycle, ShieldCheck, Truck, Zap } from 'lucide-react';
import './styles.css';

const metals = ['Медь', 'Алюминий', 'Латунь', 'Бронза', 'Нержавейка', 'Свинец'];
const benefits = [
  { icon: Zap, title: 'Расчёт за 5 минут', text: 'Ориентировочная стоимость по фото или телефону.' },
  { icon: Truck, title: 'Бесплатный вывоз', text: 'Организуем погрузку и транспорт по СПб и ЛО.' },
  { icon: ShieldCheck, title: 'Прозрачные условия', text: 'Фиксируем цену до приезда и без скрытых комиссий.' },
];

function App() {
  return <div className="site">
    <header className="header"><div className="container nav">
      <a className="logo" href="#top"><span className="logo-mark"><Recycle size={20}/></span><span>METAL<span>HUB</span></span></a>
      <nav><a href="#metals">Металлы</a><a href="#how">Как работаем</a><a href="#advantages">Преимущества</a><a href="#faq">FAQ</a></nav>
      <a className="nav-phone" href="tel:+78000000000"><Phone size={17}/> 8 800 000-00-00</a>
    </div></header>

    <main id="top">
      <section className="hero"><div className="container hero-grid">
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
          <div className="eyebrow"><span/> ПРИЁМ И ВЫВОЗ · СПБ И ЛО</div>
          <h1>Металлолом —<br/><em>быстро и выгодно.</em></h1>
          <p className="hero-copy">Оценим металл, организуем демонтаж и бесплатно вывезем от 100 кг. Работаем с частными клиентами и бизнесом.</p>
          <div className="hero-actions"><a className="button primary" href="#quote">Рассчитать стоимость <ArrowRight size={18}/></a><a className="button ghost" href="#metals">Смотреть металлы</a></div>
          <div className="trust"><span><Check size={15}/> Выезд 24/7</span><span><Check size={15}/> Оплата сразу</span><span><Check size={15}/> Без посредников</span></div>
        </motion.div>
        <motion.div className="hero-card" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.7,delay:.15}}>
          <div className="orb orb-a"/><div className="orb orb-b"/>
          <div className="hero-card-top"><span>АКТУАЛЬНО</span><span>28.09.2026</span></div>
          <div className="price">до <strong>850 ₽</strong><small>/ кг</small></div>
          <p>за чистую медь</p>
          <div className="mini-list">{['Медь и медный кабель','Алюминий и профиль','Латунь и бронза'].map(x=><div key={x}><Check size={16}/>{x}</div>)}</div>
          <a href="#quote" className="card-link">Получить цену <ArrowRight size={16}/></a>
        </motion.div>
      </div></section>

      <section className="ticker"><div className="container ticker-inner"><span>ЧЁРНЫЙ МЕТАЛЛ</span><span>ЦВЕТНОЙ МЕТАЛЛ</span><span>КАБЕЛЬ</span><span>ДЕМОНТАЖ</span><span>ВЫВОЗ</span></div></section>

      <section className="section" id="metals"><div className="container"><div className="section-head"><div><div className="eyebrow">КАТЕГОРИИ</div><h2>Принимаем разные виды металла</h2></div><p>Пришлите фото — специалист быстро определит категорию и даст ориентир по стоимости.</p></div><div className="metal-grid">{metals.map((m,i)=><motion.a whileHover={{y:-5}} className="metal-card" href="#quote" key={m}><span>0{i+1}</span><h3>{m}</h3><div>Узнать цену <ArrowRight size={15}/></div></motion.a>)}</div></div></section>

      <section className="section muted" id="advantages"><div className="container"><div className="section-head"><div><div className="eyebrow">ПОЧЕМУ МЫ</div><h2>Сервис без лишних шагов</h2></div></div><div className="benefit-grid">{benefits.map(({icon:Icon,title,text})=><div className="benefit" key={title}><div className="icon"><Icon size={21}/></div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

      <section className="section" id="how"><div className="container process"><div><div className="eyebrow">КАК ЭТО РАБОТАЕТ</div><h2>От фото до выплаты —<br/>в несколько шагов</h2></div><div className="steps">{['Отправляете фото и адрес','Получаете предварительный расчёт','Мы приезжаем и проверяем металл','Вывозим и рассчитываемся'].map((x,i)=><div className="step" key={x}><b>0{i+1}</b><span>{x}</span></div>)}</div></div></section>

      <section className="quote" id="quote"><div className="container quote-box"><div><div className="eyebrow">БЕСПЛАТНЫЙ РАСЧЁТ</div><h2>Сколько стоит ваш металл?</h2><p>Оставьте контакты — менеджер уточнит состав, объём и адрес.</p></div><form onSubmit={e=>e.preventDefault()}><input aria-label="Имя" placeholder="Ваше имя"/><input aria-label="Телефон" placeholder="Телефон"/><textarea aria-label="Комментарий" placeholder="Что сдаёте? Можно прикрепить фото позже" rows={3}/><button className="button primary" type="submit">Получить расчёт <ArrowRight size={18}/></button><small>Нажимая кнопку, вы соглашаетесь с обработкой данных.</small></form></div></section>

      <section className="section faq" id="faq"><div className="container"><div className="eyebrow">FAQ</div><h2>Частые вопросы</h2>{['От какого объёма вывозите?','Как определяется цена?','Работаете ли с организациями?'].map(q=><details key={q}><summary>{q}<ChevronDown size={18}/></summary><p>Условия уточняются индивидуально после оценки материала, объёма и адреса. Свяжитесь с менеджером для точного расчёта.</p></details>)}</div></section>
    </main>

    <footer><div className="container footer-grid"><div><a className="logo" href="#top"><span className="logo-mark"><Recycle size={20}/></span><span>METAL<span>HUB</span></span></a><p>Приём и вывоз металлолома<br/>в Санкт-Петербурге и Ленинградской области.</p></div><div><b>Навигация</b><a href="#metals">Металлы</a><a href="#how">Как работаем</a><a href="#quote">Расчёт</a></div><div><b>Контакты</b><a href="tel:+78000000000">8 800 000-00-00</a><span><MapPin size={15}/> Санкт-Петербург и ЛО</span></div></div><div className="container copyright">© 2026 Metal Hub SPb. Информация на сайте не является публичной офертой.</div></footer>
  </div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
