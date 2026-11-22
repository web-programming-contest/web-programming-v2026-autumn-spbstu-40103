import {useRef, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import Button from '../components/Button/Button';
import Modal, {ModalActions, ModalMessage} from '../components/Modal/Modal';
import TextField from '../components/TextField/TextField';
import {useAuth} from '../context/AuthContext';
import {validateLogin} from './loginValidation';
import styles from './Login.module.css';
import {usePageTitle} from '../hooks/usePageTitle';

const WRONG_CREDENTIALS =
  'Такого пользователя нет, возможно неправильный логин или пароль — проверьте данные';
const SERVER_ERROR =
  'Не удалось связаться с сервером. Попробуйте ещё раз позже';

export default function Login() {
  usePageTitle('Вход');
  const {user, loading, login} = useAuth();
  const [values, setValues] = useState({login: '', password: ''});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [modalText, setModalText] = useState(null);
  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  function handleChange(field) {
    return (e) => {
      setValues((v) => ({...v, [field]: e.target.value}));
      if (errors[field]) {
        setErrors((er) => ({...er, [field]: undefined}));
      }
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) {
      return;
    }

    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      (found.login ? loginRef : passwordRef).current.focus();
      return;
    }

    setSubmitting(true);
    try {
      await login(values.login.trim(), values.password);
    } catch (err) {
      setModalText(err.status === 401 ? WRONG_CREDENTIALS : SERVER_ERROR);
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Добро пожаловать!</h1>

      <form className={styles.card} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Логин"
          required
          name="login"
          autoComplete="username"
          autoFocus
          value={values.login}
          onChange={handleChange('login')}
          error={errors.login}
          ref={loginRef}
        />
        <TextField
          label="Пароль"
          required
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
          ref={passwordRef}
        />
        <Link to="/register" className={styles['register-link']}>
          Зарегистрироваться
        </Link>
        <Button
          type="submit"
          aria-disabled={submitting || undefined}
          className={styles.submit}
        >
          Войти
        </Button>
      </form>

      {modalText && (
        <Modal label="Ошибка входа" onClose={() => setModalText(null)}>
          <ModalMessage>{modalText}</ModalMessage>
          <ModalActions>
            <Button onClick={() => setModalText(null)}>Ок</Button>
          </ModalActions>
        </Modal>
      )}
    </section>
  );
}
