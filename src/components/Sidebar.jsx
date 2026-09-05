import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Building2,
  BrainCircuit, 
  Car, 
  HeartPulse, 
  Users, 
  History, 
  Cpu, 
  Network,
  ShieldAlert,
  AlertTriangle,
  Zap,
  FileText,
  ClipboardList
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, documentExpiryCount, emergencyActive }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Telemetry', icon: LayoutDashboard, badge: emergencyActive ? 'CRASH' : null, badgeColor: 'danger' },
    { id: 'map', label: 'Accident Map & GPS', icon: MapPin },
    { id: 'hospital-map', label: 'Hospital Alert Map', icon: Building2, badge: 'PERSONAL', badgeColor: 'warning' },
    { id: 'ai-analysis', label: 'AI Crash Analysis', icon: BrainCircuit },
    { id: 'vehicles', label: 'Vehicles & Documents', icon: Car, badge: documentExpiryCount > 0 ? `${documentExpiryCount} Expiring` : null, badgeColor: 'warning' },
    { id: 'medical', label: 'Medical Info & Records', icon: HeartPulse },
    { id: 'contacts', label: 'Emergency Contacts', icon: Users },
    { id: 'history', label: 'Accident Logs & History', icon: History },
    { id: 'architecture', label: 'System Architecture', icon: Network },
    { id: 'api-hub', label: 'ESP32 / Arduino API', icon: Cpu }
  ];

  return (
    <aside style={{
      background: 'rgba(5, 5, 5, 0.95)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ padding: '0 12px 12px 12px', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Navigation Hub
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                color: isActive ? '#f8fafc' : '#94a3b8',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#f59e0b' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge badge-${item.badgeColor}`} style={{ fontSize: '0.65rem' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hardware Node Status Box */}
      <div className="glass-card" style={{ padding: '14px', marginTop: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', marginBottom: '6px' }}>
          <Zap size={14} /> Active Node Status
        </div>
        <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
          MPU6050 Accelerometer: <strong style={{ color: '#10b981' }}>OK</strong><br />
          NEO-6M GPS Lock: <strong style={{ color: '#10b981' }}>3D Fixed</strong><br />
          SIM800L GSM: <strong style={{ color: '#10b981' }}>Connected</strong>
        </p>
      </div>
    </aside>
  );
}
