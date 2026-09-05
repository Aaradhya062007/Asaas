import React, { useState } from 'react';
import { 
  Gauge, 
  Activity, 
  Compass, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  Car, 
  Bike, 
  MapPin, 
  PhoneCall, 
  Flame, 
  RotateCw,
  Sliders,
  Radio,
  FileSpreadsheet,
  Building2,
  ShieldAlert,
  Heart,
  HeartPulse,
  Octagon,
  Clock,
  CheckCircle2,
  PlusCircle,
  Pill,
  X,
  Plus,
  FileText,
  ClipboardList,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import VehicleInfoForm from '../Forms/VehicleInfoForm';
import MedicalInfoForm from '../Forms/MedicalInfoForm';

export default function DashboardTab({ 
  selectedVehicle, 
  setSelectedVehicle,
  vehicles,
  setVehicles,
  medicalProfile,
  setMedicalProfile,
  telemetry, 
  updateTelemetry, 
  triggerEmergency, 
  setActiveTab 
}) {
  const [selectedFormMode, setSelectedFormMode] = useState('none'); // 'vehicle' | 'medical' | 'both' | 'none'

  // Preset Telemetry Simulation Triggers
  const triggerNormalDriving = () => {
    updateTelemetry({
      speedKmh: 45.2,
      accelX: 0.05,
      accelY: 0.08,
      accelZ: 0.98,
      totalGForce: 0.99,
      pitchDeg: 1.2,
      rollDeg: 0.8,
      isEmergencyAlert: false,
      alertSeverity: 'NONE',
      alertReason: '',
      relayHornActive: false,
      stopButtonPressed: false
    });
  };

  const triggerHardBraking = () => {
    updateTelemetry({
      speedKmh: 12.0,
      accelX: -1.85,
      accelY: 0.12,
      accelZ: 1.02,
      totalGForce: 2.11,
      pitchDeg: -8.4,
      rollDeg: 1.1,
      isEmergencyAlert: false,
      alertSeverity: 'WARNING',
      alertReason: 'Hard Sudden Braking Event (2.11g)'
    });
  };

  const triggerSideCollision = () => {
    updateTelemetry({
      speedKmh: 0,
      accelX: 5.42,
      accelY: 2.10,
      accelZ: 1.45,
      totalGForce: 5.99,
      pitchDeg: 14.2,
      rollDeg: 42.8,
      isEmergencyAlert: true,
      alertSeverity: 'CRITICAL',
      alertReason: 'HIGH IMPACT COLLISION DETECTED (5.99g X-AXIS IMPULSE)',
      relayHornActive: true
    });
    triggerEmergency('IMPACT_ACCELEROMETER', 'CRITICAL', 'High Impact Collision Detected (5.99g)');
  };

  const triggerRolloverCrash = () => {
    updateTelemetry({
      speedKmh: 0,
      accelX: 1.20,
      accelY: 4.85,
      accelZ: 2.90,
      totalGForce: 5.77,
      pitchDeg: 38.5,
      rollDeg: 88.4,
      isEmergencyAlert: true,
      alertSeverity: 'CRITICAL',
      alertReason: 'VEHICLE ROLLOVER DETECTED (GYRO ROLL > 85°)',
      relayHornActive: true
    });
    triggerEmergency('GYROSCOPE_ROLLOVER', 'CRITICAL', 'Vehicle Rollover Detected (88.4° Roll Angle)');
  };

  // Determine G-force status color
  const getGForceColor = (g) => {
    if (g >= 4.0) return '#ef4444';
    if (g >= 2.0) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* OFFICIAL ASAAS DEVICE STATUS MONITORING BANNER */}
      {!telemetry.isEmergencyAlert ? (
        <div className="glass-card" style={{
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: 'linear-gradient(135deg, rgba(8, 8, 8, 0.95) 0%, rgba(16, 185, 129, 0.08) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="live-dot" />
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, fontWeight: 800 }}>
                ASAAS DEVICE MONITORING ({selectedVehicle.espDeviceId})
              </h3>
            </div>
            <span className="badge badge-success">NORMAL CONDITION - VEHICLE RUNNING</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '0.82rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>SYSTEM CORE</span>
              <div style={{ color: '#34d399', fontWeight: 700 }}>ONLINE ✓</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>GPS MODULE</span>
              <div style={{ color: '#34d399', fontWeight: 700 }}>ACTIVE ✓ ({telemetry.gpsSatellites} Sats)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>COLLISION SENSORS</span>
              <div style={{ color: '#34d399', fontWeight: 700 }}>ACTIVE ✓ (MPU6050)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>COMMUNICATION</span>
              <div style={{ color: '#34d399', fontWeight: 700 }}>ACTIVE ✓ (GSM/SIM800L)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>VEHICLE STATE</span>
              <div style={{ color: '#f59e0b', fontWeight: 700 }}>RUNNING ({telemetry.speedKmh.toFixed(0)} km/h)</div>
            </div>
          </div>
        </div>
      ) : (
        /* ACCIDENT STATE BANNER */
        <div className="glass-card glass-card-emergency" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="pulse-red" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                💥
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 900, textTransform: 'uppercase' }}>
                🚨 ACCIDENT DETECTED - PRIORITY ALERT PIPELINE ACTIVE
              </h3>
            </div>
            <button onClick={triggerNormalDriving} className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>
              Reset System Normal
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#fca5a5', marginBottom: '16px' }}>
            {telemetry.alertReason}
          </p>

          {/* Sequential Dispatch Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.82rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px', border: '1px solid #10b981' }}>
              <div style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={14} /> 🏥 HOSPITAL (1ST)
              </div>
              <div style={{ color: '#fff', fontWeight: 800, marginTop: '4px' }}>✓ ALERT SENT</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px', border: '1px solid #f59e0b' }}>
              <div style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={14} /> 👮 POLICE (2ND)
              </div>
              <div style={{ color: '#fff', fontWeight: 800, marginTop: '4px' }}>✓ ALERT DELIVERED</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px', border: '1px solid #a855f7' }}>
              <div style={{ color: '#c084fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={14} /> 👨‍👩‍👧 FAMILY (3RD)
              </div>
              <div style={{ color: '#fff', fontWeight: 800, marginTop: '4px' }}>✓ 3 CONTACTS ALERTED</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Telemetry Gauges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Speedometer Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Gauge size={16} color="#f59e0b" /> VEHICLE SPEED</span>
            <span className="badge badge-info">LIVE OBD/GPS</span>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f8fafc', lineHeight: 1 }}>
              {telemetry.speedKmh.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600, marginTop: '4px' }}>KM / H</div>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginTop: '12px' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (telemetry.speedKmh / 140) * 100)}%`, background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* G-Force Acceleration Impact Gauge */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} color={getGForceColor(telemetry.totalGForce)} /> G-FORCE IMPACT (MPU6050)</span>
            <span className={`badge badge-${telemetry.totalGForce > 4 ? 'danger' : telemetry.totalGForce > 2 ? 'warning' : 'success'}`}>
              {telemetry.totalGForce > 4 ? 'CRASH LEVEL' : telemetry.totalGForce > 2 ? 'HARD BRAKE' : 'NORMAL'}
            </span>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: getGForceColor(telemetry.totalGForce), lineHeight: 1 }}>
              {telemetry.totalGForce.toFixed(2)}<span style={{ fontSize: '1.4rem' }}>g</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
              X: {telemetry.accelX.toFixed(2)}g | Y: {telemetry.accelY.toFixed(2)}g | Z: {telemetry.accelZ.toFixed(2)}g
            </div>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginTop: '12px' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (telemetry.totalGForce / 6) * 100)}%`, background: getGForceColor(telemetry.totalGForce), transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Vehicle Tilt (Pitch & Roll) */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><RotateCw size={16} color="#a855f7" /> VEHICLE TILT (GYROSCOPE)</span>
            <span className="badge badge-info">ANGLE SENSOR</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center', padding: '8px 0' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PITCH (NOSE UP/DOWN)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: Math.abs(telemetry.pitchDeg) > 30 ? '#ef4444' : '#f8fafc' }}>
                {telemetry.pitchDeg.toFixed(1)}°
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ROLL (SIDE TILT)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: Math.abs(telemetry.rollDeg) > 45 ? '#ef4444' : '#f8fafc' }}>
                {telemetry.rollDeg.toFixed(1)}°
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: Math.abs(telemetry.rollDeg) > 60 ? '#ef4444' : '#94a3b8', textAlign: 'center', marginTop: '6px' }}>
            {Math.abs(telemetry.rollDeg) > 60 ? '🚨 ROLLOVER THRESHOLD EXCEEDED' : 'Orientation within safe envelope'}
          </div>
        </div>

        {/* GPS Coordinates Quick Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="#10b981" /> GPS LIVE LOCATION</span>
            <button onClick={() => setActiveTab('map')} className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>View Map</button>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600, marginBottom: '6px' }}>
            NH-48 Expressway, KM 34
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            LAT: {telemetry.lat.toFixed(5)} N<br />
            LNG: {telemetry.lng.toFixed(5)} E
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} /> 3D Sat-Lock ({telemetry.gpsSatellites} Satellites)
          </div>
        </div>
      </div>

      {/* DASHBOARD DIRECT DATA ENTRY FORMS SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={22} color="#f59e0b" /> User Information Forms (Dashboard Direct Entry)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              Select a form from the dropdown to fill vehicle specifications or emergency medical dossier
            </p>
          </div>

          {/* Form Selector Dropdown Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(12, 12, 12, 0.95)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '8px 14px',
              gap: '10px',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)',
              backdropFilter: 'blur(12px)'
            }}>
              <Sliders size={18} color="#f59e0b" />
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Select Form:</span>
              <select
                value={selectedFormMode}
                onChange={(e) => setSelectedFormMode(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: selectedFormMode === 'vehicle' ? '#f59e0b' : selectedFormMode === 'medical' ? '#f87171' : selectedFormMode === 'both' ? '#c084fc' : '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  paddingRight: '8px'
                }}
              >
                <option value="vehicle" style={{ background: '#0a0a0a', color: '#f59e0b' }}>🚗 Vehicle Purpose Form</option>
                <option value="medical" style={{ background: '#0a0a0a', color: '#f87171' }}>🏥 Medical Purpose Form</option>
                <option value="both" style={{ background: '#0a0a0a', color: '#c084fc' }}>📋 Show Both Forms (Side-by-Side)</option>
                <option value="none" style={{ background: '#0a0a0a', color: '#94a3b8' }}>🙈 Hide / Collapse All Forms</option>
              </select>
              <ChevronDown size={16} color="#94a3b8" />
            </div>
          </div>
        </div>

        {/* Render Form 1: Vehicle Purpose Information Form */}
        {(selectedFormMode === 'vehicle' || selectedFormMode === 'both') && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <VehicleInfoForm 
              selectedVehicle={selectedVehicle}
              setSelectedVehicle={setSelectedVehicle}
              vehicles={vehicles}
              setVehicles={setVehicles}
              onComplete={() => setSelectedFormMode('none')}
            />
          </div>
        )}

        {/* Render Form 2: Medical Purpose Information Form */}
        {(selectedFormMode === 'medical' || selectedFormMode === 'both') && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <MedicalInfoForm 
              medicalProfile={medicalProfile}
              setMedicalProfile={setMedicalProfile}
              onComplete={() => setSelectedFormMode('none')}
            />
          </div>
        )}

        {/* Render Collapsed Quick Access Cards when 'none' is selected */}
        {selectedFormMode === 'none' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Vehicle Form Choice Card */}
            <div className="glass-card" style={{ padding: '22px', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'linear-gradient(135deg, rgba(12, 12, 12, 0.95) 0%, rgba(245, 158, 11, 0.05) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={22} color="#f59e0b" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0, fontWeight: 700 }}>🚗 Vehicle Purpose Information Form</h4>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Register Specs, Plate No, VIN & ESP32 Node</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
                Complete vehicle details form including registration plate number, chassis VIN, insurance policy, and IoT hardware device pairing.
              </p>
              <button onClick={() => setSelectedFormMode('vehicle')} className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700 }}>
                <Plus size={16} /> OPEN VEHICLE FORM FROM DROPDOWN
              </button>
            </div>

            {/* Medical Form Choice Card */}
            <div className="glass-card" style={{ padding: '22px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'linear-gradient(135deg, rgba(12, 12, 12, 0.95) 0%, rgba(239, 68, 68, 0.05) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HeartPulse size={22} color="#ef4444" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0, fontWeight: 700 }}>🏥 Medical Purpose Information Form</h4>
                  <span style={{ fontSize: '0.75rem', color: '#f87171' }}>Blood Passport, Allergies, Prescriptions & ER Doctor</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
                Emergency medical dossier form including blood group, drug allergies, active prescriptions, and physician contact for 108 paramedics.
              </p>
              <button onClick={() => setSelectedFormMode('medical')} className="btn btn-emergency" style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700 }}>
                <Plus size={16} /> OPEN MEDICAL FORM FROM DROPDOWN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simulator Control Deck */}
      <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={20} color="#f59e0b" /> Live ASAAS Collision Simulator
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              Simulate collision events to test the priority sequence: Relay Horn &rarr; Hospital (1st) &rarr; Police (2nd) &rarr; Family (3rd)
            </p>
          </div>
          <span className="badge badge-info"><Radio size={12} /> Hardware Test Deck</span>
        </div>

        {/* Simulator Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <button onClick={triggerNormalDriving} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '12px' }}>
            <Car size={18} color="#10b981" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Normal Cruising</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>50 km/h | 0.99g | 0° Tilt</div>
            </div>
          </button>

          <button onClick={triggerHardBraking} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '12px' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hard Braking Event</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>2.11g Deceleration</div>
            </div>
          </button>

          <button onClick={triggerSideCollision} className="btn btn-outline-danger" style={{ justifyContent: 'flex-start', padding: '12px' }}>
            <Zap size={18} color="#ef4444" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Severe Side Impact</div>
              <div style={{ fontSize: '0.7rem', color: '#f87171' }}>5.99g Crash &rarr; Trigger Priority Sequence</div>
            </div>
          </button>

          <button onClick={triggerRolloverCrash} className="btn btn-outline-danger" style={{ justifyContent: 'flex-start', padding: '12px' }}>
            <RotateCw size={18} color="#ef4444" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Vehicle Rollover Crash</div>
              <div style={{ fontSize: '0.7rem', color: '#f87171' }}>88° Gyro Roll &rarr; Trigger Priority Sequence</div>
            </div>
          </button>
        </div>
      </div>

      {/* Direct Shortcuts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#ef4444" /> Manual Emergency SOS Protocol
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Manually trigger priority sequence: Relay Horn &rarr; Hospital 1st &rarr; Police 2nd &rarr; Family 3rd.
          </p>
          <button onClick={() => triggerEmergency('MANUAL_PANIC', 'CRITICAL', 'Manual Emergency SOS Activated')} className="btn btn-emergency" style={{ width: '100%' }}>
            <PhoneCall size={16} /> TRIGGER SEQUENTIAL SOS ALERT
          </button>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={18} color="#f59e0b" /> AI Crash Analysis & Reports
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Generate 3D impact vector diagrams, g-force impulse curves, and structural damage risk reports for insurance & medical teams.
          </p>
          <button onClick={() => setActiveTab('ai-analysis')} className="btn btn-primary" style={{ width: '100%' }}>
            Open AI Crash Analysis Engine
          </button>
        </div>
      </div>
    </div>
  );
}
