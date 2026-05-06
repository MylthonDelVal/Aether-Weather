import { motion } from 'framer-motion';

const metrics = [
  {
    key: 'wind',
    label: 'Viento',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
    format: (v) => `${Math.round(v * 3.6)} km/h`,
  },
  {
    key: 'humidity',
    label: 'Humedad',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M3 12H2m20 0h-1M4.927 19.073l.707-.707M18.364 5.636l.707-.707M12 6a6 6 0 100 12A6 6 0 0012 6z" />
      </svg>
    ),
    format: (v) => `${v}%`,
  },
  {
    key: 'feelsLike',
    label: 'Sensación',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    format: (v, unit, getTemp) => `${getTemp(v)}°${unit}`,
  },
  {
    key: 'pressure',
    label: 'Presión',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7v5l3 3" />
      </svg>
    ),
    format: (v) => `${v} hPa`,
  },
  {
    key: 'visibility',
    label: 'Visibilidad',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    format: (v) => `${(v / 1000).toFixed(1)} km`,
  },
  {
    key: 'humidity', // re-use slot for sunrise/sunset handled separately
    label: 'Punto rocío',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 21.5C7 21.5 3.5 17.5 3.5 13c0-5 8.5-13 8.5-13S20.5 8 20.5 13c0 4.5-3.5 8.5-8.5 8.5z" />
      </svg>
    ),
    format: (v) => `${v}%`,
  },
];

export function WeatherMetrics({ weather, unit, getTemp }) {
  const values = {
    wind:       weather.wind_ms,
    humidity:   weather.humidity,
    feelsLike:  weather.feelsLike_c,
    pressure:   weather.pressure,
    visibility: weather.visibility,
  };

  const displayMetrics = [
    { label: 'Viento',      value: `${Math.round(weather.wind_ms * 3.6)} km/h`, icon: metrics[0].icon },
    { label: 'Humedad',     value: `${weather.humidity}%`,                       icon: metrics[1].icon },
    { label: 'Sensación',   value: `${getTemp(weather.feelsLike_c)}°${unit}`,   icon: metrics[2].icon },
    { label: 'Presión',     value: `${weather.pressure} hPa`,                   icon: metrics[3].icon },
    { label: 'Visibilidad', value: `${(weather.visibility / 1000).toFixed(1)} km`, icon: metrics[4].icon },
    { label: 'Amanecer',
      value: new Date(weather.sunrise * 1000).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 3v1M5.05 5.05l.707.707M3 12H2M5.05 18.95l.707-.707M12 20v1M18.95 18.95l-.707-.707M21 12h1M18.95 5.05l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 mt-6 w-full">
      {displayMetrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 + 0.3 }}
          className="glass-card rounded-2xl p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-1.5 text-white/35">
            {m.icon}
            <span className="text-[9px] uppercase tracking-widest font-medium">{m.label}</span>
          </div>
          <p className="text-base font-semibold text-white/95 leading-none">{m.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
