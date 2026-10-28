const getDates = () =>
  Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString();
  });

export const MOCK_DB = {
  москва: {
    current: {
      temperature_2m: 21,
      apparent_temperature: 20,
      relative_humidity_2m: 52,
      wind_speed_10m: 3.1,
      surface_pressure: 998,
      weather_code: 0,
    },
    daily: {
      time: getDates(),
      weather_code: [0, 1, 2, 61, 3, 0, 0],
      temperature_2m_max: [21, 23, 19, 18, 20, 22, 24],
      temperature_2m_min: [13, 14, 12, 11, 12, 14, 15],
    },
  },
  'санкт-петербург': {
    current: {
      temperature_2m: 14,
      apparent_temperature: 12,
      relative_humidity_2m: 78,
      wind_speed_10m: 5.2,
      surface_pressure: 1010,
      weather_code: 61,
    },
    daily: {
      time: getDates(),
      weather_code: [61, 2, 0, 2, 63, 3, 1],
      temperature_2m_max: [14, 16, 18, 17, 15, 13, 16],
      temperature_2m_min: [9, 10, 11, 12, 9, 8, 10],
    },
  },
};
