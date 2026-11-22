import {PhoneIcon} from '../../icons';
import styles from './Footer.module.css';

const PHONE = '8 (800) 678-34-24';

const SOCIALS = [
  {name: 'ВКонтакте', href: 'https://vk.com', icon: '/images/social/vk.png'},
  {name: 'Telegram', href: 'https://t.me', icon: '/images/social/telegram.png'},
  {
    name: 'WhatsApp',
    href: 'https://wa.me',
    icon: '/images/social/whatsapp.png',
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.about}>
          <div className={styles.title}>Gadget Hub</div>
          <div className={styles.text}>Магазин надежных гаджетов</div>
          <div className={`${styles.text} ${styles.copyright}`}>
            © 2024 ООО “Гаджет Хаб”. Все права защищены
          </div>
        </div>

        <a className={styles.phone} href="tel:88006783424">
          <PhoneIcon size={32} />
          {PHONE}
        </a>

        <ul className={styles.socials}>
          {SOCIALS.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className={styles.social}
              >
                <img src={s.icon} alt="" width="36" height="36" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
