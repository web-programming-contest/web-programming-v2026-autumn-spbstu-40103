import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth, ApiError} from '../context/AuthContext';
import MessageDialog from '../components/MessageDialog';
import bg from '../assets/illustrations/login-bg.svg';
import './LoginPage.css';

const NOT_FOUND =
  'Такого пользователя нет, возможно неправильный логин или пароль - проверьте данные';
const REQUIRED = 'Заполните обязательное поле';

export default function LoginPage() {
  const {login} = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [popup, setPopup] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!username.trim()) {
      errors.username = REQUIRED;
    }
    if (!password.trim()) {
      errors.password = REQUIRED;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate('/', {replace: true});
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setPopup(NOT_FOUND);
      } else if (
        err instanceof ApiError &&
        err.status === 400 &&
        err.body?.fields
      ) {
        setFieldErrors(err.body.fields);
      } else {
        setPopup('Не удалось выполнить вход. Попробуйте ещё раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const bind = (name, value, set) => ({
    value,
    onChange: (e) => {
      set(e.target.value);
      setFieldErrors((prev) => ({...prev, [name]: undefined}));
    },
  });

  return (
    <div className="login-page">
      <img className="login-page__bg" src={bg} alt="" aria-hidden="true" />

      <div className="login-page__box">
        <h1 className="login-page__title">Добро пожаловать!</h1>
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div
            className={`field ${fieldErrors.username ? 'field--error' : ''}`}
          >
            <label className="field__label" htmlFor="username">
              Логин
            </label>
            <input
              id="username"
              className="field__input"
              autoComplete="username"
              {...bind('username', username, setUsername)}
            />
            <span className="field__star">*</span>
            {fieldErrors.username && (
              <span className="field__error">{fieldErrors.username}</span>
            )}
          </div>

          <div
            className={`field ${fieldErrors.password ? 'field--error' : ''}`}
          >
            <label className="field__label" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              className="field__input"
              type="password"
              autoComplete="current-password"
              {...bind('password', password, setPassword)}
            />
            <span className="field__star">*</span>
            {fieldErrors.password && (
              <span className="field__error">{fieldErrors.password}</span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>

      {popup && (
        <MessageDialog title="Ошибка входа" onClose={() => setPopup('')}>
          <p>{popup}</p>
        </MessageDialog>
      )}
    </div>
  );
}
