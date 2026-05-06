import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWeatherStore } from '../store/weatherStore';
import { Background } from '../components/Background';
import { DailyForecast } from '../components/DailyForecast';
import { WeatherMap } from '../components/WeatherMap';
import { WeatherMetrics } from '../components/WeatherMetrics';
import { HourlyForecast } from '../components/HourlyForecast';
import { UnitToggle } from '../components/UnitToggle';
import { WeatherSkeleton } from '../components/WeatherSkeleton';
import { ErrorToast } from '../components/ErrorToast';

export default function CityDetail() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const { weather, forecast, loading, unit, getTemp, fetchByCity } = useWeatherStore();

  useEffect(() => {
    // If store has a different city, fetch the requested one
    if (!weather || weather.city.toLowerCase() !== cityName.toLowerCase()) {
      fetchByCity(cityName);
    }
  }, [cityName]);

  return (
    <>
      <Background condition={weather?.condition ?? 'default'} />
      <ErrorToast />

      <div className="relative min-h-screen w-full flex flex-col items-center pt-8 pb-16 px-4 overflow-x-hidden">

        {/* Top bar */}
        <div className="w-full max-w-[600px] flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors glass-card px-4 py-2.5 rounded-2xl border border-white/8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </motion.button>

          <h2 className="text-sm font-semibold text-white/80 tracking-wide">
            {weather?.city}{weather?.country ? `, ${weather.country}` : ''}
          </h2>

          <UnitToggle />
        </div>

        {loading || !weather ? (
          <WeatherSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[600px] flex flex-col gap-4"
          >
            {/* Hero card */}
            <div className="glass-card rounded-[2.5rem] p-8 text-center border border-white/9 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="text-left">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Ahora mismo</p>
                  <p className="text-xs text-white/40 italic">{weather.time}</p>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.iconCode}@2x.png`}
                  className={`w-16 h-16 ${weather.condition !== 'Despejado' ? 'brightness-125 invert' : ''}`}
                  alt={weather.condition}
                />
              </div>

              <div className="flex items-end gap-4 justify-center mb-2">
                <h1 className="font-serif text-[110px] leading-none font-normal tracking-tighter">
                  {getTemp(weather.temp_c)}°
                </h1>
                <div className="mb-6 text-left">
                  <p className="text-2xl font-light text-white/70">{weather.condition}</p>
                  <p className="text-sm text-white/35">
                    {getTemp(weather.tempMax_c)}° / {getTemp(weather.tempMin_c)}°
                  </p>
                  <p className="text-xs text-white/25 mt-1">
                    Sensación {getTemp(weather.feelsLike_c)}°
                  </p>
                </div>
              </div>

              {/* Hourly + chart */}
              <HourlyForecast forecast={forecast} unit={unit} getTemp={getTemp} />
            </div>

            {/* Daily forecast */}
            <DailyForecast forecast={forecast} unit={unit} getTemp={getTemp} />

            {/* Metrics grid */}
            <WeatherMetrics weather={weather} unit={unit} getTemp={getTemp} />

            {/* Map */}
            <div className="glass-card rounded-[2rem] p-4 border border-white/8">
              <h3 className="text-[10px] text-white/35 uppercase tracking-[0.25em] mb-3 font-medium px-2">
                Mapa meteorológico
              </h3>
              <WeatherMap weather={weather} />
            </div>

          </motion.div>
        )}
      </div>
    </>
  );
}
