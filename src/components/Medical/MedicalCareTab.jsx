import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldAlert, 
  FileText, 
  Download, 
  CheckCircle2, 
  PhoneCall, 
  AlertCircle, 
  Award,
  Stethoscope,
  UserCheck,
  Zap,
  Printer,
  Plus,
  Pill,
  X,
  FilePlus
} from 'lucide-react';

export default function MedicalCareTab({ medicalProfile, setMedicalProfile }) {
  const [paramedicMode, setParamedicMode] = useState(false);
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDoctor, setMedDoctor] = useState('');
  
  // Vitals & Profile update states
  const [editBloodGroup, setEditBloodGroup] = useState(medicalProfile.bloodGroup);
  const [editAllergies, setEditAllergies] = useState(medicalProfile.allergies ? medicalProfile.allergies.join(', ') : '');
  const [editConditions, setEditConditions] = useState(medicalProfile.medicalConditions ? medicalProfile.medicalConditions.join(', ') : '');
  const [editDoctorName, setEditDoctorName] = useState(medicalProfile.primaryPhysician ? medicalProfile.primaryPhysician.name : '');
  const [editDoctorPhone, setEditDoctorPhone] = useState(medicalProfile.primaryPhysician ? medicalProfile.primaryPhysician.phone : '');

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!medName) return;

    const newMedicationStr = `${medName}${medDosage ? ` (${medDosage})` : ''}${medDoctor ? ` - Prescribed by ${medDoctor}` : ''}`;

    const updatedAllergies = editAllergies ? editAllergies.split(',').map(a => a.trim()).filter(Boolean) : medicalProfile.allergies;
    const updatedConditions = editConditions ? editConditions.split(',').map(c => c.trim()).filter(Boolean) : medicalProfile.medicalConditions;

    if (setMedicalProfile) {
      setMedicalProfile(prev => ({
        ...prev,
        bloodGroup: editBloodGroup || prev.bloodGroup,
        allergies: updatedAllergies,
        medicalConditions: updatedConditions,
        currentMedications: [...(prev.currentMedications || []), newMedicationStr],
        primaryPhysician: {
          ...prev.primaryPhysician,
          name: editDoctorName || prev.primaryPhysician?.name,
          phone: editDoctorPhone || prev.primaryPhysician?.phone
        }
      }));
    }

    setMedName('');
    setMedDosage('');
    setMedDoctor('');
    setShowAddMedForm(false);

    setSuccessMsg(`Medication "${medName}" and health profile updated successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HeartPulse size={26} color="#ef4444" /> Emergency Medical Profile & Prescriptions
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Instant blood group, allergies, medication prescriptions, and paramedic emergency dossier
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowAddMedForm(!showAddMedForm)}
            className={`btn ${showAddMedForm ? 'btn-ghost' : 'btn-primary'}`}
            style={{ fontSize: '0.82rem' }}
          >
            {showAddMedForm ? <X size={16} /> : <Plus size={16} />}
            {showAddMedForm ? 'Close Form' : 'Add Medication & Update Vitals'}
          </button>

          {/* Paramedic Quick View Toggle */}
          <button 
            onClick={() => setParamedicMode(!paramedicMode)}
            className={`btn ${paramedicMode ? 'btn-emergency pulse-red' : 'btn-ghost'}`}
            style={{ fontSize: '0.82rem' }}
          >
            <Stethoscope size={16} /> {paramedicMode ? 'EXIT PARAMEDIC MODE' : 'PARAMEDIC QUICK ACCESS MODE'}
          </button>
        </div>
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

      {/* ADD MEDICATION & HEALTH PROFILE UPDATE FORM */}
      {showAddMedForm && (
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.35)', background: 'rgba(10, 10, 10, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={22} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, fontWeight: 700 }}>
                ADD MEDICATION & UPDATE MEDICAL DOSSIER FORM
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Add prescriptions and update emergency health vitals for paramedic access</p>
            </div>
          </div>

          <form onSubmit={handleAddMedication} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Medication Name */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>MEDICATION / DRUG NAME *</label>
              <input 
                type="text" 
                placeholder="e.g. Paracetamol 500mg / Montelukast / Insulin"
                value={medName}
                onChange={e => setMedName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                required
              />
            </div>

            {/* Dosage & Frequency */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>DOSAGE & FREQUENCY</label>
              <input 
                type="text" 
                placeholder="e.g. 1 Tablet Twice Daily After Meals / SOS"
                value={medDosage}
                onChange={e => setMedDosage(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Prescribing Doctor */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>PRESCRIBING DOCTOR / CLINIC</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Rohan Sharma (Max Healthcare)"
                value={medDoctor}
                onChange={e => setMedDoctor(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Blood Group */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>BLOOD GROUP</label>
              <select 
                value={editBloodGroup} 
                onChange={e => setEditBloodGroup(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              >
                <option value="O+ (Positive)">O+ (Positive)</option>
                <option value="O- (Negative)">O- (Negative)</option>
                <option value="A+ (Positive)">A+ (Positive)</option>
                <option value="A- (Negative)">A- (Negative)</option>
                <option value="B+ (Positive)">B+ (Positive)</option>
                <option value="B- (Negative)">B- (Negative)</option>
                <option value="AB+ (Positive)">AB+ (Positive)</option>
                <option value="AB- (Negative)">AB- (Negative)</option>
              </select>
            </div>

            {/* Severe Allergies */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>SEVERE ALLERGIES (COMMA SEPARATED)</label>
              <input 
                type="text" 
                placeholder="e.g. Penicillin, Peanut Dust, Sulfa"
                value={editAllergies}
                onChange={e => setEditAllergies(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Chronic Medical Conditions */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>CHRONIC MEDICAL CONDITIONS</label>
              <input 
                type="text" 
                placeholder="e.g. Asthma, Hypertension, Diabetes"
                value={editConditions}
                onChange={e => setEditConditions(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Primary Physician Name */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>PRIMARY PHYSICIAN NAME</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Rohan Sharma"
                value={editDoctorName}
                onChange={e => setEditDoctorName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Primary Physician Phone */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>PHYSICIAN EMERGENCY PHONE</label>
              <input 
                type="text" 
                placeholder="e.g. +91 98765 43210"
                value={editDoctorPhone}
                onChange={e => setEditDoctorPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            {/* Submit Button Bar */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowAddMedForm(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                <Plus size={16} /> SAVE MEDICATION & HEALTH VITALS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PARAMEDIC EMERGENCY HIGH CONTRAST CARD BANNER */}
      {paramedicMode && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '2px solid #ef4444',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <ShieldAlert size={26} /> PARAMEDIC QUICK-READ EMERGENCY CARD
            </div>
            <span className="badge badge-danger">108 AMBULANCE PROTOCOL READY</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#000', padding: '16px', borderRadius: '12px', border: '1px solid #ef4444' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>BLOOD GROUP</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ef4444' }} className="mono">
                {medicalProfile.bloodGroup}
              </div>
            </div>

            <div style={{ background: '#000', padding: '16px', borderRadius: '12px', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>SEVERE ALLERGIES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginTop: '6px' }}>
                ⚠️ {medicalProfile.allergies && medicalProfile.allergies.length > 0 ? medicalProfile.allergies.join(', ') : 'None Reported'}
              </div>
            </div>

            <div style={{ background: '#000', padding: '16px', borderRadius: '12px', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>CHRONIC CONDITIONS</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                {medicalProfile.medicalConditions && medicalProfile.medicalConditions.length > 0 ? medicalProfile.medicalConditions.join(', ') : 'None'}
              </div>
            </div>

            <div style={{ background: '#000', padding: '16px', borderRadius: '12px', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>ORGAN DONOR STATUS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
                ✅ REGISTERED DONOR
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {medicalProfile.organDonorId}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Medical Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Patient Identity & Vitals Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} color="#f59e0b" /> Patient Vitals & Bio
            </h3>
            <span className="badge badge-success">VERIFIED MEDICAL ID</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>FULL NAME</span>
              <div style={{ fontWeight: 700, color: '#f8fafc' }}>{medicalProfile.fullName}</div>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>AGE & GENDER</span>
              <div style={{ fontWeight: 700, color: '#f8fafc' }}>{medicalProfile.age} yrs | {medicalProfile.gender}</div>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>BLOOD GROUP</span>
              <div style={{ fontWeight: 700, color: '#ef4444' }} className="mono">{medicalProfile.bloodGroup}</div>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>HEIGHT / WEIGHT</span>
              <div style={{ fontWeight: 600, color: '#cbd5e1' }}>{medicalProfile.heightCm} cm | {medicalProfile.weightKg} kg</div>
            </div>
          </div>
        </div>

        {/* Current Prescriptions & Medications Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pill size={20} color="#ef4444" /> Active Medications & Prescriptions
            </h3>
            <button onClick={() => setShowAddMedForm(true)} className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
              + Add Drug
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {medicalProfile.currentMedications && medicalProfile.currentMedications.length > 0 ? (
              medicalProfile.currentMedications.map((m, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Pill size={16} color="#ef4444" />
                  <span>{m}</span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>No active prescriptions listed. Click "+ Add Drug" above to add.</div>
            )}
          </div>
        </div>

        {/* Primary Physician & Emergency Hospital Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={20} color="#a855f7" /> Primary Physician Contact
            </h3>
            <span className="badge badge-info">PREFERRED HOSPITAL</span>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
            {medicalProfile.primaryPhysician?.name || 'Dr. Rohan Sharma'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#a855f7', marginTop: '2px' }}>
            {medicalProfile.primaryPhysician?.specialty || 'Trauma & Critical Care'} - {medicalProfile.primaryPhysician?.hospital || 'Max Super Speciality Hospital'}
          </div>

          <div style={{ marginTop: '16px' }}>
            <a href={`tel:${medicalProfile.primaryPhysician?.phone}`} className="btn btn-primary" style={{ width: '100%', fontSize: '0.82rem' }}>
              <PhoneCall size={14} /> Call Doctor: {medicalProfile.primaryPhysician?.phone || '+91 98765 43210'}
            </a>
          </div>
        </div>
      </div>

      {/* Health Insurance & Medical Document Archive */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#f59e0b" /> Health Insurance & Medical Document Archive
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              Cashless hospital card, prescriptions, organ donor pass, and ECG reports
            </p>
          </div>

          <button onClick={() => window.print()} className="btn btn-ghost" style={{ fontSize: '0.78rem' }}>
            <Printer size={14} /> Print Medical Dossier
          </button>
        </div>

        {/* Medical Docs List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {medicalProfile.medicalDocuments && medicalProfile.medicalDocuments.map(doc => (
            <div key={doc.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{doc.category}</span>
                <h4 style={{ fontSize: '0.88rem', color: '#f8fafc', margin: '4px 0' }}>{doc.name}</h4>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Updated: {doc.date}</span>
              </div>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                <Download size={12} /> {doc.format}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
