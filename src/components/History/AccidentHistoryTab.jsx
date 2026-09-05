import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Filter, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { accidentHistory } from '../../services/mockData';

export default function AccidentHistoryTab() {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredHistory = accidentHistory.filter(item => {
    if (filterSeverity === 'ALL') return true;
    return item.severity === filterSeverity;
  });

  const exportCsv = () => {
    const headers = "Incident ID,Date,Vehicle,Registration,Severity,Peak G-Force,Speed,Location,Status\n";
    const rows = accidentHistory.map(i => 
      `"${i.id}","${i.date}","${i.vehicleName}","${i.registrationNumber}","${i.severity}","${i.peakGForce}","${i.speedAtImpact}","${i.location}","${i.status}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SafeDrive_Accident_History_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={26} color="#f59e0b" /> Accident History & Sensor Telemetry Logs
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Historical record of impact incidents, hard braking events, and emergency SOS responses
          </p>
        </div>

        <button onClick={exportCsv} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
          <Download size={16} /> Export Telemetry CSV Log
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} /> FILTER SEVERITY:
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CRITICAL', 'MODERATE'].map(sev => (
            <button 
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`btn ${filterSeverity === sev ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Dossiers Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredHistory.map(inc => (
          <div key={inc.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge badge-${inc.severity === 'CRITICAL' ? 'danger' : 'warning'}`}>
                  {inc.severity} SEVERITY
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{inc.id}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }} className="mono">{inc.date}</span>
              </div>

              <div style={{ fontSize: '0.82rem', color: inc.status.includes('Cancelled') ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                {inc.status}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.82rem', marginBottom: '12px' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>VEHICLE</span>
                <div style={{ fontWeight: 600, color: '#cbd5e1' }}>{inc.vehicleName} ({inc.registrationNumber})</div>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>PEAK G-FORCE IMPULSE</span>
                <div style={{ fontWeight: 800, color: inc.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b' }} className="mono">{inc.peakGForce}</div>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>SPEED AT IMPACT</span>
                <div style={{ fontWeight: 700, color: '#f59e0b' }} className="mono">{inc.speedAtImpact}</div>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>LOCATION</span>
                <div style={{ fontWeight: 600, color: '#cbd5e1' }}>{inc.location}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#94a3b8', borderLeft: '3px solid #f59e0b' }}>
              <strong>AI Diagnostic Record:</strong> {inc.aiSummary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
