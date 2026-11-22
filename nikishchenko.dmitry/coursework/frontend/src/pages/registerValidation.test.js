import {describe, expect, it} from 'vitest';
import {REQUIRED_MESSAGE, validateRegistration} from './registerValidation';

describe('validateRegistration', () => {
  it('пустые поля дают ошибки', () => {
    expect(
      validateRegistration({login: '', password: '', confirmPassword: ''}),
    ).toEqual({
      login: REQUIRED_MESSAGE,
      password: REQUIRED_MESSAGE,
      confirmPassword: REQUIRED_MESSAGE,
    });
  });

  it('проверяет длину и формат логина', () => {
    expect(
      validateRegistration({
        login: 'ab',
        password: 'password1',
        confirmPassword: 'password1',
      }).login,
    ).toBe('Логин должен содержать не менее 3 символов');
    expect(
      validateRegistration({
        login: 'имя пользователя',
        password: 'password1',
        confirmPassword: 'password1',
      }).login,
    ).toBe('Используйте латинские буквы, цифры, дефис и подчёркивание');
  });

  it('проверяет длину пароля и совпадение', () => {
    expect(
      validateRegistration({
        login: 'user1',
        password: 'short',
        confirmPassword: 'short',
      }).password,
    ).toBe('Пароль должен содержать не менее 8 символов');
    expect(
      validateRegistration({
        login: 'user1',
        password: 'password1',
        confirmPassword: 'password2',
      }).confirmPassword,
    ).toBe('Пароли не совпадают');
  });

  it('при корректных данных ошибок нет', () => {
    expect(
      validateRegistration({
        login: 'user_1',
        password: 'password1',
        confirmPassword: 'password1',
      }),
    ).toEqual({});
  });
});
