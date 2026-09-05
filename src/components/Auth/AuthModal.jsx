import React, { useState } from 'react';
import { 
  UserCheck, 
  Lock, 
  Mail, 
  X, 
  ShieldCheck, 
  Stethoscope, 
  Users, 
  KeyRound
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, currentUser, setCurrentUser }) {
  const [email, setEmail] = useState('alex.mercer@safedrive.io');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState(currentUser ? currentUser.role : 'Vehicle Owner');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setCurrentUser({
      name: 'Alex Mercer',
      email,
      role: selectedRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '28px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', margin: 0 }}>SafeDrive User Authentication</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={22} /></button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Role Selection Tabs */}
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>SELECT ACCESS ROLE</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'Vehicle Owner', icon: ShieldCheck },
                { id: 'Paramedic ER', icon: Stethoscope },
                { id: 'Guardian', icon: Users }
              ].map(r => {
                const Icon = r.icon;
                const active = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '10px',
                      border: active ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                      background: active ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                      color: active ? '#f59e0b' : '#94a3b8',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Icon size={16} /> {r.id}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
            Login to SafeDrive IoT OS
          </button>
        </form>
      </div>
    </div>
  );
}
