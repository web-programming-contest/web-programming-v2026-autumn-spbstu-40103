import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {api} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [user, setUser] = useState(null); // логин пользователя или null
  const [loading, setLoading] = useState(true); // идёт первичная проверка сессии

  // После перезагрузки страницы спрашиваем у бэкенда, жива ли сессия
  useEffect(() => {
    api
      .me()
      .then((data) => setUser(data.login))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (loginValue, password) => {
    const data = await api.login(loginValue, password); // при ошибке бросит ApiError
    setUser(data.login);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null); // выходим на фронте, даже если сервер не ответил
    }
  }, []);

  const value = useMemo(
    () => ({user, loading, login, logout}),
    [user, loading, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return ctx;
}
