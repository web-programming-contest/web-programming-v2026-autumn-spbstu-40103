import {useEffect, useState} from 'react'
import {api} from '../api/client'
import ProductCarousel from '../components/ProductCarousel'
import ProductModal from '../components/ProductModal'
import bannerImg from '../assets/illustrations/banner.jpg'
import fireIcon from '../assets/icons/fire.svg'
import sparklesIcon from '../assets/icons/sparkles.svg'
import rocketIcon from '../assets/icons/rocket.svg'
import refundIcon from '../assets/icons/refund.svg'
import licenseIcon from '../assets/icons/license.svg'
import phoneIcon from '../assets/icons/phone-b.svg'
import mailIcon from '../assets/icons/mail.svg'
import pinIcon from '../assets/icons/pin.svg'
import './HomePage.css'

const ADVANTAGES = [
  {icon: rocketIcon, title: 'Утром заказали, вечером получили'},
  {icon: refundIcon, title: 'С товаром что-то не так? Вернем деньги'},
  {icon: licenseIcon, title: 'Только оригинальные товары'},
]

export default function HomePage() {
  const [hits, setHits] = useState([])
  const [novelties, setNovelties] = useState([])
  const [selectedGood, setSelectedGood] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.getHighlighted('hits', 10), api.getHighlighted('new', 10)])
      .then(([h, n]) => {
        if (cancelled) {
          return
        }
        setHits(h.items || h || [])
        setNovelties(n.items || n || [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home-page">
      <div className="container">
        <section className="hero">
          <img
            src={bannerImg}
            alt="Super Sale: умный робот-друг Red solution Reddy Air, скидка 10%, 27990 ₽ вместо 31100 ₽"
          />
        </section>

        <div className="home-page__carousels">
          <ProductCarousel
            icon={fireIcon}
            title="Хиты продаж"
            description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
            items={hits}
            onOpen={setSelectedGood}
          />
          <ProductCarousel
            icon={sparklesIcon}
            title="Новинки"
            description="Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники"
            items={novelties}
            onOpen={setSelectedGood}
          />
        </div>

        <section className="advantages">
          <h2 className="home-page__heading">Преимущества</h2>
          <div className="advantages__grid">
            {ADVANTAGES.map((a) => (
              <div className="advantage-card" key={a.title}>
                <img src={a.icon} alt="" />
                <p>{a.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contacts">
          <h2 className="home-page__heading">Работаем 24/7</h2>
          <div className="contacts__row">
            <a className="contacts__item" href="tel:88006783424">
              <img src={phoneIcon} alt="" />8 (800) 678-34-24
            </a>
            <a className="contacts__item" href="mailto:gadget@hub.ru">
              <img src={mailIcon} alt="" />
              gadget@hub.ru
            </a>
            <div className="contacts__item">
              <img src={pinIcon} alt="" />
              <span>
                Санкт-Петербург, ул.
                <br />
                Барочная, д.7, корпус 2
              </span>
            </div>
          </div>
        </section>
      </div>

      {selectedGood && <ProductModal good={selectedGood} onClose={() => setSelectedGood(null)} />}
    </div>
  )
}
