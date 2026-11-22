export const REQUIRED_MESSAGE = 'Заполните обязательное поле';

// Возвращает объект с ошибками по полям. Пустой объект = форма валидна.
export function validateLogin({login, password}) {
  const errors = {};
  if (login.trim() === '') {
    errors.login = REQUIRED_MESSAGE;
  }
  if (password === '') {
    errors.password = REQUIRED_MESSAGE;
  } // пароль не обрезаем: пробелы могут быть его частью
  return errors;
}
