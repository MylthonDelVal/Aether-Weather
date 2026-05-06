import { motion, AnimatePresence } from 'framer-motion';

const BG_IMAGES = {
  "Despejado": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2062",
  "Nublado":   "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2022",
  "Neblina":   "https://images.unsplash.com/photo-1444384851176-6e23071c6127?q=80&w=2040",
  "Niebla":    "https://images.unsplash.com/photo-1444384851176-6e23071c6127?q=80&w=2040",
  "Lluvia":    "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974",
  "Llovizna":  "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974",
  "Tormenta":  "https://images.unsplash.com/photo-1605727281914-504789bad552?q=80&w=2070",
  "Nieve":     "https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=2016",
  "default":   "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144"
};

const SNOW_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${(i * 2.5) % 100}%`,
  size: (i % 5) + 2,
  delay: `${(i * 0.13) % 5}s`,
  duration: `${6 + (i % 5)}s`,
  opacity: 0.4 + (i % 6) * 0.1,
}));

export function Background({ condition }) {
  const isFoggy  = condition === 'Niebla' || condition === 'Neblina';
  // Lógica unificada para estados de lluvia
  const isRainy  = condition === 'Lluvia' || condition === 'Llovizna' || condition === 'Tormenta';
  const currentBg = BG_IMAGES[condition] || BG_IMAGES['default'];

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#080e1c] -z-10">

      {/* 1. IMAGEN DE FONDO CON CROSSFADE (Nivel z-0 implicito) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentBg})`,
            filter: isFoggy
              ? 'brightness(0.45) blur(6px)'
              : 'brightness(0.38) contrast(1.15) saturate(0.85)',
          }}
        />
      </AnimatePresence>

      {/* 2. CAPAS ATMOSFÉRICAS (Nivel z-10) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        {/* ESTADO: DESPEJADO - Solo video, sin el bloom CSS */}
        {condition === 'Despejado' && (
          <video
            autoPlay
            loop
            muted
            playsInline
            key="clear-video"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ 
              opacity: 0.5, 
              mixBlendMode: 'soft-light', // Corregido a camelCase
              filter: 'contrast(1.2) saturate(1.3) brightness(1.1)' 
            }}
          >
            <source src="/Despejado.mp4" type="video/mp4" />
          </video>
        )}

        {/* ESTADO: NUBLADO - Video de nubes (Excluyente de lluvia) */}
        {condition === 'Nublado' && (
          <video
            autoPlay
            loop
            muted
            playsInline
            key="cloud-video"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ 
              opacity: 0.65, 
              mixBlendMode: 'soft-light', 
              filter: 'grayscale(1) contrast(1.1)' 
            }}
          >
            <source src="/clouds-new.mp4" type="video/mp4" />
          </video>
        )}

        {/* ESTADO: LLUVIA / TORMENTA - Video de lluvia real unificado */}
        {isRainy && (
          <video
            autoPlay
            loop
            muted
            playsInline
            key="rain-video"
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000"
            style={{ mixBlendMode: 'screen' }}
          >
            <source src="/rain-vizi.mp4" type="video/mp4" />
          </video>
        )}

        {/* Efectos adicionales que se superponen */}
        {condition === 'Tormenta' && <div className="animate-lightning" />}
        {isFoggy && <div className="fog-overlay" />}

        {/* NIEVE: Partículas estables */}
        {condition === 'Nieve' && SNOW_PARTICLES.map(p => (
          <div
            key={p.id}
            className="snow-particle"
            style={{
              left: p.left,
              width: p.size, height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* 3. TEXTURA FINAL Y EFECTOS DE POST-PROCESADO (Nivel z-20 y z-30) */}
      
      {/* Film grain (Estética Indie Sleaze) */}
      <div className="absolute inset-0 z-20 opacity-[0.05] mix-blend-overlay pointer-events-none
        bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Grain_Noise.png')]" />

      {/* Vignette (Profundidad cinematográfica) */}
      <div className="absolute inset-0 z-30 pointer-events-none
        bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}