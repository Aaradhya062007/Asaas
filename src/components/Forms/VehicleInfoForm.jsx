import React, { useState } from 'react';
import { 
  Car, 
  Bike, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Hash, 
  Palette, 
  User, 
  Phone,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';

export default function VehicleInfoForm({ selectedVehicle, setSelectedVehicle, vehicles, setVehicles, onComplete }) {
  const [successMsg, setSuccessMsg] = useState('');

  const [formState, setFormState] = useState({
    name: selectedVehicle ? selectedVehicle.name : 'Hyundai Creta SX (O) Turbo',
    type: selectedVehicle ? selectedVehicle.type : 'four-wheeler',
    registrationNumber: selectedVehicle ? selectedVehicle.registrationNumber : 'DL-01-AB-4321',
    vin: selectedVehicle ? selectedVehicle.vin : 'MALC341C89M203912',
    engineNumber: 'ENG-99201482',
    color: selectedVehicle ? selectedVehicle.color : 'Titan Grey',
    year: '2024',
    espDeviceId: selectedVehicle ? selectedVehicle.espDeviceId : 'ASAAS-001',
    ownerName: 'Alex Mercer',
    ownerPhone: '+91 98111 22233',
    licenseNumber: 'DL-1420180092811',
    insuranceProvider: 'HDFC Ergo Motor Insurance',
    insurancePolicyNumber: 'POL-9928104',
    insuranceExpiry: '2026-09-14',
    rcNumber: 'DL012023004921',
    rcExpiry: '2038-04-11',
    pucNumber: 'PUC-DEL-88210',
    pucExpiry: '2026-11-30'
  });

  const handleChange = (field, val) => {
    setFormState(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedVehicle = {
      id: selectedVehicle ? selectedVehicle.id : `v-${Date.now()}`,
      name: formState.name,
      type: formState.type,
      registrationNumber: formState.registrationNumber,
      vin: formState.vin,
      color: formState.color,
      espDeviceId: formState.espDeviceId,
      firmwareVersion: 'v2.4.1-OTA',
      status: 'online',
      lastSync: 'Just now',
      documents: [
        { id: `d-${Date.now()}-1`, title: 'Registration Certificate (RC)', number: formState.rcNumber, issueDate: '2023-04-12', expiryDate: formState.rcExpiry, status: 'valid', fileUrl: '#' },
        { id: `d-${Date.now()}-2`, title: `Motor Insurance (${formState.insuranceProvider})`, number: formState.insurancePolicyNumber, issueDate: '2025-09-15', expiryDate: formState.insuranceExpiry, status: 'valid', fileUrl: '#' },
        { id: `d-${Date.now()}-3`, title: 'PUC Certificate (Pollution)', number: formState.pucNumber, issueDate: '2026-02-28', expiryDate: formState.pucExpiry, status: 'valid', fileUrl: '#' },
        { id: `d-${Date.now()}-4`, title: 'Driving License (DL)', number: formState.licenseNumber, issueDate: '2018-05-10', expiryDate: '2038-05-09', status: 'valid', fileUrl: '#' }
      ]
    };

    if (setVehicles && vehicles) {
      const exists = vehicles.some(v => v.id === updatedVehicle.id);
      if (exists) {
        setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
      } else {
        setVehicles([...vehicles, updatedVehicle]);
      }
    }

    if (setSelectedVehicle) {
      setSelectedVehicle(updatedVehicle);
    }

    setSuccessMsg(`Vehicle Information for "${updatedVehicle.name}" (${updatedVehicle.registrationNumber}) Saved Successfully!`);
    setTimeout(() => {
      setSuccessMsg('');
      if (onComplete) onComplete();
    }, 2500);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'linear-gradient(135deg, rgba(8, 8, 8, 0.95) 0%, rgba(245, 158, 11, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={26} color="#f59e0b" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
              🚗 VEHICLE PURPOSE INFORMATION & ASAAS HARDWARE FORM
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Complete vehicle specifications, plate registration, insurance vault, and ESP32 hardware pairing details
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.18)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          padding: '14px 20px',
          borderRadius: '14px',
          color: '#34d399',
          fontSize: '0.9rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '28px', background: 'rgba(10, 10, 10, 0.9)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Vehicle Specifications */}
        <div>
          <h3 style={{ fontSize: '1rem', color: '#f59e0b', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Car size={18} /> 1. Vehicle Specifications & Identity
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>VEHICLE NAME & MODEL *</label>
              <input 
                type="text" 
                value={formState.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Hyundai Creta SX (O) Turbo"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>VEHICLE CATEGORY *</label>
              <select 
                value={formState.type}
                onChange={e => handleChange('type', e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              >
                <option value="four-wheeler">Four-Wheeler (Car / SUV / EV)</option>
                <option value="two-wheeler">Two-Wheeler (Motorcycle / Scooter)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>REGISTRATION PLATE NUMBER *</label>
              <input 
                type="text" 
                value={formState.registrationNumber}
                onChange={e => handleChange('registrationNumber', e.target.value)}
                placeholder="e.g. DL-01-AB-4321"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>CHASSIS / VIN NUMBER</label>
              <input 
                type="text" 
                value={formState.vin}
                onChange={e => handleChange('vin', e.target.value)}
                placeholder="e.g. MALC341C89M203912"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>ENGINE NUMBER</label>
              <input 
                type="text" 
                value={formState.engineNumber}
                onChange={e => handleChange('engineNumber', e.target.value)}
                placeholder="e.g. ENG-99201482"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>VEHICLE COLOR & YEAR</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input 
                  type="text" 
                  value={formState.color}
                  onChange={e => handleChange('color', e.target.value)}
                  placeholder="e.g. Titan Grey"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                />
                <input 
                  type="text" 
                  value={formState.year}
                  onChange={e => handleChange('year', e.target.value)}
                  placeholder="2024"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Section 2: Owner & Hardware Device Pairing */}
        <div>
          <h3 style={{ fontSize: '1rem', color: '#10b981', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Cpu size={18} /> 2. Owner Details & ASAAS Hardware Node Pairing
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>REGISTERED OWNER NAME</label>
              <input 
                type="text" 
                value={formState.ownerName}
                onChange={e => handleChange('ownerName', e.target.value)}
                placeholder="e.g. Alex Mercer"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>OWNER CONTACT PHONE</label>
              <input 
                type="text" 
                value={formState.ownerPhone}
                onChange={e => handleChange('ownerPhone', e.target.value)}
                placeholder="e.g. +91 98111 22233"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>ESP32 HARDWARE DEVICE ID *</label>
              <input 
                type="text" 
                value={formState.espDeviceId}
                onChange={e => handleChange('espDeviceId', e.target.value)}
                placeholder="e.g. ASAAS-001"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#f59e0b', fontSize: '0.88rem', fontWeight: 700 }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>DRIVING LICENSE NUMBER</label>
              <input 
                type="text" 
                value={formState.licenseNumber}
                onChange={e => handleChange('licenseNumber', e.target.value)}
                placeholder="e.g. DL-1420180092811"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Section 3: Insurance, RC & PUC Vault */}
        <div>
          <h3 style={{ fontSize: '1rem', color: '#fbbf24', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <FileText size={18} /> 3. Motor Insurance, RC & PUC Legal Vault
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>INSURANCE PROVIDER NAME</label>
              <input 
                type="text" 
                value={formState.insuranceProvider}
                onChange={e => handleChange('insuranceProvider', e.target.value)}
                placeholder="e.g. HDFC Ergo / ICICI Lombard"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>INSURANCE POLICY NUMBER</label>
              <input 
                type="text" 
                value={formState.insurancePolicyNumber}
                onChange={e => handleChange('insurancePolicyNumber', e.target.value)}
                placeholder="e.g. POL-9928104"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>INSURANCE EXPIRY DATE</label>
              <input 
                type="date" 
                value={formState.insuranceExpiry}
                onChange={e => handleChange('insuranceExpiry', e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>RC EXPIRY DATE</label>
              <input 
                type="date" 
                value={formState.rcExpiry}
                onChange={e => handleChange('rcExpiry', e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>PUC CERTIFICATE NUMBER</label>
              <input 
                type="text" 
                value={formState.pucNumber}
                onChange={e => handleChange('pucNumber', e.target.value)}
                placeholder="e.g. PUC-DEL-88210"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>PUC EXPIRY DATE</label>
              <input 
                type="date" 
                value={formState.pucExpiry}
                onChange={e => handleChange('pucExpiry', e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '12px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '0.95rem', fontWeight: 700 }}>
            <Save size={18} /> SAVE VEHICLE INFORMATION & PAIR DEVICE
          </button>
        </div>
      </form>
    </div>
  );
}
