const COUNTRY_CODES = new Set([
  '1', '7',
  '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46', '47',
  '48', '49', '51', '52', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63', '64', '65',
  '66', '81', '82', '84', '86', '90', '91', '92', '93', '94', '95', '98',
  '211', '212', '213', '216', '218', '220', '221', '222', '223', '224', '225', '226', '227', '228',
  '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241', '242',
  '243', '244', '245', '246', '247', '248', '249', '250', '251', '252', '253', '254', '255', '256',
  '257', '258', '260', '261', '262', '263', '264', '265', '266', '267', '268', '269', '290', '291',
  '297', '298', '299', '350', '351', '352', '353', '354', '355', '356', '357', '358', '359', '370',
  '371', '372', '373', '374', '375', '376', '377', '378', '380', '381', '382', '383', '385', '386',
  '387', '389', '420', '421', '423', '500', '501', '502', '503', '504', '505', '506', '507', '508',
  '509', '590', '591', '592', '593', '594', '595', '596', '597', '598', '599', '670', '672', '673',
  '674', '675', '676', '677', '678', '679', '680', '681', '682', '683', '685', '686', '687', '688',
  '689', '690', '691', '692', '850', '852', '853', '855', '856', '880', '886', '960', '961', '962',
  '963', '964', '965', '966', '967', '968', '970', '971', '972', '973', '974', '975', '976', '977',
  '992', '993', '994', '995', '996', '998'
]);

const PHONE_HINT = 'Формат: + код страны и 10 цифр, например +7 (999) 123-45-67';
const USERS_KEY = 'registeredUsers';

const normalizeEmail = email => email.trim().toLowerCase();
const normalizePhone = phone => phone.replace(/\D/g, '');

function validatePhoneNum(value) {
  const phone = value.trim();
  if (!phone) {
    return 'Введите телефон';
  }

  if (!phone.startsWith('+')) {
    return 'Номер должен начинаться с «+». ${PHONE_HINT}';
  }

  if (!/^\+\d[\d\s()-]*$/.test(phone)) {
    return 'Допустимы только цифры, пробелы, дефисы и скобки. ${PHONE_HINT}' ;
  }

  const opens = (phone.match(/\(/g) || []).length;
  const closes = (phone.match(/\)/g) || []).length;
  if (opens !== closes || opens > 1 || (opens === 1 && !/\(\d+\)/.test(phone))) {
    return 'Некорректные скобки. ${PHONE_HINT}';
  }

  const digits = phone.replace(/\D/g, '');
  const lambdaValidate = x => COUNTRY_CODES.has(digits.slice(0, x)) && digits.length - x === 10
  const valid = [1, 2, 3].some(lambdaValidate);
  if (!valid) {
    return 'Неверный код страны или количество цифр (после кода должно быть ровно 10). ${PHONE_HINT}';
  }

  return '';
}

function validateEmail(value) {
  const email = value.trim();
  if (!email) {
    return 'Введите e-mail';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return 'Введите корректный e-mail';
  }
  return '';
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setError(inputName, text) {
  const field = form.elements[inputName].closest('.field');
  field.querySelector('.error').textContent = text;
  field.classList.toggle('invalid', Boolean(text));
}


const form = document.getElementById('reg-form');
const messageEl = document.getElementById('message');

form.addEventListener('input', event => {
  if (event.target.name) {
    setError(event.target.name, '');
  }
  messageEl.textContent = '';
});

form.addEventListener('submit', event => {
  event.preventDefault();
  messageEl.textContent = '';

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value;
  const phone = form.elements.phone.value;
  const password = form.elements.password.value;
  const password2 = form.elements.password2.value;

  const errors = {
    name: name ? '' : 'Введите имя',
    email: validateEmail(email),
    phone: validatePhoneNum(phone),
    password: password ? '' : 'Введите пароль',
    password2: !password2 ? 'Повторите пароль' : (password !== password2 ? 'Пароли не совпадают' : '')
  };

  const users = getUsers();

  if (!errors.phone && users.some(u => u.phone === normalizePhone(phone))) {
    errors.phone = 'Аккаунт с таким телефоном уже зарегистрирован';
  }

  if (!errors.email && users.some(u => u.email === normalizeEmail(email))) {
    errors.email = 'Аккаунт с таким e-mail уже зарегистрирован';
  }
  Object.entries(errors).forEach(([field, text]) => setError(field, text));
  if (Object.values(errors).some(Boolean)) {
    return;
  }

  saveUser({ name, email: normalizeEmail(email), phone: normalizePhone(phone) });
  form.reset();
  messageEl.textContent = 'Регистрация прошла успешно!';
});