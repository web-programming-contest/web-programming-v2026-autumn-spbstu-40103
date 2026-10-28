import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import '../styles/profileStyle.scss';

function ProfilePage({
  onLogin,
  setActiveItem,
}: {
  onLogin: (login: string) => void;
  setActiveItem: (v: string) => void;
}) {
  const [isErrorLogin, setErrorLogin] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const login = formData.get('login')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    if (login === '' || password === '') {
      setErrorLogin('empty-data');
      return;
    }
    if (login.length < 4) {
      setErrorLogin('size-login');
      return;
    }
    if (password.length < 6) {
      setErrorLogin('size-password');
      return;
    }

    fetch('http://127.0.0.1:8080/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: login, password}),
    })
      .then((res) => {
        if (!res.ok) {
          setErrorLogin('incorrect-data');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data === true) {
          onLogin(login);
          navigate('/');
          setActiveItem('home');
          setErrorLogin('');
        }
      })
      .catch(() => setErrorLogin('incorrect-data'));
  }

  return (
    <div className="profile">
      <h1>Добро пожаловать!</h1>
      <div className="login_block">
        <form onSubmit={handleSubmit}>
          <div className="input-template">
            <label htmlFor="login">Логин</label>
            <input
              id="login"
              name="login"
              type="text"
              style={isErrorLogin !== '' ? {outline: '1px #FF60C3 solid'} : {}}
            />
          </div>

          <div className="input-template">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              style={
                isErrorLogin !== ''
                  ? {marginBottom: '0', outline: '1px #FF60C3 solid'}
                  : {marginBottom: '30px'}
              }
            />
          </div>

          {isErrorLogin === 'incorrect-data' && (
            <p>Неправильный логин или пароль</p>
          )}
          {isErrorLogin === 'empty-data' && <p>Нельзя вводить пустые поля</p>}
          {isErrorLogin === 'size-login' && (
            <p>Длина логина не может быть меньше 4 символов</p>
          )}
          {isErrorLogin === 'size-password' && (
            <p>Длина пароля не может быть меньше 6 символов</p>
          )}

          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
