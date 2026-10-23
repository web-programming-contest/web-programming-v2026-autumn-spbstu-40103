import {useState} from 'react';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import {useStore} from '../context/StoreContext.jsx';

export default function LoginPage() {
  const {user, login} = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({username: '', password: ''});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [sending, setSending] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const change = (event) =>
    setValues({...values, [event.target.name]: event.target.value});
  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!values.username.trim())
      nextErrors.username = 'Заполните обязательное поле';
    if (!values.password.trim())
      nextErrors.password = 'Заполните обязательное поле';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSending(true);
    setServerError('');
    try {
      await login(values);
      navigate(location.state?.from || '/', {replace: true});
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit} noValidate>
        <span className="eyebrow">Личный кабинет</span>
        <h1>Вход в Gadget Hub</h1>
        <p>Авторизуйтесь, чтобы перейти в каталог и оформить заказ.</p>
        {serverError && <p className="form-alert">{serverError}</p>}
        <label className={`field ${errors.username ? 'invalid' : ''}`}>
          <span>Имя пользователя</span>
          <input
            name="username"
            value={values.username}
            onChange={change}
            placeholder="Введите логин"
          />
          <small className="field-error">{errors.username}</small>
        </label>
        <label className={`field ${errors.password ? 'invalid' : ''}`}>
          <span>Пароль</span>
          <input
            name="password"
            type="password"
            value={values.password}
            onChange={change}
            placeholder="Введите пароль"
          />
          <small className="field-error">{errors.password}</small>
        </label>
        <button className="button full" disabled={sending}>
          {sending ? 'Входим…' : 'Войти'}
        </button>
        <p className="demo-note">
          <strong>Демо-вход:</strong> student / gadget2026
        </p>
      </form>
    </section>
  );
}
