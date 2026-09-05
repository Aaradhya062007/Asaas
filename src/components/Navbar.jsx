import React from 'react';
import { 
  ShieldAlert, 
  Car, 
  Bike, 
  Wifi, 
  BatteryCharging, 
  Radio, 
  AlertTriangle, 
  UserCheck, 
  Lock,
  Zap
} from 'lucide-react';

export default function Navbar({ 
  vehicles, 
  selectedVehicle, 
  setSelectedVehicle, 
  telemetry, 
  triggerEmergency, 
  currentUser, 
  openAuthModal,
  expiryAlertCount
}) {
  return (
    <header className="navbar-container" style={{
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
        }}>
          <ShieldAlert size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            ASAAS <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>SYSTEM OS</span>
          </h1>
          <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>Automated System for Accident Alert & Safety</p>
        </div>
      </div>

      {/* Active Vehicle & Telemetry Summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Vehicle Selector Dropdown */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '10px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {selectedVehicle.type === 'two-wheeler' ? (
            <Bike size={18} color="#f59e0b" />
          ) : (
            <Car size={18} color="#f59e0b" />
          )}
          <select 
            value={selectedVehicle.id}
            onChange={(e) => {
              const found = vehicles.find(v => v.id === e.target.value);
              if (found) setSelectedVehicle(found);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.id} style={{ background: '#0d0d0d', color: '#fff' }}>
                {v.name} ({v.registrationNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Hardware Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.78rem',
          color: '#94a3b8',
          background: 'rgba(12, 12, 12, 0.8)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
            <span className="live-dot" /> ESP32 Online
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BatteryCharging size={14} color="#f59e0b" /> {telemetry.batteryPercent}%
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Radio size={14} color="#a855f7" /> {telemetry.gpsSatellites} Sats
          </span>
        </div>

        {/* Expiry Alerts Badge Counter if any */}
        {expiryAlertCount > 0 && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '0.78rem',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600
          }}>
            <AlertTriangle size={14} /> {expiryAlertCount} Document Alert{expiryAlertCount > 1 ? 's' : ''}
          </div>
        )}

        {/* Instant Emergency SOS Trigger Button */}
        <button 
          className="btn btn-emergency pulse-red"
          onClick={() => triggerEmergency('MANUAL_SOS_BUTTON', 'CRITICAL', 'User Pressed SOS Panic Button')}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          id="btn-emergency-sos-top"
        >
          <Zap size={16} /> EMERGENCY SOS
        </button>

        {/* User Profile / Auth Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={openAuthModal}
            className="btn btn-ghost"
            style={{ padding: '8px 12px', borderRadius: '10px' }}
          >
            <UserCheck size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.82rem' }}>{currentUser ? currentUser.role : 'Login'}</span>
          </button>

          {currentUser && (
            <button 
              onClick={currentUser.onLogout}
              className="btn btn-ghost"
              title="Logout to Login Screen"
              style={{ padding: '8px 10px', borderRadius: '10px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <Lock size={14} />
              <span style={{ fontSize: '0.78rem' }}>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
