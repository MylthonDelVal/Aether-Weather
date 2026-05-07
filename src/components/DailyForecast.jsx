import { motion } from 'framer-motion';

const TRANSLATIONS = {
  "Clear": "Despejado", "Clouds": "Nublado", "Rain": "Lluvia",
  "Drizzle": "Llovizna", "Thunderstorm": "Tormenta", "Snow": "Nieve",
  "Mist": "Neblina", "Fog": "Niebla",
};

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function DailyForecast({ forecast, unit, getTemp }) {
  const days = {};
  forecast.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    const hour = date.getHours();
    if (!days[dayKey] || Math.abs(hour - 12) < Math.abs(new Date(days[dayKey].dt * 1000).getHours() - 12)) {
      days[dayKey] = item;
    }
  });

  const dailyList = Object.values(days).slice(0, 5);

  return (
    <div className="glass-card rounded-[2rem] p-6 mt-4 border border-white/8">
      <h3 className="text-[10px] text-white/35 uppercase tracking-[0.25em] mb-4 font-medium">
        Pronóstico 5 días
      </h3>
      <div className="flex flex-col gap-0">
        {dailyList.map((item, i) => {
          const date = new Date(item.dt * 1000);
          const isToday = i === 0;
          const condition = TRANSLATIONS[item.weather[0].main] || item.weather[0].main;

          return (
            <motion.div
              key={item.dt}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
            >
              <span className="text-sm font-medium w-10 text-white/70">
                {isToday ? 'Hoy' : DAYS[date.getDay()]}
              </span>

              <div className="flex items-center gap-1.5 flex-1 justify-center">
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  className="w-8 h-8 brightness-150 invert"
                  alt={condition}
                />
                <span className="text-xs text-white/40 hidden sm:block">{condition}</span>
              </div>

              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-white/90">{getTemp(Math.round(item.main.temp_max))}°</span>
                <span className="text-white/30">{getTemp(Math.round(item.main.temp_min))}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
