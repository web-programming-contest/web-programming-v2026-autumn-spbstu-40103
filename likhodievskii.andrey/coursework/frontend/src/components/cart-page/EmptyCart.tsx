import {useNavigate} from 'react-router-dom';

import EmptyCartImage from '../../assets/images/backgrounds/empty-cart.svg';

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="emptyCart">
      <div className="illustration">
        <img src={EmptyCartImage} alt="empty cart" />
      </div>
      <h1>Пока пусто</h1>
      <p>
        Ознакомьтесь с новинками и хитами на главной
        <br />
        или найдите нужное в каталоге
      </p>
      <div className="buttons">
        <button
          className="button-blue-template"
          onClick={() => navigate('/catalog')}
        >
          <span>Перейти в каталог</span>
        </button>
        <button
          className="button-blue-template btn-link"
          onClick={() => navigate('/')}
        >
          <span>Главная страница</span>
        </button>
      </div>
    </div>
  );
}

export default EmptyCart;
