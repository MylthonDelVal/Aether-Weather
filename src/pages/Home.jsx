import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWeatherStore } from '../store/weatherStore';
import { Background } from '../components/Background';
import { SearchBar } from '../components/SearchBar';
import { WeatherSkeleton } from '../components/WeatherSkeleton';
import { WeatherMetrics } from '../components/WeatherMetrics';
import { HourlyForecast } from '../components/HourlyForecast';
import { UnitToggle } from '../components/UnitToggle';
import { ErrorToast } from '../components/ErrorToast';

export default function Home() {
  const navigate = useNavigate();
  const { weather, forecast, loading, unit, getTemp, fetchByCoords, fetchByCity } = useWeatherStore();

  // Init: geolocation with fallback
  useEffect(() => {
    if (weather) return; // already loaded
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      ()    => fetchByCity('Durango')
    );
  }, []);

  // Update tab title + favicon
  useEffect(() => {
    if (!weather) return;
    document.title = `${getTemp(weather.temp_c)}°${unit} · ${weather.city}`;
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = `https://openweathermap.org/img/wn/${weather.iconCode}.png`;
  }, [weather, unit]);

  return (
    <>
      <Background condition={weather?.condition ?? 'default'} />
      <ErrorToast />

      <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-10 pb-16 px-4 overflow-x-hidden">

        {/* Top bar */}
        <div className="w-full max-w-[520px] flex items-center gap-3 mb-6">
          <div className="flex-1">
            <SearchBar />
          </div>
          <UnitToggle />
        </div>

        {loading || !weather ? (
          <WeatherSkeleton />
        ) : (
          <motion.div
            key={weather.city}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[520px]"
          >
            <div className="glass-card rounded-[2.5rem] p-8 text-center border border-white/9 shadow-2xl">

              {/* Header */}
              <p className="text-xs font-bold tracking-[0.35em] text-white uppercase mb-0.5 drop-shadow">
                {weather.city}
                <span className="text-white/35 font-normal">, {weather.country}</span>
              </p>
              <p className="text-[10px] text-white/30 italic mb-5">
                Actualizado: {weather.time}
              </p>

              {/* Icon */}
              <div className="flex justify-center mb-[-18px]">
                <motion.img
                  key={weather.iconCode}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  src={`https://openweathermap.org/img/wn/${weather.iconCode}@4x.png`}
                  className={`w-36 h-36 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] 
                    ${weather.condition !== 'Despejado' ? 'brightness-125 invert' : ''}`}
                  alt={weather.condition}
                />
              </div>

              {/* Temperature */}
              <div className="mb-1">
                <h1 className="font-serif text-[96px] leading-none font-normal tracking-tighter inline-block">
                  {getTemp(weather.temp_c)}°
                </h1>
                <span className="text-sm font-light text-white/50 align-top ml-1 mt-6 inline-block">
                  {getTemp(weather.tempMax_c)}° / {getTemp(weather.tempMin_c)}°
                </span>
              </div>

              <p className="text-lg font-light tracking-wide text-white/75 mb-7">
                {weather.condition}
              </p>

              {/* Hourly + chart */}
              <HourlyForecast forecast={forecast} unit={unit} getTemp={getTemp} />

              {/* Metrics */}
              <WeatherMetrics weather={weather} unit={unit} getTemp={getTemp} />

              {/* Detail link */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/city/${weather.city}`)}
                className="mt-6 w-full py-3.5 rounded-2xl border border-white/10 text-sm text-white/60
                  hover:bg-white/8 hover:text-white/90 transition-all flex items-center justify-center gap-2"
              >
                Ver pronóstico completo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
