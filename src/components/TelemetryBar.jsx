import React from 'react';
import { 
  Battery, 
  Signal, 
  Compass, 
  Activity, 
  Radio, 
  ShieldCheck, 
  AlertCircle,
  Clock
} from 'lucide-react';

export default function TelemetryBar({ telemetry }) {
  return (
    <div style={{
      background: 'rgba(8, 8, 8, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '8px 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      alignItems: 'center',
      fontSize: '0.78rem'
    }}>
      {/* Battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Battery size={16} color="#f59e0b" />
        <div>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>BATTERY</span>
          <div style={{ fontWeight: 700, color: '#f8fafc' }}>
            {telemetry.batteryPercent}% <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({telemetry.batteryVoltage})</span>
          </div>
        </div>
      </div>

      {/* GPS Location Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass size={16} color="#a855f7" />
        <div>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>GPS FIX (NEO-6M)</span>
          <div style={{ fontWeight: 700, color: '#f8fafc' }}>
            {telemetry.gpsSatellites} Sats <span style={{ fontSize: '0.7rem', color: '#64748b' }}>HDOP {telemetry.gpsHdop}</span>
          </div>
        </div>
      </div>

      {/* GSM Signal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Signal size={16} color="#10b981" />
        <div>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>GSM SIGNAL (SIM800L)</span>
          <div style={{ fontWeight: 700, color: '#f8fafc' }}>
            {telemetry.gsmSignalDbm} dBm <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({telemetry.gsmCarrier})</span>
          </div>
        </div>
      </div>

      {/* MPU6050 Accelerometer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity size={16} color="#f59e0b" />
        <div>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>MPU6050 ACCEL</span>
          <div style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} /> {telemetry.mpuSensorStatus}
          </div>
        </div>
      </div>

      {/* Physical Hardware SOS Switch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Radio size={16} color="#ef4444" />
        <div>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>HW SOS SWITCH</span>
          <div style={{ fontWeight: 700, color: telemetry.sosPhysicalButton === 'PRESSED' ? '#ef4444' : '#94a3b8' }}>
            {telemetry.sosPhysicalButton}
          </div>
        </div>
      </div>

      {/* Last Heartbeat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={16} color="#64748b" />
        <div>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>TELEMETRY PING</span>
          <div style={{ fontWeight: 600, color: '#94a3b8' }} className="mono">
            {telemetry.lastUpdateTimestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
