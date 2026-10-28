import mobileLogo from '../assets/images/icons/mobile.svg';

import vkLogo from '../assets/images/social icons/vk.svg';
import telegramLogo from '../assets/images/social icons/telegram.svg';
import whatsappLogo from '../assets/images/social icons/whatsapp.svg';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrapper">
        <div className="about-company">
          <div>
            <h2>Gadget Hub</h2>
            <p>Магазин надежных товаров</p>
          </div>
          <div>&copy; {year} ООО "Гаджет Хаб". Все права защищены</div>
        </div>

        <div className="phone">
          <a href="tel:+79218469996" rel="noreferrer" target="_blank">
            <img src={mobileLogo} alt="mobile-logo" />
            <h2>8 (921) 846-99-96</h2>
          </a>
        </div>

        <div className="social-media">
          <a
            href="https://vk.com/examplay_youtube"
            rel="noreferrer"
            target="_blank"
          >
            <img src={vkLogo} alt="vkontakte" />
          </a>
          <a
            href="https://t.me/examplay_youtube"
            rel="noreferrer"
            target="_blank"
          >
            <img src={telegramLogo} alt="telegram" />
          </a>
          <a href="https://wa.me/79218469996" rel="noreferrer" target="_blank">
            <img src={whatsappLogo} alt="whatsapp" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
