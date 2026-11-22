import {useRef, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import Button from '../components/Button/Button';
import Modal, {ModalActions, ModalMessage} from '../components/Modal/Modal';
import TextField from '../components/TextField/TextField';
import {useAuth} from '../context/AuthContext';
import {api} from '../api/client';
import {usePageTitle} from '../hooks/usePageTitle';
import {validateRegistration} from './registerValidation';
import styles from './Register.module.css';

const SERVER_ERROR =
  'Не удалось связаться с сервером. Попробуйте ещё раз позже';

export default function Register() {
  usePageTitle('Регистрация');
  const {user, loading} = useAuth();
  const [values, setValues] = useState({
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [modalText, setModalText] = useState(null);

  const loginRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  function handleChange(field) {
    return (event) => {
      const nextValue = event.target.value;
      setValues((current) => ({...current, [field]: nextValue}));
      setErrors((current) => {
        const nextErrors = {...current, [field]: undefined};

        if (field === 'password') {
          nextErrors.confirmPassword = undefined;
        }
        return nextErrors;
      });
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || registered) {
      return;
    }

    const found = validateRegistration(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstInvalid = found.login
        ? loginRef
        : found.password
          ? passwordRef
          : confirmPasswordRef;
      firstInvalid.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await api.register(values.login.trim(), values.password);
      setRegistered(true);
    } catch (error) {
      if (error.status === 409) {
        setModalText(
          'Пользователь с таким логином уже существует. Выберите другой логин.',
        );
      } else if (error.status === 422) {
        setModalText(
          'Проверьте логин и пароль: данные не соответствуют требованиям.',
        );
      } else {
        setModalText(SERVER_ERROR);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Создать аккаунт</h1>

      <form className={styles.card} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Логин"
          required
          name="login"
          autoComplete="username"
          autoFocus
          maxLength={32}
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
          autoComplete="new-password"
          maxLength={128}
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
          ref={passwordRef}
        />
        <TextField
          label="Повторите пароль"
          required
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          maxLength={128}
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          ref={confirmPasswordRef}
        />

        {registered ? (
          <p className={styles['success-message']} role="status">
            Успешная регистрация!{' '}
            <Link to="/login" className={styles['success-link']}>
              Войдите в аккаунт
            </Link>
          </p>
        ) : (
          <Button
            type="submit"
            aria-disabled={submitting || undefined}
            className={styles.submit}
          >
            Зарегистрироваться
          </Button>
        )}
      </form>

      {modalText && (
        <Modal label="Ошибка регистрации" onClose={() => setModalText(null)}>
          <ModalMessage>{modalText}</ModalMessage>
          <ModalActions>
            <Button onClick={() => setModalText(null)}>Ок</Button>
          </ModalActions>
        </Modal>
      )}
    </section>
  );
}
