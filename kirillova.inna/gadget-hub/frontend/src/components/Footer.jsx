function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">Gadget Hub</span>
          <p className="footer__tagline">Магазин надежных гаджетов</p>
          <p className="footer__copyright">
            © 2024 ООО «Гаджет Хаб». Все права защищены
          </p>
        </div>

        <div className="footer__phone">
          <img
            src="/images/icons/mobile.svg"
            alt=""
            className="footer__phone-icon"
          />
          <a href="tel:+78006783424">8 (800) 678-34-24</a>
        </div>

        <div className="footer__social">
          <a
            href="https://vk.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Мы ВКонтакте"
            className="footer__social-link"
          >
            <img src="/images/social/vk.png" alt="" />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            aria-label="Мы в Telegram"
            className="footer__social-link"
          >
            <img src="/images/social/telegram.png" alt="" />
          </a>
          <a
            href="https://wa.me"
            target="_blank"
            rel="noreferrer"
            aria-label="Мы в WhatsApp"
            className="footer__social-link"
          >
            <img src="/images/social/whatsapp.png" alt="" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
