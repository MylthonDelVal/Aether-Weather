import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, unit }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 rounded-xl text-xs text-white/90 border border-white/10">
        {payload[0].value}°{unit}
      </div>
    );
  }
  return null;
};

export function HourlyForecast({ forecast, unit, getTemp }) {
  // 8 entries = 24 hours (every 3h)
  const hourly = forecast.slice(0, 8);

  const chartData = hourly.map(item => ({
    hour: new Date(item.dt * 1000).getHours() + ':00',
    temp: getTemp(Math.round(item.main.temp)),
    icon: item.weather[0].icon,
  }));

  return (
    <div className="border-t border-white/8 pt-6 mb-6">
      {/* Icon row */}
      <div className="flex justify-between mb-2 overflow-x-auto pb-1">
        {hourly.map((item, i) => (
          <motion.div
            key={item.dt}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex flex-col items-center min-w-[52px]"
          >
            <p className="text-[10px] text-white/40 mb-1">
              {new Date(item.dt * 1000).getHours()}:00
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              className="w-9 h-9 brightness-150 invert"
              alt={item.weather[0].description}
            />
            <p className="text-xs font-semibold mt-0.5">
              {getTemp(Math.round(item.main.temp))}°
            </p>
          </motion.div>
        ))}
      </div>

      {/* Temperature chart */}
      <div className="h-[80px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="rgba(91,156,246,0.5)" />
                <stop offset="95%" stopColor="rgba(91,156,246,0)" />
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
            <Tooltip content={<CustomTooltip unit={unit} />} cursor={false} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="rgba(91,156,246,0.8)"
              strokeWidth={2}
              fill="url(#tempGrad)"
              dot={{ fill: 'rgba(91,156,246,0.9)', r: 2, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: '#5b9cf6', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
