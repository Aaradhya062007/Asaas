import React, { useState } from 'react';
import { 
  HeartPulse, 
  UserCheck, 
  Stethoscope, 
  Pill, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Save, 
  PhoneCall, 
  Heart,
  Plus,
  X,
  Building2
} from 'lucide-react';

export default function MedicalInfoForm({ medicalProfile, setMedicalProfile, onComplete }) {
  const [successMsg, setSuccessMsg] = useState('');

  const [formState, setFormState] = useState({
    fullName: medicalProfile ? medicalProfile.fullName : 'Alex Mercer',
    age: medicalProfile ? medicalProfile.age : 32,
    gender: medicalProfile ? medicalProfile.gender : 'Male',
    bloodGroup: medicalProfile ? medicalProfile.bloodGroup : 'O+ (Positive)',
    heightCm: medicalProfile ? medicalProfile.heightCm : 178,
    weightKg: medicalProfile ? medicalProfile.weightKg : 74,
    allergies: medicalProfile && medicalProfile.allergies ? medicalProfile.allergies.join(', ') : 'Penicillin, Peanut Dust',
    medicalConditions: medicalProfile && medicalProfile.medicalConditions ? medicalProfile.medicalConditions.join(', ') : 'Mild Exercise-Induced Asthma',
    medName1: 'Montelukast 10mg',
    medDosage1: '1 Tablet Daily At Bedtime',
    medDoctor1: 'Dr. Rohan Sharma (Max Healthcare)',
    medName2: 'Inhaler (SOS)',
    medDosage2: 'As Needed During Emergency',
    medDoctor2: 'Max Emergency Care',
    organDonor: medicalProfile ? medicalProfile.organDonor : true,
    organDonorId: medicalProfile ? medicalProfile.organDonorId : 'OD-IN-99218-DEL',
    insuranceProvider: medicalProfile ? medicalProfile.insuranceProvider : 'Star Health Comprehensive Gold',
    insurancePolicyNumber: medicalProfile ? medicalProfile.insurancePolicyNumber : 'SH-88492019-X',
    insuranceExpiry: medicalProfile ? medicalProfile.insuranceExpiry : '2027-03-31',
    doctorName: medicalProfile && medicalProfile.primaryPhysician ? medicalProfile.primaryPhysician.name : 'Dr. Rohan Sharma',
    doctorSpecialty: medicalProfile && medicalProfile.primaryPhysician ? medicalProfile.primaryPhysician.specialty : 'Trauma & Critical Care',
    doctorHospital: medicalProfile && medicalProfile.primaryPhysician ? medicalProfile.primaryPhysician.hospital : 'Max Super Speciality Hospital',
    doctorPhone: medicalProfile && medicalProfile.primaryPhysician ? medicalProfile.primaryPhysician.phone : '+91 98765 43210'
  });

  const handleChange = (field, val) => {
    setFormState(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allergiesArr = formState.allergies ? formState.allergies.split(',').map(s => s.trim()).filter(Boolean) : [];
    const conditionsArr = formState.medicalConditions ? formState.medicalConditions.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    const medsList = [];
    if (formState.medName1) medsList.push(`${formState.medName1}${formState.medDosage1 ? ` (${formState.medDosage1})` : ''}`);
    if (formState.medName2) medsList.push(`${formState.medName2}${formState.medDosage2 ? ` (${formState.medDosage2})` : ''}`);

    const updatedProfile = {
      fullName: formState.fullName,
      age: parseInt(formState.age) || 30,
      gender: formState.gender,
      bloodGroup: formState.bloodGroup,
      heightCm: parseInt(formState.heightCm) || 175,
      weightKg: parseInt(formState.weightKg) || 70,
      allergies: allergiesArr,
      medicalConditions: conditionsArr,
      currentMedications: medsList.length > 0 ? medsList : ['No Active Medications'],
      organDonor: formState.organDonor,
      organDonorId: formState.organDonorId,
      insuranceProvider: formState.insuranceProvider,
      insurancePolicyNumber: formState.insurancePolicyNumber,
      insuranceExpiry: formState.insuranceExpiry,
      primaryPhysician: {
        name: formState.doctorName,
        specialty: formState.doctorSpecialty,
        hospital: formState.doctorHospital,
        phone: formState.doctorPhone
      },
      medicalDocuments: (medicalProfile && medicalProfile.medicalDocuments) ? medicalProfile.medicalDocuments : []
    };

    if (setMedicalProfile) {
      setMedicalProfile(updatedProfile);
    }

    setSuccessMsg(`Emergency Medical Purpose Information for "${updatedProfile.fullName}" Saved Successfully!`);
    setTimeout(() => {
      setSuccessMsg('');
      if (onComplete) onComplete();
    }, 2500);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.35)', background: 'linear-gradient(135deg, rgba(8, 8, 8, 0.95) 0%, rgba(239, 68, 68, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartPulse size={26} color="#ef4444" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
              🏥 MEDICAL PURPOSE INFORMATION & EMERGENCY DOSSIER FORM
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Record blood group, severe allergies, active prescriptions, doctor contacts, and health insurance for 108 ambulance response
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
        {/* Section 1: Personal Vitals & Blood Passport */}
        <div>
          <h3 style={{ fontSize: '1rem', color: '#ef4444', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <UserCheck size={18} /> 1. Patient Personal Bio & Emergency Vitals
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>FULL NAME *</label>
              <input 
                type="text" 
                value={formState.fullName}
                onChange={e => handleChange('fullName', e.target.value)}
                placeholder="e.g. Alex Mercer"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>BLOOD GROUP *</label>
              <select 
                value={formState.bloodGroup}
                onChange={e => handleChange('bloodGroup', e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', fontSize: '0.88rem', fontWeight: 800 }}
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

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>AGE & GENDER</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input 
                  type="number" 
                  value={formState.age}
                  onChange={e => handleChange('age', e.target.value)}
                  placeholder="32"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                />
                <select 
                  value={formState.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>HEIGHT (CM) & WEIGHT (KG)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input 
                  type="number" 
                  value={formState.heightCm}
                  onChange={e => handleChange('heightCm', e.target.value)}
                  placeholder="178"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                />
                <input 
                  type="number" 
                  value={formState.weightKg}
                  onChange={e => handleChange('weightKg', e.target.value)}
                  placeholder="74"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Section 2: Allergies & Chronic Conditions */}
        <div>
          <h3 style={{ fontSize: '1rem', color: '#fbbf24', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <ShieldAlert size={18} /> 2. Critical Allergies & Chronic Medical Conditions
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>SEVERE DRUG & FOOD ALLERGIES (COMMA SEPARATED)</label>
              <input 
                type="text" 
                value={formState.allergies}
                onChange={e => handleChange('allergies', e.target.value)}
                placeholder="e.g. Penicillin, Peanut Dust, Sulfa Drugs"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', fontSize: '0.88rem', fontWeight: 600 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>CHRONIC MEDICAL CONDITIONS (COMMA SEPARATED)</label>
              <input 
                type="text" 
                value={formState.medicalConditions}
                onChange={e => handleChange('medicalConditions', e.target.value)}
                placeholder="e.g. Asthma, Hypertension, Diabetes Type 2"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>ORGAN DONOR ID (IF REGISTERED)</label>
              <input 
                type="text" 
                value={formState.organDonorId}
                onChange={e => handleChange('organDonorId', e.target.value)}
                placeholder="e.g. OD-IN-99218-DEL"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Section 3: Active Medications & Prescriptions */}
        <div>
          <h3 style={{ fontSize: '1rem', color: '#c084fc', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Pill size={18} /> 3. Active Daily Medications & Prescriptions
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>PRIMARY MEDICATION NAME & DOSAGE</label>
              <input 
                type="text" 
                value={formState.medName1}
                onChange={e => handleChange('medName1', e.target.value)}
                placeholder="e.g. Montelukast 10mg"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>DOSAGE FREQUENCY / INSTRUCTIONS</label>
              <input 
                type="text" 
                value={formState.medDosage1}
                onChange={e => handleChange('medDosage1', e.target.value)}
                placeholder="e.g. 1 Tablet Daily At Bedtime"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>SECONDARY MEDICATION / SOS INHALER</label>
              <input 
                type="text" 
                value={formState.medName2}
                onChange={e => handleChange('medName2', e.target.value)}
                placeholder="e.g. Inhaler (SOS Asthma Relief)"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>INHALER / SECONDARY DOSAGE INSTRUCTIONS</label>
              <input 
                type="text" 
                value={formState.medDosage2}
                onChange={e => handleChange('medDosage2', e.target.value)}
                placeholder="e.g. 2 Puffs During Emergency"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Section 4: Primary Physician & Insurance */}
        <div>
          <h3 style={{ fontSize: '1rem', color: '#f59e0b', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Stethoscope size={18} /> 4. Primary Physician & Health Insurance Policy
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>PRIMARY PHYSICIAN / DOCTOR NAME</label>
              <input 
                type="text" 
                value={formState.doctorName}
                onChange={e => handleChange('doctorName', e.target.value)}
                placeholder="e.g. Dr. Rohan Sharma"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>DOCTOR EMERGENCY PHONE NUMBER</label>
              <input 
                type="text" 
                value={formState.doctorPhone}
                onChange={e => handleChange('doctorPhone', e.target.value)}
                placeholder="e.g. +91 98765 43210"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>PREFERRED HOSPITAL / TRAUMA CENTER</label>
              <input 
                type="text" 
                value={formState.doctorHospital}
                onChange={e => handleChange('doctorHospital', e.target.value)}
                placeholder="e.g. Max Super Speciality Hospital"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>HEALTH INSURANCE PROVIDER</label>
              <input 
                type="text" 
                value={formState.insuranceProvider}
                onChange={e => handleChange('insuranceProvider', e.target.value)}
                placeholder="e.g. Star Health Comprehensive Gold"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>INSURANCE POLICY / E-CARD NUMBER</label>
              <input 
                type="text" 
                value={formState.insurancePolicyNumber}
                onChange={e => handleChange('insurancePolicyNumber', e.target.value)}
                placeholder="e.g. SH-88492019-X"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>HEALTH INSURANCE EXPIRY DATE</label>
              <input 
                type="date" 
                value={formState.insuranceExpiry}
                onChange={e => handleChange('insuranceExpiry', e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', background: '#000000', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '12px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '0.95rem', fontWeight: 700, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)' }}>
            <Save size={18} /> SAVE MEDICAL INFORMATION & EMERGENCY DOSSIER
          </button>
        </div>
      </form>
    </div>
  );
}
