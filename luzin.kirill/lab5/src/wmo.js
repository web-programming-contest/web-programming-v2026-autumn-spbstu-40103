const WMO_CODES = {
  0: {desc: 'Ясно', icon: '☀️'},
  1: {desc: 'Преимущественно ясно', icon: '🌤️'},
  2: {desc: 'Переменная облачность', icon: '⛅'},
  3: {desc: 'Пасмурно', icon: '☁️'},
  45: {desc: 'Туман', icon: '🌫️'},
  48: {desc: 'Переохлажденный туман', icon: '🌫️'},
  51: {desc: 'Легкая морось', icon: '🌧️'},
  53: {desc: 'Умеренная морось', icon: '🌧️'},
  55: {desc: 'Сильная морось', icon: '🌧️'},
  61: {desc: 'Слабый дождь', icon: '🌧️'},
  63: {desc: 'Умеренный дождь', icon: '🌧️'},
  65: {desc: 'Сильный дождь', icon: '🌧️'},
  71: {desc: 'Слабый снег', icon: '❄️'},
  73: {desc: 'Умеренный снег', icon: '❄️'},
  75: {desc: 'Сильный снег', icon: '❄️'},
  95: {desc: 'Гроза', icon: '⛈️'},
};

export function getWeatherInfo(code) {
  return WMO_CODES[code] || {desc: 'Неизвестно', icon: '?'};
}
