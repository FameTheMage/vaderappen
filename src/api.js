const BASE = 'https://api.openweathermap.org';

export class WeatherError extends Error {
  constructor(code) {
    super(code);
    this.code = code; // noKey | badKey | rateLimit | network | generic
  }
}

function getKey() {
  const key = (import.meta.env.VITE_OPENWEATHER_API_KEY || '').trim();
  if (!key) throw new WeatherError('noKey');
  return key;
}

async function request(path, params) {
  const key = getKey();
  const qs = new URLSearchParams({ ...params, appid: key });
  let res;
  try {
    res = await fetch(`${BASE}${path}?${qs}`);
  } catch {
    throw new WeatherError('network');
  }
  if (res.status === 401) throw new WeatherError('badKey');
  if (res.status === 429) throw new WeatherError('rateLimit');
  if (!res.ok) throw new WeatherError('generic');
  return res.json();
}

export async function searchPlaces(query) {
  const data = await request('/geo/1.0/direct', { q: query, limit: 5 });
  return data.map((p) => ({
    name: p.local_names?.sv || p.name,
    nameEn: p.local_names?.en || p.name,
    state: p.state || '',
    country: p.country,
    lat: p.lat,
    lon: p.lon,
  }));
}

export const placeId = (p) => `${p.lat.toFixed(3)},${p.lon.toFixed(3)}`;

function groupForecast(list, tz) {
  const days = new Map();
  for (const e of list) {
    const local = new Date((e.dt + tz) * 1000);
    const key = local.toISOString().slice(0, 10);
    if (!days.has(key)) days.set(key, []);
    days.get(key).push({ ...e, hour: local.getUTCHours() });
  }
  return [...days.entries()].map(([date, entries]) => {
    const mid = entries.reduce((a, b) => (Math.abs(b.hour - 13) < Math.abs(a.hour - 13) ? b : a));
    return {
      date,
      weekday: new Date(`${date}T12:00:00Z`).getUTCDay(),
      min: Math.min(...entries.map((x) => x.main.temp_min)),
      max: Math.max(...entries.map((x) => x.main.temp_max)),
      icon: mid.weather[0].icon,
      description: mid.weather[0].description,
    };
  });
}

export async function fetchWeather(place, units, lang) {
  const params = { lat: place.lat, lon: place.lon, units, lang };
  const [current, forecast] = await Promise.all([
    request('/data/2.5/weather', params),
    request('/data/2.5/forecast', params),
  ]);
  const tz = forecast.city?.timezone ?? current.timezone ?? 0;
  const todayKey = new Date((current.dt + tz) * 1000).toISOString().slice(0, 10);
  const days = groupForecast(forecast.list, tz)
    .filter((d) => d.date > todayKey)
    .slice(0, 5);
  return {
    current: {
      temp: current.main.temp,
      feelsLike: current.main.feels_like,
      humidity: current.main.humidity,
      wind: current.wind.speed,
      icon: current.weather[0].icon,
      description: current.weather[0].description,
    },
    days,
  };
}

export const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;
