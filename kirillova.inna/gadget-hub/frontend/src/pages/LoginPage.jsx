import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../hooks/AuthContext.jsx';
import {ApiError} from '../api/client.js';
import AlertDialog from '../components/AlertDialog.jsx';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {login} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError(null);

    const errors = {};
    if (!username.trim()) {
      errors.username = 'Заполните обязательное поле';
    }
    if (!password.trim()) {
      errors.password = 'Заполните обязательное поле';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate(redirectTo, {replace: true});
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : 'Не удалось войти. Попробуйте ещё раз.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <img
        src="/images/login-left.svg"
        alt=""
        aria-hidden="true"
        className="login-page__art login-page__art--left"
      />

      <div className="login-card">
        <h1 className="login-card__title">Добро пожаловать!</h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field form-field--required">
            <label htmlFor="username">Логин</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={fieldErrors.username ? 'input--error' : ''}
            />
            {fieldErrors.username && (
              <span className="form-field__error">{fieldErrors.username}</span>
            )}
          </div>

          <div className="form-field form-field--required">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldErrors.password ? 'input--error' : ''}
            />
            {fieldErrors.password && (
              <span className="form-field__error">{fieldErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="button button--primary button--full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>

      <AlertDialog
        isOpen={serverError !== null}
        message={serverError}
        onClose={() => setServerError(null)}
      />
    </div>
  );
}

export default LoginPage;
