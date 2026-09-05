import React, { useEffect } from 'react';
import { 
  MapPin, 
  Building2, 
  ShieldAlert, 
  Navigation, 
  PhoneCall, 
  Layers, 
  CheckCircle2, 
  Radio,
  ExternalLink
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { nearbyResponders } from '../../services/mockData';

// Fix Leaflet default icon URLs safely for Vite
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
  try {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  } catch (err) {
    console.warn('Leaflet icon override warning:', err);
  }
}

// Helper functions for custom icons
const createEmergencyIcon = () => {
  if (!L || typeof L.divIcon !== 'function') return null;
  return L.divIcon({
    className: 'custom-emergency-pin',
    html: `<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 20px #ef4444; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">🚨</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const createHospitalIcon = () => {
  if (!L || typeof L.divIcon !== 'function') return null;
  return L.divIcon({
    className: 'custom-hospital-pin',
    html: `<div style="background: #f59e0b; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 14px #f59e0b; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">🏥</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export default function AccidentMapTab({ selectedVehicle, telemetry }) {
  const position = [telemetry.lat, telemetry.lng];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={24} color="#ef4444" /> Live Accident Location & GPS Map
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Real-time coordinates synced from NEO-6M GPS receiver on {selectedVehicle.name} ({selectedVehicle.registrationNumber})
          </p>
        </div>

        {/* GPS Coordinate Pill */}
        <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }}>
          <div>
            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>COORDINATES</span>
            <div style={{ color: '#f59e0b', fontWeight: 700 }} className="mono">
              {telemetry.lat.toFixed(5)}, {telemetry.lng.toFixed(5)}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>SATELLITES</span>
            <div style={{ color: '#10b981', fontWeight: 700 }}>
              {telemetry.gpsSatellites} Sats (3D Fix)
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="glass-card" style={{ height: '520px', overflow: 'hidden', position: 'relative', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
        <MapContainer 
          center={position} 
          zoom={15} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', background: 'var(--bg-dark)' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Vehicle Position Marker */}
          <Marker position={position} icon={createEmergencyIcon()}>
            <Popup>
              <div style={{ color: '#0f172a', padding: '4px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#ef4444' }}>🚨 {selectedVehicle.name}</strong><br />
                <span style={{ fontSize: '0.8rem' }}>Registration: {selectedVehicle.registrationNumber}</span><br />
                <span style={{ fontSize: '0.8rem' }}>Speed: {telemetry.speedKmh.toFixed(1)} km/h</span><br />
                <span style={{ fontSize: '0.8rem' }}>G-Impact: {telemetry.totalGForce.toFixed(2)}g</span>
              </div>
            </Popup>
          </Marker>

          {/* Emergency Safety Geofence Circle */}
          <Circle 
            center={position} 
            radius={800} 
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.08, weight: 1.5, dashArray: '6, 6' }} 
          />

          {/* Hospital Responders Pins */}
          {nearbyResponders.map(h => (
            <Marker key={h.id} position={[h.coordinates.lat, h.coordinates.lng]} icon={createHospitalIcon()}>
              <Popup>
                <div style={{ color: '#0f172a', padding: '4px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#f59e0b' }}>🏥 {h.name}</strong><br />
                  <span style={{ fontSize: '0.8rem' }}>Distance: {h.distance} ({h.eta})</span><br />
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>ICU Beds Available: {h.icuBeds}</span><br />
                  <a href={`tel:${h.phone}`} style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>Call {h.phone}</a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Overlay Floating Card */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '16px',
          maxWidth: '320px',
          color: '#fff'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={14} /> Nearest Emergency Hospital
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
            {nearbyResponders[0].name}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
            ETA: <strong style={{ color: '#10b981' }}>{nearbyResponders[0].eta}</strong> ({nearbyResponders[0].distance}) | <strong>{nearbyResponders[0].icuBeds} ICU Beds</strong> Open
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${telemetry.lat},${telemetry.lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary" 
              style={{ padding: '6px 12px', fontSize: '0.75rem', width: '100%' }}
            >
              <Navigation size={14} /> Navigate Ambulance
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Responders List */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={18} color="#f59e0b" /> Nearby Trauma Centers & Police Stations (Within 5km)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {nearbyResponders.map(r => (
            <div key={r.id} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className={`badge badge-${r.type === 'Hospital' ? 'info' : 'warning'}`}>
                    {r.type}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    {r.distance} ({r.eta} ETA)
                  </span>
                </div>
                <h4 style={{ fontSize: '0.9rem', color: '#f8fafc', margin: '4px 0' }}>{r.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                  {r.traumaLevel || '24/7 Police Patrol Helpline'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {r.icuBeds !== undefined && (
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                    {r.icuBeds} ICU Beds Ready
                  </span>
                )}
                <a href={`tel:${r.phone}`} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  <PhoneCall size={12} /> Call {r.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
