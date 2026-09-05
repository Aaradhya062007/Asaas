import React, { useState } from 'react';
import { 
  Users, 
  PhoneCall, 
  MessageSquare, 
  Plus, 
  ShieldCheck, 
  Star, 
  X, 
  CheckCircle2, 
  Zap,
  PhoneForwarded
} from 'lucide-react';

export default function EmergencyContactsTab({ contacts, setContacts, telemetry, selectedVehicle }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newContact = {
      id: `c-${Date.now()}`,
      name,
      relation: relation || 'Family Member',
      phone,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      isPrimary,
      autoSms: true,
      autoCall: isPrimary,
      whatsappAlert: true
    };

    if (isPrimary) {
      // Demote other primary contacts
      const updated = contacts.map(c => ({ ...c, isPrimary: false }));
      setContacts([newContact, ...updated]);
    } else {
      setContacts([...contacts, newContact]);
    }

    setShowAddModal(false);
    setName('');
    setRelation('');
    setPhone('');
    setIsPrimary(false);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${telemetry.lat},${telemetry.lng}`;
  const getSmsMessage = (contact) => 
    `🚨 EMERGENCY ALERT for ${contact.name}! Crash detected on ${selectedVehicle.name} (${selectedVehicle.registrationNumber}). Speed: ${telemetry.speedKmh.toFixed(1)} km/h. Location: ${mapsUrl}`;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={26} color="#f59e0b" /> Emergency Contacts & Guardian Roster
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Automated SMS dispatch, voice call hotline, and WhatsApp location broadcasting on crash detection
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
          <Plus size={16} /> Add Emergency Contact
        </button>
      </div>

      {/* Contacts List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {contacts.map(c => (
          <div 
            key={c.id} 
            className="glass-card" 
            style={{ 
              padding: '24px', 
              border: c.isPrimary ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.08)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: c.isPrimary ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.isPrimary ? '#ef4444' : '#f59e0b',
                  fontWeight: 700
                }}>
                  {c.isPrimary ? <Star size={20} /> : <Users size={20} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>{c.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{c.relation}</span>
                </div>
              </div>
              {c.isPrimary && <span className="badge badge-danger">PRIMARY GUARDIAN</span>}
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b', margin: '10px 0' }} className="mono">
              {c.phone}
            </div>

            {/* Notification Toggles Info */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <span>📲 Auto SMS: <strong style={{ color: '#10b981' }}>{c.autoSms ? 'ON' : 'OFF'}</strong></span>
              <span>📞 Auto Voice: <strong style={{ color: c.autoCall ? '#10b981' : '#64748b' }}>{c.autoCall ? 'ON' : 'OFF'}</strong></span>
              <span>💬 WhatsApp: <strong style={{ color: '#10b981' }}>{c.whatsappAlert ? 'ON' : 'OFF'}</strong></span>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={`tel:${c.phone}`} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.78rem' }}>
                <PhoneCall size={14} /> Call
              </a>
              <a 
                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(getSmsMessage(c))}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost" 
                style={{ flex: 1, padding: '8px', fontSize: '0.78rem', borderColor: '#25D366', color: '#25D366' }}
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0 }}>Add Emergency Contact</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Eleanor Vance"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Relationship</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sister / Mother / Friend"
                  value={relation}
                  onChange={e => setRelation(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Phone Number (with country code)</label>
                <input 
                  type="tel" 
                  placeholder="e.g. +91 98123 45678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <input 
                  type="checkbox" 
                  id="primaryCheck"
                  checked={isPrimary}
                  onChange={e => setIsPrimary(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="primaryCheck" style={{ fontSize: '0.82rem', color: '#f8fafc', cursor: 'pointer' }}>Set as Primary Emergency Contact</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
