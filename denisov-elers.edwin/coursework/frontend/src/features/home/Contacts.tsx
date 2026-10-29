import {asset} from '../../utils/assets';

export function Contacts() {
  return (
    <section className="contacts">
      <h2>Работаем 24/7</h2>
      <div>
        <a href="tel:88006783424">
          <span className="contact-icon phone">
            <img src={asset('mobile-icon.svg')} alt="" />
          </span>
          8 (800) 678-34-24
        </a>
        <a href="mailto:gadget@hub.ru">
          <span className="contact-icon">
            <img src={asset('email-icon.svg')} alt="" />
          </span>
          gadget@hub.ru
        </a>
        <p>
          <span className="contact-icon">
            <img src={asset('map-pin-icon.svg')} alt="" />
          </span>
          Санкт-Петербург, ул. Барочная, д.7, корпус 2
        </p>
      </div>
    </section>
  );
}
