import {describe, expect, it} from 'vitest';
import {REQUIRED_MESSAGE, validateLogin} from './loginValidation';

describe('validateLogin', () => {
  it('пустые поля дают ошибки у обоих', () => {
    expect(validateLogin({login: '', password: ''})).toEqual({
      login: REQUIRED_MESSAGE,
      password: REQUIRED_MESSAGE,
    });
  });
  it('логин из одних пробелов считается пустым', () => {
    expect(validateLogin({login: '   ', password: 'x'})).toEqual({
      login: REQUIRED_MESSAGE,
    });
  });
  it('пароль из пробелов допустим (его не обрезаем)', () => {
    expect(validateLogin({login: 'admin', password: '  '})).toEqual({});
  });
  it('заполненная форма валидна', () => {
    expect(validateLogin({login: 'admin', password: 'gadget2024'})).toEqual({});
  });
});
