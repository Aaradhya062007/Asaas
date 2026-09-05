import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  AlertTriangle, 
  PhoneCall, 
  Radio, 
  HeartPulse, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Send, 
  Navigation, 
  User, 
  Sliders, 
  Zap, 
  Crosshair, 
  Sparkles,
  ChevronRight,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { nearbyResponders } from '../../services/mockData';

// Fix Leaflet icons
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

// Custom Leaflet Icons
const createUserLocationIcon = () => {
  if (!L || typeof L.divIcon !== 'function') return null;
  return L.divIcon({
    className: 'custom-user-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: pulse-ring 2s infinite ease-out;"></div>
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">🚗</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

const createHospitalPinIcon = (isTargeted, isAlertActive) => {
  if (!L || typeof L.divIcon !== 'function') return null;
  const bgColor = isAlertActive && isTargeted ? '#ef4444' : isTargeted ? '#f59e0b' : '#10b981';
  const shadowColor = isAlertActive && isTargeted ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.6)';
  const iconSymbol = isAlertActive && isTargeted ? '🚨' : '🏥';
  
  return L.divIcon({
    className: `custom-hosp-pin-${isTargeted ? 'active' : 'normal'}`,
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        ${isAlertActive && isTargeted ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(239, 68, 68, 0.35); animation: pulse-emergency 1.2s infinite;"></div>` : ''}
        <div style="background: ${bgColor}; width: 30px; height: 30px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 0 16px ${shadowColor}; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; transition: all 0.3s ease;">
          ${iconSymbol}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

export default function PersonalHospitalMapTab({ selectedVehicle, medicalProfile, telemetry, triggerEmergency }) {
  const userPosition = [telemetry.lat, telemetry.lng];

  // Component states
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [onlyIcu, setOnlyIcu] = useState(false);
  const [onlyLevel1, setOnlyLevel1] = useState(false);
  
  // Alert simulation state
  const [selectedHospital, setSelectedHospital] = useState(nearbyResponders[0]);
  const [alertState, setAlertState] = useState({
    active: false,
    targetHospital: null,
    broadcast: false,
    stage: 0, // 0: Idle, 1: Dispatched, 2: ER Received, 3: ICU Bed Reserved, 4: Ambulance En-Route
    timestamp: null,
    logEntries: []
  });

  // Filter hospitals based on user selections
  const filteredHospitals = nearbyResponders.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (h.address && h.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRadius = (h.distanceKm || 1.0) <= radiusKm;
    const matchesIcu = !onlyIcu || (h.icuBeds && h.icuBeds > 0);
    const matchesLevel1 = !onlyLevel1 || (h.traumaLevel && h.traumaLevel.includes('Level 1'));
    return matchesSearch && matchesRadius && matchesIcu && matchesLevel1;
  });

  // Alert simulation sequence effect
  useEffect(() => {
    let timer;
    if (alertState.active && alertState.stage > 0 && alertState.stage < 4) {
      timer = setTimeout(() => {
        setAlertState(prev => {
          const nextStage = prev.stage + 1;
          let newLog = '';
          const targetName = prev.broadcast ? 'ALL Nearby Emergency Trauma Centers' : prev.targetHospital?.name;

          if (nextStage === 2) {
            newLog = `t+3s: [ACKNOWLEDGED] ER Chief at ${targetName} received patient telemetry payload.`;
          } else if (nextStage === 3) {
            newLog = `t+6s: [RESERVED] 1 Trauma ICU Bed & Blood Pack (${medicalProfile.bloodGroup}) assigned.`;
          } else if (nextStage === 4) {
            newLog = `t+9s: [DISPATCHED] Advanced Life Support Ambulance en-route to vehicle location.`;
          }

          return {
            ...prev,
            stage: nextStage,
            logEntries: [...prev.logEntries, newLog]
          };
        });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alertState.active, alertState.stage]);

  // Handler to trigger single hospital alert
  const handleTriggerHospitalAlert = (hosp) => {
    setSelectedHospital(hosp);
    setAlertState({
      active: true,
      targetHospital: hosp,
      broadcast: false,
      stage: 1,
      timestamp: new Date().toLocaleTimeString(),
      logEntries: [
        `t+0s: Emergency SOS Alert dispatched to ${hosp.name}`,
        `t+1s: Payload transmitted - GPS: ${telemetry.lat.toFixed(4)}, ${telemetry.lng.toFixed(4)} | Blood: ${medicalProfile.bloodGroup} | G-Force: ${telemetry.totalGForce.toFixed(2)}g`
      ]
    });

    if (triggerEmergency) {
      triggerEmergency('PERSONAL_HOSPITAL_MAP', 'CRITICAL', `Direct Hospital Alert Sent to ${hosp.name}`);
    }
  };

  // Handler for emergency broadcast to all hospitals
  const handleBroadcastAlert = () => {
    setAlertState({
      active: true,
      targetHospital: null,
      broadcast: true,
      stage: 1,
      timestamp: new Date().toLocaleTimeString(),
      logEntries: [
        `t+0s: [BROADCAST] Emergency SOS Alert broadcasted to ${filteredHospitals.length} nearby trauma centers!`,
        `t+1s: Payload sent - Patient: ${medicalProfile.fullName} | Blood Group: ${medicalProfile.bloodGroup} | Vehicle: ${selectedVehicle.name}`
      ]
    });

    if (triggerEmergency) {
      triggerEmergency('PERSONAL_HOSPITAL_BROADCAST', 'CRITICAL', `Broadcast Alert sent to ${filteredHospitals.length} Hospitals`);
    }
  };

  const handleCancelAlert = () => {
    setAlertState({
      active: false,
      targetHospital: null,
      broadcast: false,
      stage: 0,
      timestamp: null,
      logEntries: []
    });
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <Building2 size={24} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Personal Nearby Hospitals & Alert Map
                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Personalized Geofence</span>
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                Real-time trauma hospital proximity, ICU bed tracking, and direct ER emergency signal broadcast.
              </p>
            </div>
          </div>
        </div>

        {/* Global Broadcast Emergency Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {alertState.active ? (
            <button 
              onClick={handleCancelAlert}
              className="btn btn-outline-danger"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={16} /> Reset Active Alert
            </button>
          ) : (
            <button 
              onClick={handleBroadcastAlert}
              className="btn btn-emergency pulse-red"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <Radio size={18} /> Broadcast SOS to All Hospitals
            </button>
          )}
        </div>
      </div>

      {/* Active Hospital Emergency Alert Console Banner (When Alert is Triggered) */}
      {alertState.active && (
        <div className="glass-card-emergency" style={{ padding: '20px', borderRadius: '18px', borderLeft: '5px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BellRing size={26} color="#ef4444" className="pulse-red" />
              <div>
                <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {alertState.broadcast ? 'BROADCAST EMERGENCY ALERT ACTIVE' : 'DIRECT HOSPITAL SOS ALERT DISPATCHED'}
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '2px 0' }}>
                  {alertState.broadcast ? `Alert Sent to ${filteredHospitals.length} Nearby Trauma Centers` : `Target: ${alertState.targetHospital?.name}`}
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DISPATCH TIME</div>
                <div style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700 }} className="mono">
                  {alertState.timestamp}
                </div>
              </div>
            </div>
          </div>

          {/* 4-Stage Dispatch Progress Tracker */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {[
              { step: 1, title: '1. SOS Dispatched', desc: 'GPS & Telemetry Sent' },
              { step: 2, title: '2. ER Acknowledged', desc: 'Trauma Doctor Notified' },
              { step: 3, title: '3. ICU Reserved', desc: `Bed & ${medicalProfile.bloodGroup} Ready` },
              { step: 4, title: '4. Ambulance En-Route', desc: 'ALS Vehicle Dispatched' }
            ].map(s => {
              const isPassed = alertState.stage >= s.step;
              const isCurrent = alertState.stage === s.step;
              return (
                <div 
                  key={s.step}
                  style={{
                    background: isPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isCurrent ? '1.5px solid #ef4444' : isPassed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '10px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isPassed ? '#34d399' : '#94a3b8' }}>
                      {s.title}
                    </span>
                    {isPassed ? <CheckCircle2 size={14} color="#34d399" /> : isCurrent ? <Activity size={14} color="#ef4444" className="spin" /> : <Clock size={14} color="#64748b" />}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{s.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Real-time Alert Transmission Log */}
          <div style={{ marginTop: '14px', background: 'rgba(0, 0, 0, 0.6)', borderRadius: '10px', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#34d399', maxHeight: '90px', overflowY: 'auto' }}>
            {alertState.logEntries.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '3px' }}>➜ {log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Left Controls & Map | Right Hospital List & Medical Payload */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
        
        {/* Left Column: Filters & Leaflet Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Map Filter Controls Bar */}
          <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Search hospitals by name or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Radius Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>RADIUS:</span>
              {[1, 3, 5, 10].map(r => (
                <button
                  key={r}
                  onClick={() => setRadiusKm(r)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: radiusKm === r ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: radiusKm === r ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: radiusKm === r ? '#f59e0b' : '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {r} km
                </button>
              ))}
            </div>

            {/* Feature Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setOnlyIcu(!onlyIcu)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: onlyIcu ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: onlyIcu ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  color: onlyIcu ? '#34d399' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <HeartPulse size={12} /> ICU Ready
              </button>

              <button
                onClick={() => setOnlyLevel1(!onlyLevel1)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: onlyLevel1 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: onlyLevel1 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  color: onlyLevel1 ? '#fbbf24' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <ShieldAlert size={12} /> Level 1 Only
              </button>
            </div>
          </div>

          {/* Leaflet Map View */}
          <div className="glass-card" style={{ height: '480px', overflow: 'hidden', position: 'relative', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <MapContainer 
              center={userPosition} 
              zoom={14} 
              scrollWheelZoom={true} 
              style={{ height: '100%', width: '100%', background: '#09090b' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* User / Vehicle Marker */}
              <Marker position={userPosition} icon={createUserLocationIcon()}>
                <Popup>
                  <div style={{ color: '#0f172a', padding: '4px' }}>
                    <strong style={{ color: '#3b82f6', fontSize: '0.9rem' }}>🚗 {selectedVehicle.name}</strong><br />
                    <span style={{ fontSize: '0.8rem' }}>Reg: {selectedVehicle.registrationNumber}</span><br />
                    <span style={{ fontSize: '0.8rem' }}>Driver: {medicalProfile.fullName}</span><br />
                    <span style={{ fontSize: '0.8rem' }}>GPS: {telemetry.lat.toFixed(4)}, {telemetry.lng.toFixed(4)}</span>
                  </div>
                </Popup>
              </Marker>

              {/* Distance Proximity Radius Circle */}
              <Circle 
                center={userPosition} 
                radius={radiusKm * 1000} 
                pathOptions={{ 
                  color: '#f59e0b', 
                  fillColor: '#f59e0b', 
                  fillOpacity: 0.05, 
                  weight: 1.5, 
                  dashArray: '5, 8' 
                }} 
              />

              {/* Hospital Markers */}
              {filteredHospitals.map(h => {
                const isTargeted = selectedHospital?.id === h.id;
                const isAlertActive = alertState.active;
                return (
                  <Marker 
                    key={h.id} 
                    position={[h.coordinates.lat, h.coordinates.lng]} 
                    icon={createHospitalPinIcon(isTargeted, isAlertActive)}
                    eventHandlers={{
                      click: () => setSelectedHospital(h)
                    }}
                  >
                    <Popup>
                      <div style={{ color: '#0f172a', padding: '6px', maxWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            {h.type}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>{h.distance}</span>
                        </div>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>🏥 {h.name}</strong><br />
                        <span style={{ fontSize: '0.78rem', color: '#475569' }}>{h.address}</span><br />
                        <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#0f172a' }}>
                          🏥 <strong>{h.icuBeds} ICU Beds</strong> | ⚡ {h.eta} ETA
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleTriggerHospitalAlert(h)}
                            style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            🚨 Alert ER
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Live Map Telemetry Badge Overlay */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 1000,
              background: 'rgba(5, 5, 5, 0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="live-dot" />
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>{filteredHospitals.length} HOSPITALS IN RADIUS</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                Search Zone: <strong style={{ color: '#fff' }}>{radiusKm} km</strong> | Vehicle: <strong style={{ color: '#fff' }}>{selectedVehicle.registrationNumber}</strong>
              </div>
            </div>
          </div>

          {/* Quick Statistics Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>
                <HeartPulse size={20} color="#34d399" />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TOTAL ICU BEDS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                  {filteredHospitals.reduce((acc, curr) => acc + (curr.icuBeds || 0), 0)} Beds
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px' }}>
                <Clock size={20} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FASTEST RESPONSE ETA</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>
                  {filteredHospitals[0]?.eta || '3 mins'}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '12px' }}>
                <ShieldAlert size={20} color="#f87171" />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PATIENT BLOOD GROUP</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171' }}>
                  {medicalProfile.bloodGroup}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Hospital Details & Patient Telemetry Payload Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Selected Hospital Details Card */}
          {selectedHospital && (
            <div className="glass-card" style={{ padding: '18px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                  {selectedHospital.type}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                  ⚡ {selectedHospital.distance} ({selectedHospital.eta})
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: '4px 0 8px 0' }}>
                {selectedHospital.name}
              </h3>

              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                📍 {selectedHospital.address || 'Emergency Trauma Center'}
              </p>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>ICU BEDS</div>
                  <div style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 700 }}>
                    {selectedHospital.icuBeds || 'N/A'} Available
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>VENTILATORS</div>
                  <div style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700 }}>
                    {selectedHospital.ventilators || '4 Unit'} Ready
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>TRAUMA RATING</div>
                  <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>
                    {selectedHospital.rating || '4.9 ★'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>BLOOD BANK</div>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                    {selectedHospital.bloodBank || 'Ready'}
                  </div>
                </div>
              </div>

              {/* ER Doctor on Duty */}
              {selectedHospital.erDocOnDuty && (
                <div style={{ marginTop: '12px', fontSize: '0.76rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#f59e0b" />
                  <span>ON DUTY: <strong>{selectedHospital.erDocOnDuty}</strong></span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => handleTriggerHospitalAlert(selectedHospital)}
                  className="btn btn-emergency"
                  style={{ width: '100%', padding: '10px', fontSize: '0.84rem' }}
                >
                  <Radio size={16} /> Direct SOS Alert to this ER
                </button>

                <a 
                  href={`tel:${selectedHospital.phone}`}
                  className="btn btn-ghost"
                  style={{ width: '100%', padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
                >
                  <PhoneCall size={14} /> Call Hotline: {selectedHospital.phone}
                </a>

                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.coordinates?.lat},${selectedHospital.coordinates?.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                  style={{ width: '100%', padding: '8px', fontSize: '0.8rem', justifyContent: 'center', color: '#f59e0b' }}
                >
                  <Navigation size={14} /> Open GPS Route to ER
                </a>
              </div>
            </div>
          )}

          {/* Patient Telemetry Payload Transmission Box */}
          <div className="glass-card" style={{ padding: '16px', background: 'rgba(10, 10, 15, 0.9)' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} /> ER Telemetry Data Payload
            </div>

            <div style={{ background: '#000', padding: '12px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.6 }}>
              <div><span style={{ color: '#64748b' }}>// Patient Identifiers</span></div>
              <div>NAME: <strong style={{ color: '#fff' }}>{medicalProfile.fullName}</strong></div>
              <div>BLOOD GROUP: <strong style={{ color: '#ef4444' }}>{medicalProfile.bloodGroup}</strong></div>
              <div>AGE/GENDER: <strong style={{ color: '#fff' }}>{medicalProfile.age} yrs / {medicalProfile.gender}</strong></div>
              <div>ALLERGIES: <span style={{ color: '#f59e0b' }}>{medicalProfile.allergies.join(', ')}</span></div>
              <div>INSURANCE: <span style={{ color: '#34d399' }}>{medicalProfile.insuranceProvider}</span></div>
              <div style={{ margin: '6px 0', borderTop: '1px dashed rgba(255,255,255,0.1)' }} />
              <div><span style={{ color: '#64748b' }}>// Sensor Telemetry</span></div>
              <div>IMPACT G-FORCE: <strong style={{ color: telemetry.totalGForce > 3 ? '#ef4444' : '#10b981' }}>{telemetry.totalGForce.toFixed(2)}g</strong></div>
              <div>SPEED AT EVENT: <strong style={{ color: '#fff' }}>{telemetry.speedKmh.toFixed(1)} km/h</strong></div>
              <div>GPS LOC: <strong style={{ color: '#f59e0b' }}>{telemetry.lat.toFixed(4)}, {telemetry.lng.toFixed(4)}</strong></div>
            </div>
          </div>

        </div>

      </div>

      {/* Hospital List Table view below */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={18} color="#f59e0b" /> Nearby Registered Emergency Hospitals ({filteredHospitals.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '14px' }}>
          {filteredHospitals.map(h => (
            <div 
              key={h.id} 
              style={{
                background: selectedHospital?.id === h.id ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedHospital?.id === h.id ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className={`badge badge-${h.type === 'Hospital' ? 'warning' : 'info'}`}>
                    {h.type}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    {h.distance} ({h.eta} ETA)
                  </span>
                </div>
                
                <h4 style={{ fontSize: '0.92rem', color: '#f8fafc', margin: '4px 0' }}>{h.name}</h4>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
                  {h.traumaLevel}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                  🏥 {h.icuBeds || 0} ICU Beds Ready
                </span>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleTriggerHospitalAlert(h)}
                    className="btn btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                  >
                    🚨 Alert ER
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
