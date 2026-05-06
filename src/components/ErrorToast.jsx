import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../store/weatherStore';

export function ErrorToast() {
  const { error, clearError } = useWeatherStore();

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 4000);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3
            glass-card px-5 py-3.5 rounded-2xl border border-red-500/20 shadow-xl"
        >
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm text-white/90">{error}</span>
          <button onClick={clearError} className="ml-2 text-white/30 hover:text-white/70 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
