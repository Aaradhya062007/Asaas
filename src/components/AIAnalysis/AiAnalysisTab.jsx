import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Activity, 
  RotateCw, 
  ShieldAlert, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertOctagon, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { accidentHistory } from '../../services/mockData';

export default function AiAnalysisTab({ selectedVehicle, telemetry }) {
  const [selectedIncident, setSelectedIncident] = useState(accidentHistory[0]);

  // Compute AI Severity Score based on current or selected incident
  const peakG = parseFloat(selectedIncident.peakGForce);
  const severityScore = Math.min(100, Math.round((peakG / 7.0) * 100));

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={26} color="#a855f7" /> AI Accident Analysis Engine
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Neural G-force impulse curve, collision vector reconstruction, and paramedic risk assessment model
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="btn btn-primary"
          style={{ fontSize: '0.82rem' }}
        >
          <Printer size={16} /> Export Official AI Incident PDF Report
        </button>
      </div>

      {/* Incident Selector */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>SELECT INCIDENT DOSSIER:</span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {accidentHistory.map(inc => (
            <button
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className={`btn ${selectedIncident.id === inc.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              {inc.id} ({inc.severity})
            </button>
          ))}
        </div>
      </div>

      {/* Main AI Insights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Severity Index Card */}
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> AI Collision Severity Score
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '14px 0' }}>
            <span style={{ fontSize: '3.6rem', fontWeight: 800, color: selectedIncident.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>
              {severityScore}
            </span>
            <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 600 }}>/ 100 Risk Score</span>
          </div>

          <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ height: '100%', width: `${severityScore}%`, background: selectedIncident.severity === 'CRITICAL' ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)' : '#f59e0b' }} />
          </div>

          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <strong>AI Severity Verdict:</strong> {selectedIncident.severity === 'CRITICAL' ? 'HIGH-ENERGY MULTI-AXIS IMPACT. Immediate trauma protocol required.' : 'MODERATE DECELERATION EVENT.'}
          </div>
        </div>

        {/* Impact Vector Breakdown */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} /> 3-Axis Telemetry Impulse
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>PEAK G-FORCE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }} className="mono">
                {selectedIncident.peakGForce}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>IMPACT SPEED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }} className="mono">
                {selectedIncident.speedAtImpact}
              </div>
            </div>
          </div>

          {/* Synthetic G-Force Impulse Visualizer */}
          <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '6px' }}>G-FORCE IMPULSE TIMELINE (t = -2s to +3s)</div>
            <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '4px 0' }}>
              {[0.9, 1.0, 0.95, 1.1, 5.84, 3.2, 1.8, 1.2, 1.0, 0.95].map((val, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <div style={{ width: '100%', height: `${(val / 6) * 50}px`, background: val > 4 ? '#ef4444' : val > 2 ? '#f59e0b' : '#f59e0b', borderRadius: '2px' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle 3D Orientation Vector Simulator */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RotateCw size={16} /> Vehicle Roll / Pitch Vector
          </div>

          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '90px',
              height: '90px',
              margin: '0 auto 12px auto',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px dashed #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: selectedIncident.severity === 'CRITICAL' ? 'rotate(42deg)' : 'rotate(8deg)',
              transition: 'transform 0.5s ease',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
            }}>
              <span style={{ fontSize: '2rem' }}>🚗</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
              {selectedIncident.severity === 'CRITICAL' ? 'Rollover Angle: 92° Roll | 14° Pitch' : 'Safe Upright Angle'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Automated Diagnosis & Paramedic Recommendations */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#a855f7" /> Neural AI Injury Risk Assessment & Clinical Protocol
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '14px', borderRadius: '12px' }}>
            <strong style={{ color: '#f87171', fontSize: '0.88rem' }}>🧠 Cervical Spine & Whiplash Risk</strong>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>
              High probability due to rapid 5.84g deceleration. Paramedics advised to use C-Collar before extraction.
            </p>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '14px', borderRadius: '12px' }}>
            <strong style={{ color: '#fbbf24', fontSize: '0.88rem' }}>🎈 Airbag Deployment Probability</strong>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>
              98.4% Confidence - Dual front and side curtain airbags triggered automatically.
            </p>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '14px', borderRadius: '12px' }}>
            <strong style={{ color: '#34d399', fontSize: '0.88rem' }}>🏥 Recommended Medical Receiving Unit</strong>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>
              Level 1 Trauma Center with 24/7 CT Scan & Orthopedic Surgery Readiness.
            </p>
          </div>
        </div>

        {/* Narrative Summary */}
        <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <strong style={{ color: '#f59e0b', fontSize: '0.85rem' }}>AI Report Narrative:</strong>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.6, margin: 0 }}>
            {selectedIncident.aiSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
