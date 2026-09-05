import React, { useState, useEffect } from 'react';
import { 
  Siren, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  MapPin, 
  Heart, 
  Clock, 
  Navigation,
  Lock,
  Building2,
  Volume2,
  Square,
  AlertTriangle,
  Flame,
  Radio,
  ShieldAlert,
  Octagon
} from 'lucide-react';
import { sirenSound } from '../../services/telemetryEngine';
import { nearbyResponders } from '../../services/mockData';

export default function EmergencySosModal({ 
  isOpen, 
  onClose, 
  selectedVehicle, 
  telemetry, 
  emergencyData, 
  medicalProfile, 
  emergencyContacts 
}) {
  // Step progression: 0: Accident & Relay Horn -> 1: GPS Locked -> 2: Hospital (1st) -> 3: Police (2nd) -> 4: Family (3rd) -> 5: Complete
  const [step, setStep] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [timeline, setTimeline] = useState([]);

  const getCurrentTimeStr = () => new Date().toLocaleTimeString();

  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    sirenSound.startSiren();
    setStep(0);
    setIsStopped(false);

    const initialTime = getCurrentTimeStr();
    setTimeline([
      { time: initialTime, text: '💥 Collision Sensor Impact Detected (> 4.0g)', icon: '💥', done: true },
      { time: initialTime, text: '🔊 Relay Module Horn Activated (Local Warning)', icon: '🔊', done: true }
    ]);

    // Timer sequence: Priority Hospital (1st) -> Police (2nd) -> Family (3rd)
    const t1 = setTimeout(() => {
      setStep(1);
      setTimeline(prev => [...prev, { time: getCurrentTimeStr(), text: '📍 GPS Location Obtained (NEO-6M)', icon: '📍', done: true }]);
    }, 2000);

    const t2 = setTimeout(() => {
      setStep(2);
      setTimeline(prev => [...prev, { time: getCurrentTimeStr(), text: '🏥 Hospital Alert Sent (1st Priority)', icon: '🏥', done: true }]);
    }, 4500);

    const t3 = setTimeout(() => {
      setStep(3);
      setTimeline(prev => [...prev, { time: getCurrentTimeStr(), text: '👮 Police Alert Sent (2nd Priority)', icon: '👮', done: true }]);
    }, 7500);

    const t4 = setTimeout(() => {
      setStep(4);
      setTimeline(prev => [...prev, { time: getCurrentTimeStr(), text: '👨‍👩‍👧 Family Alert Sent (3rd Priority)', icon: '👨‍👩‍👧', done: true }]);
    }, 10500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      sirenSound.stopSiren();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // STOP BUTTON CIRCUIT BREAKER ACTION
  const handleStopButton = () => {
    sirenSound.stopSiren();
    setIsStopped(true);
    setTimeline(prev => [
      ...prev,
      { time: getCurrentTimeStr(), text: '🛑 HARDWARE STOP BUTTON PRESSED - Circuit Interrupted & Device Halted', icon: '🛑', done: true }
    ]);
  };

  const primaryContact = emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0];
  const nearestHospital = nearbyResponders[0];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${telemetry.lat},${telemetry.lng}`;
  const smsBody = `🚨 ASAAS ACCIDENT ALERT! Vehicle ${selectedVehicle.espDeviceId} (${selectedVehicle.registrationNumber}) accident detected at ${telemetry.lat.toFixed(4)},${telemetry.lng.toFixed(4)}. Map: ${mapsUrl}`;

  return (
    <div className="modal-overlay">
      <div className="glass-card glass-card-emergency" style={{
        width: '100%',
        maxWidth: '720px',
        padding: '28px',
        borderRadius: '24px',
        color: '#fff',
        position: 'relative',
        boxShadow: '0 0 60px rgba(239, 68, 68, 0.45)'
      }}>
        {/* Header Alert Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={isStopped ? '' : 'pulse-red'} style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: isStopped ? '#64748b' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Siren size={26} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isStopped ? '🛑 ASAAS DEVICE CIRCUIT INTERRUPTED' : '🚨 ASAAS ACCIDENT EMERGENCY ALERT'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#fca5a5', margin: 0 }}>
                Device ID: <strong className="mono">{selectedVehicle.espDeviceId}</strong> | Priority Sequence: Hospital &rarr; Police &rarr; Family
              </p>
            </div>
          </div>

          <button 
            onClick={() => { sirenSound.stopSiren(); onClose(); }}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* STOP BUTTON CIRCUIT BREAKER CONTROL BAR */}
        <div style={{
          background: isStopped ? 'rgba(100, 116, 139, 0.2)' : 'rgba(239, 68, 68, 0.25)',
          border: isStopped ? '1px solid #64748b' : '2px solid #ef4444',
          borderRadius: '16px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Volume2 size={20} color={isStopped ? '#94a3b8' : '#ef4444'} className={isStopped ? '' : 'live-dot alert'} />
            <div>
              <strong style={{ color: isStopped ? '#cbd5e1' : '#f87171', fontSize: '0.88rem' }}>
                {isStopped ? 'RELAY HORN & ALARM DEACTIVATED' : 'RELAY HORN ACTIVE (Local Warning sound sounding)'}
              </strong>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {isStopped ? 'System paused by manual stop button' : 'Press Stop Button to break circuit & cancel alert sequence'}
              </div>
            </div>
          </div>

          {!isStopped ? (
            <button 
              onClick={handleStopButton}
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                color: '#fff',
                border: '1px solid #ef4444',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.85rem',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
              }}
            >
              <Octagon size={18} color="#fff" /> 🛑 HARDWARE STOP BUTTON (INTERRUPT CIRCUIT)
            </button>
          ) : (
            <span className="badge badge-warning" style={{ padding: '6px 12px' }}>
              CIRCUIT INTERRUPTED BY USER
            </span>
          )}
        </div>

        {/* 3-PRIORITY SEQUENTIAL STATUS CARDS (Hospital 1st -> Police 2nd -> Family 3rd) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {/* 1st Priority: Hospital */}
          <div style={{
            background: step >= 2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: step >= 2 ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '14px',
            borderRadius: '14px',
            transition: 'all 0.4s ease'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Building2 size={14} color="#34d399" /> 1ST PRIORITY - HOSPITAL
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: step >= 2 ? '#34d399' : '#94a3b8' }}>
              {step >= 2 ? '✓ ALERT SENT' : 'Pending (Stage 3)'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px' }}>
              {nearestHospital.name} ({nearestHospital.eta} ETA)
            </div>
          </div>

          {/* 2nd Priority: Police */}
          <div style={{
            background: step >= 3 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: step >= 3 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '14px',
            borderRadius: '14px',
            transition: 'all 0.4s ease'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <ShieldAlert size={14} color="#f59e0b" /> 2ND PRIORITY - POLICE
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: step >= 3 ? '#f59e0b' : '#94a3b8' }}>
              {step >= 3 ? '✓ ALERT DELIVERED' : 'Pending (Stage 4)'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px' }}>
              NH-48 Highway Police Response #04
            </div>
          </div>

          {/* 3rd Priority: Family */}
          <div style={{
            background: step >= 4 ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: step >= 4 ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '14px',
            borderRadius: '14px',
            transition: 'all 0.4s ease'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Heart size={14} color="#c084fc" /> 3RD PRIORITY - FAMILY
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: step >= 4 ? '#c084fc' : '#94a3b8' }}>
              {step >= 4 ? '✓ 3 CONTACTS ALERTED' : 'Pending (Stage 5)'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px' }}>
              {primaryContact.name} ({primaryContact.relation})
            </div>
          </div>
        </div>

        {/* LIVE EMERGENCY TIMELINE TRACKER */}
        <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> Live Emergency Response Timeline
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {timeline.map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                <span className="mono" style={{ color: '#64748b', fontSize: '0.72rem' }}>{ev.time}</span>
                <span>{ev.icon}</span>
                <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{ev.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transmitted Medical Vitals Card */}
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Heart size={16} />
          <span>
            <strong>Transmitted Medical Profile:</strong> Blood Group: <strong>{medicalProfile.bloodGroup}</strong> | Severe Allergies: <strong>{medicalProfile.allergies.join(', ')}</strong>
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <a 
            href={`https://wa.me/${primaryContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(smsBody)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '0.82rem', borderColor: '#25D366', color: '#25D366' }}
          >
            <MessageSquare size={14} /> Open WhatsApp SOS Payload
          </a>
          <button onClick={onClose} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
            {isStopped ? 'Close' : 'Keep Monitoring Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
