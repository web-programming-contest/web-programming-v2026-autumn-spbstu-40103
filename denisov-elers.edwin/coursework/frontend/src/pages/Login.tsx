import {useState, type FormEvent} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {useStore} from '../context/Store';

export function Login() {
  const {login, authenticated} = useStore();
  const navigate = useNavigate();
  const [values, setValues] = useState({login: '', password: ''});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setError('');
    if (!values.login.trim() || !values.password.trim()) {
      return;
    }
    setBusy(true);
    try {
      await login(values.login.trim(), values.password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-content">
        <h1>Добро пожаловать!</h1>
        <form noValidate onSubmit={submit}>
          {(['login', 'password'] as const).map((name) => (
            <label className="field" key={name}>
              {name === 'login' ? 'Логин' : 'Пароль'}
              <span className="required">*</span>
              <input
                name={name}
                autoComplete={
                  name === 'login' ? 'username' : 'current-password'
                }
                type={name === 'login' ? 'text' : 'password'}
                value={values[name]}
                aria-invalid={submitted && !values[name].trim()}
                aria-describedby={
                  submitted && !values[name].trim()
                    ? `${name}-error`
                    : undefined
                }
                onChange={(e) => setValues({...values, [name]: e.target.value})}
              />
              {submitted && !values[name].trim() && (
                <span className="error" id={`${name}-error`}>
                  Обязательное поле
                </span>
              )}
            </label>
          ))}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="primary" disabled={busy}>
            {busy ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>
    </main>
  );
}
