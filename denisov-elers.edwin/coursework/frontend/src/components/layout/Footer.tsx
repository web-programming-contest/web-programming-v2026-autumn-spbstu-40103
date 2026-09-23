import {Link} from 'react-router-dom';
import {asset} from '../../utils/assets';

const socialLinks = [
  ['VK', 'https://vk.com', 'vk'],
  ['Telegram', 'https://t.me', 'tg'],
  ['WhatsApp', 'https://wa.me', 'wa'],
];

export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link className="logo" to="/">
            Gadget Hub
          </Link>
          <p>Магазин надежных гаджетов</p>
        </div>
        <a className="footer-phone" href="tel:88006783424">
          <img src={asset('phone-icon.svg')} alt="" />8 (800) 678-34-24
        </a>
        <div className="socials">
          {socialLinks.map(([name, url, file]) => (
            <a href={url} key={name} aria-label={name}>
              <img src={asset(`social-${file}.png`)} alt={name} />
            </a>
          ))}
        </div>
        <p className="copyright">© 2024 ООО «Гаджет Хаб». Все права защищены</p>
      </div>
    </footer>
  );
}
