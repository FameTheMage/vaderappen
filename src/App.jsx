import { useCallback, useEffect, useState } from 'react';
import { translations } from './i18n.js';
import { fetchWeather, iconUrl, placeId, searchPlaces, WeatherError } from './api.js';
import { usePersistentState } from './usePersistentState.js';

function FlagSE() {
  return (
    <svg viewBox="0 0 24 16" width="28" height="19" aria-hidden="true">
      <rect width="24" height="16" fill="#006aa7" />
      <rect x="7" width="3.5" height="16" fill="#fecc00" />
      <rect y="6.25" width="24" height="3.5" fill="#fecc00" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 24 16" width="28" height="19" aria-hidden="true">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#c8102e" strokeWidth="1.2" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" />
    </svg>
  );
}

const STAR_PATH = 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z';

function Icon({ d }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const THEMES =['happy', 'light', 'dark', 'system'];

function applyTheme(theme) {
  const resolved =
    theme === 'system'
      ? matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  document.documentElement.dataset.theme = resolved;
}

export default function App() {
  const [lang, setLang] = usePersistentState('lang', 'sv');
  const [theme, setTheme] = usePersistentState('theme', 'dark');
  const [units, setUnits] = usePersistentState('units', 'metric');
  const [favorites, setFavorites] = usePersistentState('favorites', []);
  const [selected, setSelected] = usePersistentState('selected', null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = translations[lang] || translations.sv;
  const isFav = selected && favorites.some((f) => placeId(f) === placeId(selected));

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${t.title} – ${t.tagline} ☀️`;
  }, [lang, t]);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== 'system') return;
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = () => applyTheme('system');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [theme]);

  const load = useCallback(async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      setWeather(await fetchWeather(selected, units, lang));
    } catch (e) {
      setWeather(null);
      setError(e instanceof WeatherError ? e.code : 'generic');
    } finally {
      setLoading(false);
    }
  }, [selected, units, lang]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setError(null);
    try {
      setResults(await searchPlaces(q));
    } catch (err) {
      setResults(null);
      setError(err instanceof WeatherError ? err.code : 'generic');
    } finally {
      setSearching(false);
    }
  }

  function choose(place) {
    setSelected(place);
    setResults(null);
    setQuery('');
  }

  function toggleFav() {
    if (!selected) return;
    setFavorites((fs) =>
      isFav ? fs.filter((f) => placeId(f) !== placeId(selected)) : [...fs, selected]
    );
  }

  const label = (p) => {
    const n = lang === 'en' ? p.nameEn || p.name : p.name;
    return [n, p.state, p.country].filter(Boolean).join(', ');
  };
  const shortName = (p) => (lang === 'en' ? p.nameEn || p.name : p.name);
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';
  const deg = (v) => `${Math.round(v)}°`;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src="./favicon.svg" alt="" width="36" height="36" />
          <h1>{t.title}</h1>
        </div>
        <div className="controls">
          <label className="select-wrap">
            <span className="sr-only">{t.theme}</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} aria-label={t.theme}>
              {THEMES.map((id) => (
                <option key={id} value={id}>
                  {t.themes[id]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="pill"
            onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
            aria-label={t.units}
            title={t.units}
          >
            {units === 'metric' ? '°C · m/s' : '°F · mph'}
          </button>
          <div className="flags" role="group" aria-label={t.language}>
            <button
              type="button"
              className={lang === 'sv' ? 'flag active' : 'flag'}
              onClick={() => setLang('sv')}
              aria-pressed={lang === 'sv'}
              aria-label="Svenska"
              title="Svenska"
            >
              <FlagSE />
            </button>
            <button
              type="button"
              className={lang === 'en' ? 'flag active' : 'flag'}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              aria-label="English"
              title="English"
            >
              <FlagGB />
            </button>
          </div>
        </div>
      </header>

      <main>
        <p className="tagline">{t.tagline}</p>

        <form className="search" onSubmit={onSearch} role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            autoComplete="off"
          />
          <button type="submit" className="primary" disabled={searching}>
            {searching ? t.searching : t.search}
          </button>
        </form>

        {results && (
          <ul className="results">
            {results.length === 0 && <li className="muted pad">{t.noResults}</li>}
            {results.map((p) => (
              <li key={placeId(p)}>
                <button type="button" onClick={() => choose(p)}>
                  <Icon d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                  {label(p)}
                </button>
              </li>
            ))}
          </ul>
        )}

        <section className="favorites" aria-label={t.favorites}>
          <h2>
            <Icon d={STAR_PATH} />
            {t.favorites}
          </h2>
          {favorites.length === 0 ? (
            <p className="muted">{t.noFavorites}</p>
          ) : (
            <ul className="chips">
              {favorites.map((f) => {
                const active = selected && placeId(f) === placeId(selected);
                return (
                  <li key={placeId(f)} className={active ? 'chip active' : 'chip'}>
                    <button type="button" className="chip-main" onClick={() => choose(f)}>
                      {shortName(f)}
                    </button>
                    <button
                      type="button"
                      className="chip-x"
                      onClick={() => setFavorites((fs) => fs.filter((x) => placeId(x) !== placeId(f)))}
                      aria-label={t.removeNamed(shortName(f))}
                      title={t.removeFavorite}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {error && (
          <div className="error" role="alert">
            <p>{t.errors[error] || t.errors.generic}</p>
            {selected && error !== 'noKey' && error !== 'badKey' && (
              <button type="button" className="primary" onClick={load}>
                {t.retry}
              </button>
            )}
          </div>
        )}

        {!selected && !error && (
          <div className="welcome">
            <div className="welcome-orb" aria-hidden="true" />
            <h2>{t.welcomeTitle}</h2>
            <p>{t.welcomeText}</p>
          </div>
        )}

        {selected && (
          <section className="current card" aria-live="polite">
            <div className="current-head">
              <div>
                <h2>
                  {label(selected)}
                </h2>
                <p className="muted">{t.now}</p>
              </div>
              <button
                type="button"
                className={isFav ? 'star on' : 'star'}
                onClick={toggleFav}
                aria-pressed={!!isFav}
                aria-label={isFav ? t.removeFavorite : t.addFavorite}
                title={isFav ? t.removeFavorite : t.addFavorite}
              >
                <Icon d={STAR_PATH} />
              </button>
            </div>
            {loading && !weather && <p className="muted">{t.loading}</p>}
            {weather && (
              <>
                <div className="current-main">
                  <img src={iconUrl(weather.current.icon)} alt="" width="100" height="100" />
                  <div>
                    <div className="temp">
                      {Math.round(weather.current.temp)}
                      {tempUnit}
                    </div>
                    <div className="desc">{weather.current.description}</div>
                  </div>
                </div>
                <dl className="facts">
                  <div>
                    <dt>{t.feelsLike}</dt>
                    <dd>
                      {Math.round(weather.current.feelsLike)}
                      {tempUnit}
                    </dd>
                  </div>
                  <div>
                    <dt>{t.humidity}</dt>
                    <dd>{weather.current.humidity}%</dd>
                  </div>
                  <div>
                    <dt>{t.wind}</dt>
                    <dd>
                      {Math.round(weather.current.wind)} {windUnit}
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </section>
        )}

        {selected && weather && (
          <section className="forecast" aria-label={t.forecast}>
            <h2>{t.forecast}</h2>
            <ul className="days">
              {weather.days.map((d) => (
                <li key={d.date} className="card day">
                  <div className="dayname">{t.weekdays[d.weekday]}</div>
                  <img src={iconUrl(d.icon)} alt="" width="64" height="64" />
                  <div className="hi" title={t.high}>
                    {deg(d.max)}
                  </div>
                  <div className="lo" title={t.low}>
                    {deg(d.min)}
                  </div>
                  <div className="dd">{d.description}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
