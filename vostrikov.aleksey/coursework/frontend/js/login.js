import { getSession, login } from './api.js';
import { initLayout } from './layout.js';

await initLayout('');

const existing = await getSession().catch(() => ({ authenticated: false }));
if (existing.authenticated) {
  window.location.href = './index.html';
}

const form = document.querySelector('[data-login-form]');
const modal = document.querySelector('[data-error-modal]');
const modalText = document.querySelector('[data-error-message]');

function setFieldError(name, message = '') {
  const field = form.querySelector(`[name="${name}"]`);
  const wrapper = field.closest('.form-field');
  wrapper.classList.toggle('has-error', Boolean(message));
  wrapper.querySelector('.field-error').textContent = message;
}

function showModal(message) {
  modalText.textContent = message;
  modal.showModal();
}

document.querySelector('[data-modal-close]').addEventListener('click', () => modal.close());

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const username = String(data.get('username') ?? '').trim();
  const password = String(data.get('password') ?? '').trim();

  setFieldError('username');
  setFieldError('password');

  let valid = true;
  if (!username) {
    setFieldError('username', 'Заполните обязательное поле');
    valid = false;
  }
  if (!password) {
    setFieldError('password', 'Заполните обязательное поле');
    valid = false;
  }
  if (!valid) return;

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    await login(username, password);
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    window.location.href = next && /^[\w-]+\.html$/.test(next) ? `./${next}` : './index.html';
  } catch (error) {
    showModal(error.message);
  } finally {
    submit.disabled = false;
  }
});
