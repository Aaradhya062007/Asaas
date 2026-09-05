import React, { useState } from 'react';
import { 
  Car, 
  Bike, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Download, 
  ShieldCheck, 
  Calendar,
  X,
  PlusCircle,
  Cpu,
  Palette,
  Hash,
  FileCheck
} from 'lucide-react';

export default function VehicleManagerTab({ vehicles, setVehicles, selectedVehicle, setSelectedVehicle }) {
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Extended Vehicle form state
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('four-wheeler');
  const [newRegNo, setNewRegNo] = useState('');
  const [newVin, setNewVin] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newEspDeviceId, setNewEspDeviceId] = useState('');
  const [newInsuranceNo, setNewInsuranceNo] = useState('');
  const [newInsuranceExpiry, setNewInsuranceExpiry] = useState('');
  const [newRcExpiry, setNewRcExpiry] = useState('');

  // New Document form state
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newDocExpiry, setNewDocExpiry] = useState('');

  // Collect all expiring or expired docs across all vehicles
  const allDocuments = vehicles.flatMap(v => 
    v.documents.map(d => ({ ...d, vehicleName: v.name, regNo: v.registrationNumber, vehicleId: v.id }))
  );

  const expiredDocs = allDocuments.filter(d => d.status === 'expired');
  const expiringSoonDocs = allDocuments.filter(d => d.status === 'expiring_soon');

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicleName || !newRegNo) return;

    const deviceId = newEspDeviceId || `ASAAS-00${vehicles.length + 1}`;
    const vinCode = newVin || `VIN-${Math.floor(Math.random()*900000+100000)}`;
    const rcExp = newRcExpiry || '2040-01-01';
    const insExp = newInsuranceExpiry || '2027-01-01';
    const insNo = newInsuranceNo || `POL-${Math.floor(Math.random()*900000)}`;

    const newV = {
      id: `v-${Date.now()}`,
      name: newVehicleName,
      type: newVehicleType,
      registrationNumber: newRegNo,
      vin: vinCode,
      color: newColor || 'Metallic Black',
      espDeviceId: deviceId,
      firmwareVersion: 'v2.4.1-OTA',
      status: 'online',
      lastSync: 'Just now',
      documents: [
        { id: `d-${Date.now()}-1`, title: 'Registration Certificate (RC)', number: newRegNo, issueDate: '2025-01-01', expiryDate: rcExp, status: 'valid', fileUrl: '#' },
        { id: `d-${Date.now()}-2`, title: 'Motor Insurance Policy', number: insNo, issueDate: '2026-01-01', expiryDate: insExp, status: 'valid', fileUrl: '#' }
      ]
    };

    setVehicles([...vehicles, newV]);
    setSelectedVehicle(newV);
    setShowAddVehicleForm(false);
    
    // Reset fields
    setNewVehicleName('');
    setNewRegNo('');
    setNewVin('');
    setNewColor('');
    setNewEspDeviceId('');
    setNewInsuranceNo('');
    setNewInsuranceExpiry('');
    setNewRcExpiry('');

    setSuccessMsg(`Vehicle "${newV.name}" paired with ${deviceId} successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDocTitle || !newDocExpiry) return;

    const today = new Date();
    const exp = new Date(newDocExpiry);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

    let docStatus = 'valid';
    if (diffDays < 0) docStatus = 'expired';
    else if (diffDays <= 30) docStatus = 'expiring_soon';

    const newDoc = {
      id: `d-${Date.now()}`,
      title: newDocTitle,
      number: newDocNumber || 'DOC-9921',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: newDocExpiry,
      status: docStatus,
      daysLeft: diffDays > 0 && diffDays <= 30 ? diffDays : null,
      daysAgo: diffDays < 0 ? Math.abs(diffDays) : null,
      fileUrl: '#'
    };

    const updated = vehicles.map(v => {
      if (v.id === selectedVehicle.id) {
        return { ...v, documents: [...v.documents, newDoc] };
      }
      return v;
    });

    setVehicles(updated);
    const updatedSelected = updated.find(v => v.id === selectedVehicle.id);
    if (updatedSelected) setSelectedVehicle(updatedSelected);

    setShowAddDocModal(false);
    setNewDocTitle('');
    setNewDocNumber('');
    setNewDocExpiry('');

    setSuccessMsg(`Document "${newDocTitle}" added to vault!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Car size={26} color="#f59e0b" /> Vehicle Garage & Hardware Node Vault
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Register new vehicles, pair ESP32 hardware devices, track RC, Insurance & PUC expiry dates
          </p>
        </div>

        <button 
          onClick={() => setShowAddVehicleForm(!showAddVehicleForm)} 
          className={`btn ${showAddVehicleForm ? 'btn-ghost' : 'btn-primary'}`} 
          style={{ fontSize: '0.82rem' }}
        >
          {showAddVehicleForm ? <X size={16} /> : <Plus size={16} />} 
          {showAddVehicleForm ? 'Close Form' : 'Register New Vehicle'}
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '12px 16px',
          borderRadius: '12px',
          color: '#34d399',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {/* COMPREHENSIVE VEHICLE REGISTRATION FORM */}
      {showAddVehicleForm && (
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(10, 10, 10, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={22} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, fontWeight: 700 }}>
                NEW VEHICLE REGISTRATION & ASAAS DEVICE PAIRING FORM
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Fill in your vehicle details to enable IoT telemetry and priority SOS alerts</p>
            </div>
          </div>

          <form onSubmit={handleAddVehicle} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Vehicle Name */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>VEHICLE NAME & MODEL *</label>
              <input 
                type="text" 
                placeholder="e.g. Tata Nexon EV Max / RE Himalayan 450"
                value={newVehicleName}
                onChange={e => setNewVehicleName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                required
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>VEHICLE CATEGORY *</label>
              <select 
                value={newVehicleType} 
                onChange={e => setNewVehicleType(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              >
                <option value="four-wheeler">Four-Wheeler (Car / SUV / EV)</option>
                <option value="two-wheeler">Two-Wheeler (Motorcycle / Scooter)</option>
              </select>
            </div>

            {/* Registration Number */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>REGISTRATION NUMBER (PLATE) *</label>
              <input 
                type="text" 
                placeholder="e.g. DL-01-AB-9921"
                value={newRegNo}
                onChange={e => setNewRegNo(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                required
              />
            </div>

            {/* Chassis / VIN Number */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>CHASSIS / VIN NUMBER</label>
              <input 
                type="text" 
                placeholder="e.g. MALC341C89M992100"
                value={newVin}
                onChange={e => setNewVin(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Vehicle Color */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>VEHICLE COLOR</label>
              <input 
                type="text" 
                placeholder="e.g. Onyx Black / Pearl White"
                value={newColor}
                onChange={e => setNewColor(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* ESP32 Hardware Device ID */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ESP32 DEVICE ID (HARDWARE NODE)</label>
              <input 
                type="text" 
                placeholder="e.g. ASAAS-003"
                value={newEspDeviceId}
                onChange={e => setNewEspDeviceId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Motor Insurance Number */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>MOTOR INSURANCE POLICY NO.</label>
              <input 
                type="text" 
                placeholder="e.g. POL-8899210"
                value={newInsuranceNo}
                onChange={e => setNewInsuranceNo(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Insurance Expiry Date */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>INSURANCE EXPIRY DATE</label>
              <input 
                type="date" 
                value={newInsuranceExpiry}
                onChange={e => setNewInsuranceExpiry(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Submit Button Bar */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowAddVehicleForm(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                <Plus size={16} /> SAVE & PAIR VEHICLE
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DOCUMENT EXPIRY ALERTS RADAR BANNER */}
      {(expiredDocs.length > 0 || expiringSoonDocs.length > 0) && (
        <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(20, 15, 5, 0.85)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24', fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            <AlertTriangle size={22} /> ⏰ Document Expiry Radar Alerts
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {expiredDocs.map(d => (
              <div key={d.id} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#f87171', fontSize: '0.85rem' }}>{d.title}</strong>
                  <span className="badge badge-danger">EXPIRED ({d.daysAgo || 3} days ago)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Vehicle: <strong>{d.vehicleName}</strong> ({d.regNo})
                </div>
              </div>
            ))}

            {expiringSoonDocs.map(d => (
              <div key={d.id} style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#fbbf24', fontSize: '0.85rem' }}>{d.title}</strong>
                  <span className="badge badge-warning">Expires in {d.daysLeft || 12} days</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Vehicle: <strong>{d.vehicleName}</strong> ({d.regNo})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Garage Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {vehicles.map(v => {
          const isSelected = v.id === selectedVehicle.id;
          const Icon = v.type === 'two-wheeler' ? Bike : Car;
          return (
            <div 
              key={v.id} 
              className="glass-card"
              style={{
                padding: '20px',
                border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedVehicle(v)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#f8fafc', margin: 0 }}>{v.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }} className="mono">{v.registrationNumber}</span>
                  </div>
                </div>
                {isSelected ? (
                  <span className="badge badge-info">SELECTED ACTIVE</span>
                ) : (
                  <span className="badge badge-success">ONLINE</span>
                )}
              </div>

              {/* Hardware Pairing Details */}
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', marginBottom: '14px' }}>
                <div>IoT Hardware Node: <strong style={{ color: '#f59e0b' }}>{v.espDeviceId}</strong></div>
                <div>VIN / Chassis: <span className="mono" style={{ color: '#94a3b8' }}>{v.vin}</span></div>
                {v.color && <div>Color: <span style={{ color: '#94a3b8' }}>{v.color}</span></div>}
              </div>

              {/* Document Count Summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>📁 {v.documents.length} Vault Documents</span>
                <button onClick={(e) => { e.stopPropagation(); setSelectedVehicle(v); }} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                  View Vault
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vehicle Document Vault */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#f59e0b" /> Document Vault for {selectedVehicle.name}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              RC, Motor Insurance, PUC, Driving License & Road Tax records
            </p>
          </div>

          <button onClick={() => setShowAddDocModal(true)} className="btn btn-ghost" style={{ fontSize: '0.78rem' }}>
            <PlusCircle size={14} color="#f59e0b" /> Upload Document
          </button>
        </div>

        {/* Documents Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>DOCUMENT NAME</th>
                <th style={{ padding: '12px' }}>POLICY / REG NO.</th>
                <th style={{ padding: '12px' }}>EXPIRY DATE</th>
                <th style={{ padding: '12px' }}>STATUS</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {selectedVehicle.documents.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>
                    {doc.title}
                  </td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }} className="mono">
                    {doc.number}
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>
                    {doc.expiryDate}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {doc.status === 'valid' && <span className="badge badge-success">VALID</span>}
                    {doc.status === 'expiring_soon' && <span className="badge badge-warning">EXPIRING SOON</span>}
                    {doc.status === 'expired' && <span className="badge badge-danger">EXPIRED</span>}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                      <Download size={12} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddDocModal && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0 }}>Add Document for {selectedVehicle.name}</h3>
              <button onClick={() => setShowAddDocModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Document Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Motor Insurance Policy / PUC"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Document / Policy Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. POL-882019"
                  value={newDocNumber}
                  onChange={e => setNewDocNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Expiry Date</label>
                <input 
                  type="date" 
                  value={newDocExpiry}
                  onChange={e => setNewDocExpiry(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddDocModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
