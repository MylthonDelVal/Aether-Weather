export function WeatherSkeleton() {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 text-center border border-white/8 w-full max-w-[520px] mx-auto">
      {/* City */}
      <div className="skeleton h-3 w-28 mx-auto mb-3 rounded-full" />
      {/* Subtitle */}
      <div className="skeleton h-2 w-40 mx-auto mb-8 rounded-full opacity-50" />

      {/* Icon */}
      <div className="skeleton w-28 h-28 rounded-full mx-auto mb-4" />

      {/* Temp */}
      <div className="skeleton h-20 w-40 mx-auto mb-3 rounded-2xl" />
      {/* Condition */}
      <div className="skeleton h-4 w-24 mx-auto mb-10 rounded-full" />

      {/* Hourly forecast */}
      <div className="flex justify-between border-t border-white/8 pt-6 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="skeleton h-2 w-8 rounded-full" />
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="skeleton h-3 w-8 rounded-full" />
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
