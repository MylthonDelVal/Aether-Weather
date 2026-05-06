import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon (Leaflet + Vite issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 10, { duration: 1.5 });
  }, [lat, lon]);
  return null;
}

export function WeatherMap({ weather }) {
  const API_KEY = import.meta.env.VITE_OWM_API_KEY;

  return (
    <div className="w-full h-[280px] rounded-[1.5rem] overflow-hidden mt-6 border border-white/8">
      <MapContainer
        center={[weather.lat, weather.lon]}
        zoom={9}
        zoomControl={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Dark base map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {/* OWM precipitation layer */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={0.6}
        />
        {/* OWM temp layer */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={0.35}
        />

        <Marker position={[weather.lat, weather.lon]}>
          <Popup>
            <span className="text-xs font-semibold">{weather.city}, {weather.country}</span>
          </Popup>
        </Marker>

        <RecenterMap lat={weather.lat} lon={weather.lon} />
      </MapContainer>
    </div>
  );
}
