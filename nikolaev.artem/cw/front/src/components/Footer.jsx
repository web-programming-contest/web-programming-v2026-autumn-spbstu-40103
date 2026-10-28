import vkIcon from '../assets/icons/vk.png'
import telegramIcon from '../assets/icons/telegram.png'
import whatsappIcon from '../assets/icons/whatsapp.png'
import phoneIcon from '../assets/icons/phone-f.svg'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">Gadget Hub</div>
          <p className="footer__tagline">Магазин надежных гаджетов</p>
        </div>

        <a className="footer__phone" href="tel:88006783424">
          <img src={phoneIcon} alt="" width="32" height="32" />8 (800) 678-34-24
        </a>

        <div className="footer__social">
          <a href="https://vk.com" target="_blank" rel="noreferrer" aria-label="ВКонтакте">
            <img src={vkIcon} alt="" />
          </a>
          <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">
            <img src={telegramIcon} alt="" />
          </a>
          <a href="https://wa.me" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <img src={whatsappIcon} alt="" />
          </a>
        </div>

        <p className="footer__copy">© 2024 ООО “Гаджет Хаб”. Все права защищены</p>
      </div>
    </footer>
  )
}
