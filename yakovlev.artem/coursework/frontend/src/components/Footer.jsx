import {Link} from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <Link to="/" className="logo">
            <Logo footer />
          </Link>
          <p className="footer-tagline">Магазин надежных гаджетов</p>
          <p className="footer-copy">
            © 2024 ООО “Гаджет Хаб”. Все права защищены
          </p>
        </div>
        <div className="footer-col footer-col-contacts">
          <a className="footer-phone" href="tel:88006783424">
            <img
              src="/images/icons/mobile.svg"
              alt=""
              className="footer-phone-icon"
            />
            8 (800) 678-34-24
          </a>
        </div>
        <div className="footer-col footer-col-social">
          <a
            href="https://vk.com"
            target="_blank"
            rel="noreferrer"
            aria-label="ВКонтакте"
          >
            <img src="/images/social/vk.png" alt="VK" />
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
          >
            <img src="/images/social/telegram.png" alt="Telegram" />
          </a>
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <img src="/images/social/whatsapp.png" alt="WhatsApp" />
          </a>
        </div>
      </div>
    </footer>
  );
}
