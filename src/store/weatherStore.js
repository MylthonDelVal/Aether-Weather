import { create } from 'zustand';

const TRANSLATIONS = {
  "Clear": "Despejado", "Clouds": "Nublado", "Rain": "Lluvia",
  "Drizzle": "Llovizna", "Thunderstorm": "Tormenta", "Snow": "Nieve",
  "Mist": "Neblina", "Fog": "Niebla", "Haze": "Neblina",
  "Smoke": "Humo", "Dust": "Polvo", "Sand": "Arena",
  "Ash": "Ceniza", "Squall": "Turbonada", "Tornado": "Tornado"
};

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

const parseWeather = (dataW) => ({
  temp_c:    Math.round(dataW.main.temp),
  tempMax_c: Math.round(dataW.main.temp_max),
  tempMin_c: Math.round(dataW.main.temp_min),
  feelsLike_c: Math.round(dataW.main.feels_like),
  condition: TRANSLATIONS[dataW.weather[0].main] || dataW.weather[0].main,
  conditionRaw: dataW.weather[0].main,
  city:      dataW.name,
  country:   dataW.sys.country,
  iconCode:  dataW.weather[0].icon,
  humidity:  dataW.main.humidity,
  wind_ms:   dataW.wind.speed,
  pressure:  dataW.main.pressure,
  visibility: dataW.visibility,
  lat:       dataW.coord.lat,
  lon:       dataW.coord.lon,
  sunrise:   dataW.sys.sunrise,
  sunset:    dataW.sys.sunset,
  time:      new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
});

export const useWeatherStore = create((set, get) => ({
  weather:     null,
  forecast:    [],
  unit:        'C',   // 'C' | 'F'
  loading:     false,
  error:       null,
  suggestions: [],

  // ─── TOGGLE UNIT ───
  toggleUnit: () => set(s => ({ unit: s.unit === 'C' ? 'F' : 'C' })),

  // ─── DISPLAY HELPERS ───
  getTemp: (c) => {
    const { unit } = get();
    if (unit === 'F') return Math.round(c * 9/5 + 32);
    return c;
  },

  // ─── FETCH BY COORDS ───
  fetchByCoords: async (lat, lon) => {
    set({ loading: true, error: null });
    try {
      const [resW, resF] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      ]);
      if (!resW.ok) throw new Error('Ciudad no encontrada');
      const [dataW, dataF] = await Promise.all([resW.json(), resF.json()]);
      set({ weather: parseWeather(dataW), forecast: dataF.list, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ─── FETCH BY CITY NAME ───
  fetchByCity: async (city) => {
    set({ loading: true, error: null, suggestions: [] });
    try {
      const [resW, resF] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
      ]);
      if (!resW.ok) throw new Error(`No se encontró "${city}"`);
      const [dataW, dataF] = await Promise.all([resW.json(), resF.json()]);
      set({ weather: parseWeather(dataW), forecast: dataF.list, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ─── AUTOCOMPLETE SUGGESTIONS ───
  fetchSuggestions: async (query) => {
    if (query.length < 2) return set({ suggestions: [] });
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await res.json();
      set({ suggestions: data });
    } catch { set({ suggestions: [] }); }
  },

  clearSuggestions: () => set({ suggestions: [] }),
  clearError: () => set({ error: null }),
}));
