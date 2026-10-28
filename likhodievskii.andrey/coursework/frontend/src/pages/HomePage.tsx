import {useState, useEffect} from 'react';

import HomeBanner from '../assets/images/backgrounds/banner.svg';

import rocketIcon from '../assets/images/home-page/rocket.svg';
import moneyBackIcon from '../assets/images/home-page/money-back.svg';
import certificateIcon from '../assets/images/home-page/certificate.svg';

import phoneIcon from '../assets/images/home-page/phone.svg';
import emailIcon from '../assets/images/home-page/email.svg';
import locationIcon from '../assets/images/home-page/location.svg';

import Slider from '../components/home-page/Slider';

import '../styles/homeStyle.scss';
import {Product} from '../components/Structures';

function HomePage({data, isLoading}: {data: Product[]; isLoading: boolean}) {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [novelty, setNovelty] = useState<Product[]>([]);

  useEffect(() => {
    setBestsellers(data.filter((item) => item.isBestseller));
    setNovelty(data.filter((item) => item.isNovelty));
  }, [data]);

  return (
    <div className="home">
      <div className="banner">
        <img src={HomeBanner} alt="home-banner" />
      </div>

      <Slider
        nameClass="bestsellers"
        title="Хиты продаж"
        description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
        data={bestsellers}
        isLoading={isLoading}
      />

      <Slider
        nameClass="novelty"
        title="Новинки"
        description="Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники."
        data={novelty}
        isLoading={isLoading}
      />

      <div className="section advantages">
        <h1>Преимущества</h1>
        <div className="items">
          <div className="item">
            <img src={rocketIcon} alt="rocket-icon" />
            <h2>Утром заказали, вечером получили</h2>
          </div>
          <div className="item">
            <img src={moneyBackIcon} alt="money-back-icon" />
            <h2>С товаром что-то не так? Вернем деньги</h2>
          </div>
          <div className="item">
            <img src={certificateIcon} alt="certificate-icon" />
            <h2>Только оригинальные товары</h2>
          </div>
        </div>
      </div>

      <div className="section contacts">
        <h1>Работаем 24/7</h1>
        <div className="items">
          <div className="item">
            <img src={phoneIcon} alt="phone-icon" />
            <h2>8 (921) 846-99-96</h2>
          </div>
          <div className="item">
            <img src={emailIcon} alt="email-icon" />
            <h2>gadget@hub.ru</h2>
          </div>
          <div className="item">
            <img src={locationIcon} alt="location-icon" />
            <h2>Санкт-Петербург, ул. Барочная, д.7, корпус 2</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
