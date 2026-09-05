import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Mail, 
  KeyRound, 
  Car, 
  Bike, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Stethoscope,
  Users,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [activeMode, setActiveMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('Vehicle Owner');
  const [email, setEmail] = useState('alex.mercer@safedrive.io');
  const [password, setPassword] = useState('••••••••');
  
  // Registration form fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regVehicleType, setRegVehicleType] = useState('four-wheeler');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userObj = {
      name: activeMode === 'login' ? 'Alex Mercer' : (regName || 'New User'),
      email,
      role: selectedRole,
      vehicleType: regVehicleType,
      phone: regPhone || '+91 98111 22233'
    };
    onLoginSuccess(userObj);
  };

  const handleQuickDemoLogin = (roleName, demoName, demoEmail) => {
    const demoUser = {
      name: demoName,
      email: demoEmail,
      role: roleName,
      vehicleType: 'four-wheeler'
    };
    onLoginSuccess(demoUser);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#000000',
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.04) 0%, transparent 45%),
        radial-gradient(circle at 85% 80%, rgba(239, 68, 68, 0.04) 0%, transparent 45%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '920px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '36px',
        alignItems: 'center'
      }}>
        {/* Left Side: ASAAS Info & Quick Demo Roles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)'
            }}>
              <ShieldAlert size={30} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                ASAAS <span style={{ color: '#f59e0b', fontSize: '1rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>SYSTEM OS</span>
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Automated System for Accident Alert & Safety
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            IoT-powered smart accident detection system. Monitors collision dynamics and automatically dispatches emergency alerts in priority sequence:
          </p>

          <div style={{
            background: 'rgba(12, 12, 12, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '16px',
            fontSize: '0.84rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> 🏥 1st Priority: Hospital Emergency Alert
            </div>
            <div style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> 👮 2nd Priority: Highway Police Response
            </div>
            <div style={{ color: '#c084fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> 👨‍👩‍👧 3rd Priority: Registered Family Contacts
            </div>
          </div>

          {/* Quick 1-Click Demo Logins */}
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              ⚡ QUICK 1-CLICK DEMO LOGIN:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => handleQuickDemoLogin('Vehicle Owner', 'Alex Mercer (Owner)', 'alex.mercer@safedrive.io')}
                className="btn btn-ghost"
                style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: '0.82rem', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={16} color="#f59e0b" /> Vehicle Owner (Alex Mercer)
                </span>
                <ArrowRight size={14} color="#f59e0b" />
              </button>

              <button 
                onClick={() => handleQuickDemoLogin('Paramedic ER', 'Dr. Rohan Sharma (ER Doctor)', 'dr.rohan@maxhealth.example.com')}
                className="btn btn-ghost"
                style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: '0.82rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Stethoscope size={16} color="#10b981" /> Paramedic / ER Doctor
                </span>
                <ArrowRight size={14} color="#10b981" />
              </button>

              <button 
                onClick={() => handleQuickDemoLogin('Guardian', 'Sarah Mercer (Guardian)', 'sarah.mercer@example.com')}
                className="btn btn-ghost"
                style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: '0.82rem', borderColor: 'rgba(168, 85, 247, 0.3)' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="#c084fc" /> Guardian / Family Contact
                </span>
                <ArrowRight size={14} color="#c084fc" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Simple Clean Login Card */}
        <div className="glass-card" style={{ padding: '30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(10, 10, 10, 0.9)' }}>
          {/* Mode Switcher */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '22px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <button
              type="button"
              onClick={() => setActiveMode('login')}
              style={{
                padding: '9px',
                borderRadius: '7px',
                border: 'none',
                background: activeMode === 'login' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: activeMode === 'login' ? '#000' : '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <LogIn size={15} /> Sign In
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('register')}
              style={{
                padding: '9px',
                borderRadius: '7px',
                border: 'none',
                background: activeMode === 'register' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: activeMode === 'register' ? '#000' : '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <UserPlus size={15} /> Register
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {activeMode === 'register' && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                  required
                />
              </div>
            )}

            {/* Role Selector */}
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>SELECT ACCESS ROLE</label>
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
                        padding: '9px 4px',
                        borderRadius: '8px',
                        border: active ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                        background: active ? 'rgba(245, 158, 11, 0.18)' : 'transparent',
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

            {/* Email Field */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                  required
                />
              </div>
            </div>

            {activeMode === 'register' && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Vehicle Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRegVehicleType('four-wheeler')}
                    className={`btn ${regVehicleType === 'four-wheeler' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.78rem', padding: '8px' }}
                  >
                    <Car size={14} /> Four-Wheeler
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegVehicleType('two-wheeler')}
                    className={`btn ${regVehicleType === 'two-wheeler' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.78rem', padding: '8px' }}
                  >
                    <Bike size={14} /> Two-Wheeler
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px', fontSize: '0.9rem', fontWeight: 700 }}>
              {activeMode === 'login' ? 'SIGN IN TO ASAAS DASHBOARD' : 'REGISTER & PAIR ASAAS DEVICE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
