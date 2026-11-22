export const REQUIRED_MESSAGE = 'Заполните обязательное поле';

const LOGIN_PATTERN = /^[a-zA-Z0-9_-]+$/;

// Возвращает объект с ошибками. Пустой объект означает, что форма валидна.
export function validateRegistration({login, password, confirmPassword}) {
  const errors = {};
  const normalizedLogin = login.trim();

  if (!normalizedLogin) {
    errors.login = REQUIRED_MESSAGE;
  } else if (normalizedLogin.length < 3) {
    errors.login = 'Логин должен содержать не менее 3 символов';
  } else if (normalizedLogin.length > 32) {
    errors.login = 'Логин должен содержать не более 32 символов';
  } else if (!LOGIN_PATTERN.test(normalizedLogin)) {
    errors.login = 'Используйте латинские буквы, цифры, дефис и подчёркивание';
  }

  if (password === '') {
    errors.password = REQUIRED_MESSAGE;
  } else if (password.length < 8) {
    errors.password = 'Пароль должен содержать не менее 8 символов';
  } else if (password.length > 128) {
    errors.password = 'Пароль должен содержать не более 128 символов';
  }

  if (confirmPassword === '') {
    errors.confirmPassword = REQUIRED_MESSAGE;
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Пароли не совпадают';
  }

  return errors;
}
