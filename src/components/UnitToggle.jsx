import { motion } from 'framer-motion';
import { useWeatherStore } from '../store/weatherStore';

export function UnitToggle() {
  const { unit, toggleUnit } = useWeatherStore();

  return (
    <button
      onClick={toggleUnit}
      className="relative flex items-center glass-card rounded-full p-1 gap-0 border border-white/10 select-none"
      aria-label="Cambiar unidad de temperatura"
    >
      {['C', 'F'].map((u) => (
        <div key={u} className="relative w-9 h-8 flex items-center justify-center">
          {unit === u && (
            <motion.div
              layoutId="unit-pill"
              className="absolute inset-0 bg-white/15 rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative text-xs font-semibold z-10 transition-colors ${unit === u ? 'text-white' : 'text-white/35'}`}>
            °{u}
          </span>
        </div>
      ))}
    </button>
  );
}
