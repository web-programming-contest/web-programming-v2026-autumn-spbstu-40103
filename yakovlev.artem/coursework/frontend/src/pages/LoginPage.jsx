import {useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

export default function LoginPage() {
  const {user, loading, login} = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({login: '', password: ''});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const update = (patch) => {
    setValues((v) => ({...v, ...patch}));
    setErrors((e) => {
      const next = {...e};
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!values.login.trim()) {
      nextErrors.login = 'Заполните обязательное поле';
    }
    if (!values.password.trim()) {
      nextErrors.password = 'Заполните обязательное поле';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await login(values.login.trim(), values.password);
      navigate('/', {replace: true});
    } catch (err) {
      setServerError(
        err.message ||
          'Такого пользователя нет, возможно неправильный логин или пароль - проверьте данные',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <img
        className="login-page-deco login-page-deco-laptop"
        src="/images/promo/login-laptop.png"
        alt=""
      />
      <img
        className="login-page-deco login-page-deco-center"
        src="/images/promo/login-center.png"
        alt=""
      />
      <img
        className="login-page-deco login-page-deco-right-top"
        src="/images/promo/login-right-top.png"
        alt=""
      />
      <img
        className="login-page-deco login-page-deco-right-bottom"
        src="/images/promo/login-right-bottom.png"
        alt=""
      />
      <div className="login-page-content">
        <h1 className="login-page-title">Добро пожаловать!</h1>
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <label className={`field${errors.login ? ' field-error' : ''}`}>
            <span className="field-label">
              Логин<span className="field-required">*</span>
            </span>
            <input
              type="text"
              name="login"
              autoComplete="username"
              value={values.login}
              onChange={(e) => update({login: e.target.value})}
            />
            {errors.login && (
              <span className="field-error">{errors.login}</span>
            )}
          </label>
          <label className={`field${errors.password ? ' field-error' : ''}`}>
            <span className="field-label">
              Пароль<span className="field-required">*</span>
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => update({password: e.target.value})}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </label>
          <button
            type="submit"
            className="btn btn-blue login-card-submit"
            disabled={submitting}
          >
            Войти
          </button>
        </form>
      </div>

      {serverError && (
        <div className="modal-overlay" onClick={() => setServerError('')}>
          <div
            className="modal login-error"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Закрыть"
              onClick={() => setServerError('')}
            >
              ✕
            </button>
            <p className="login-error-text">{serverError}</p>
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => setServerError('')}
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
