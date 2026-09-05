import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Database, 
  Server, 
  Globe, 
  ArrowDown, 
  ArrowRight, 
  ShieldAlert, 
  Car, 
  HeartPulse, 
  Radio, 
  CheckCircle2,
  Code2,
  Sliders,
  Award,
  Sparkles,
  Building2,
  Heart,
  Octagon
} from 'lucide-react';

export default function ArchitectureTab() {
  const [selectedNode, setSelectedNode] = useState('hardware');

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Network size={26} color="#f59e0b" /> ASAAS System Architecture & Dataflow Diagram
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
          Interactive schematic showing ESP32 Hardware Sensors &rarr; Django/FastAPI Backend &rarr; MySQL Database &rarr; ASAAS Live Website Dashboard
        </p>
      </div>

      {/* TEACHER / JUDGE EVALUATION PITCH CARD */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'linear-gradient(135deg, rgba(8, 8, 8, 0.95) 0%, rgba(245, 158, 11, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} color="#fbbf24" />
            <h3 style={{ fontSize: '1.15rem', color: '#fbbf24', margin: 0, fontWeight: 800 }}>
              🎤 PROJECT PRESENTATION PITCH (FOR TEACHERS & EVALUATORS)
            </h3>
          </div>
          <span className="badge badge-warning">1-MINUTE CORE CONCEPT SUMMARY</span>
        </div>

        <blockquote style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderLeft: '4px solid #fbbf24',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '0.88rem',
          color: '#e2e8f0',
          lineHeight: 1.6,
          margin: 0
        }}>
          “<strong>ASAAS</strong> (Accident Sensor and Alert Sender) is an IoT-based accident detection and emergency alert system for two-wheelers and four-wheelers. The system continuously monitors the vehicle using collision sensors. When a significant accident is detected, the sensor sends a signal to the microcontroller, which initiates the emergency process. The relay activates the horn as a local warning, while the GPS module obtains the vehicle's location.<br /><br />
          Our main emergency workflow is priority-based: <strong>first, an alert with the accident location is sent to the hospital, then to the police, and finally to the registered family members (Hospital &rarr; Police &rarr; Family).</strong> The website acts as a central dashboard where the accident status, GPS location, emergency progress, vehicle info, and medical records are monitored.”
        </blockquote>
      </div>

      {/* Visual ASAAS Architecture Interactive Flowchart */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#f59e0b', marginBottom: '18px', textAlign: 'center', letterSpacing: '0.04em' }}>
          🌐 ASAAS END-TO-END SYSTEM DATAFLOW SCHEMATIC
        </h3>

        {/* Section 1: ASAAS Website Dashboard Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginBottom: '30px' }}>
          <div 
            onClick={() => setSelectedNode('website')}
            style={{
              background: selectedNode === 'website' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(10, 10, 10, 0.9)',
              border: selectedNode === 'website' ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
              padding: '16px 28px',
              borderRadius: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              minWidth: '280px',
              boxShadow: selectedNode === 'website' ? '0 0 25px rgba(245, 158, 11, 0.3)' : 'none'
            }}
          >
            <Globe size={22} color="#f59e0b" style={{ margin: '0 auto 6px auto' }} />
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>ASAAS WEBSITE</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Login / Registration Hub</div>
          </div>

          <ArrowDown size={22} color="#f59e0b" />

          <div 
            onClick={() => setSelectedNode('dashboard')}
            style={{
              background: selectedNode === 'dashboard' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(10, 10, 10, 0.9)',
              border: selectedNode === 'dashboard' ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
              padding: '16px 28px',
              borderRadius: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              minWidth: '340px',
              boxShadow: selectedNode === 'dashboard' ? '0 0 25px rgba(245, 158, 11, 0.3)' : 'none'
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>ASAAS LIVE DASHBOARD</div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
              Accident Status | GPS Location | Vehicle Status | Sensor Status | Emergency Alerts
            </div>
          </div>

          <ArrowDown size={22} color="#f59e0b" />

          {/* 3 Main Functional Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', width: '100%', maxWidth: '820px' }}>
            {/* Vehicle Management */}
            <div 
              onClick={() => setSelectedNode('vehicle')}
              style={{
                background: selectedNode === 'vehicle' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(10, 10, 10, 0.8)',
                border: selectedNode === 'vehicle' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '14px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <Car size={20} color="#f59e0b" style={{ margin: '0 auto 6px auto' }} />
              <strong style={{ color: '#f8fafc', fontSize: '0.9rem', display: 'block' }}>VEHICLE MANAGEMENT</strong>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                RC | Insurance | PUC | Service History | License
              </div>
            </div>

            {/* Emergency Center */}
            <div 
              onClick={() => setSelectedNode('emergency')}
              style={{
                background: selectedNode === 'emergency' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(10, 10, 10, 0.8)',
                border: selectedNode === 'emergency' ? '2px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.3)',
                padding: '16px',
                borderRadius: '14px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <ShieldAlert size={20} color="#ef4444" style={{ margin: '0 auto 6px auto' }} />
              <strong style={{ color: '#f87171', fontSize: '0.9rem', display: 'block' }}>EMERGENCY CENTER</strong>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                SOS Panic | Contacts | Police | Ambulance 108 | Hospital
              </div>
            </div>

            {/* Medical Profile */}
            <div 
              onClick={() => setSelectedNode('medical')}
              style={{
                background: selectedNode === 'medical' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(10, 10, 10, 0.8)',
                border: selectedNode === 'medical' ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
                padding: '16px',
                borderRadius: '14px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <HeartPulse size={20} color="#10b981" style={{ margin: '0 auto 6px auto' }} />
              <strong style={{ color: '#34d399', fontSize: '0.9rem', display: 'block' }}>MEDICAL PROFILE</strong>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                Blood Group | Allergies | Medical | Documents | Prescriptions
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '24px 0' }} />

        {/* Section 2: ASAAS Hardware & Backend Pipeline */}
        <h4 style={{ fontSize: '0.95rem', color: '#a855f7', marginBottom: '16px', textAlign: 'center' }}>
          ⚡ ASAAS HARDWARE & BACKEND DATA INGESTION PIPELINE
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          {/* Hardware Layer */}
          <div 
            onClick={() => setSelectedNode('hardware')}
            style={{
              background: selectedNode === 'hardware' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(10, 10, 10, 0.9)',
              border: selectedNode === 'hardware' ? '2px solid #a855f7' : '1px solid rgba(168, 85, 247, 0.3)',
              padding: '16px 24px',
              borderRadius: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '680px'
            }}
          >
            <Cpu size={22} color="#a855f7" style={{ margin: '0 auto 6px auto' }} />
            <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>ASAAS HARDWARE (ESP32 / Arduino Microcontroller)</strong>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '12px', fontSize: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', color: '#ef4444' }}>
                💥 Collision Sensors (MPU6050)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', color: '#f59e0b' }}>
                📍 GPS Module (NEO-6M)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', color: '#10b981' }}>
                📡 GSM / SMS Module (SIM800L)
              </div>
            </div>
          </div>

          <ArrowDown size={22} color="#a855f7" />

          {/* Backend API */}
          <div 
            onClick={() => setSelectedNode('backend')}
            style={{
              background: selectedNode === 'backend' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(10, 10, 10, 0.9)',
              border: selectedNode === 'backend' ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
              padding: '14px 28px',
              borderRadius: '14px',
              textAlign: 'center',
              cursor: 'pointer',
              minWidth: '320px'
            }}
          >
            <Server size={20} color="#10b981" style={{ margin: '0 auto 4px auto' }} />
            <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>BACKEND REST API (Django / FastAPI)</strong>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Real-time Telemetry Ingestion & SOS Dispatcher</div>
          </div>

          <ArrowDown size={22} color="#10b981" />

          {/* Database */}
          <div 
            onClick={() => setSelectedNode('database')}
            style={{
              background: selectedNode === 'database' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(10, 10, 10, 0.9)',
              border: selectedNode === 'database' ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
              padding: '14px 28px',
              borderRadius: '14px',
              textAlign: 'center',
              cursor: 'pointer',
              minWidth: '320px'
            }}
          >
            <Database size={20} color="#f59e0b" style={{ margin: '0 auto 4px auto' }} />
            <strong style={{ color: '#fbbf24', fontSize: '0.9rem' }}>DATABASE (MySQL 8.0)</strong>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Relational Telemetry, Vehicles, Medical & SOS Tables</div>
          </div>
        </div>
      </div>

      {/* Node Inspector Drawer */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={18} color="#f59e0b" /> ASAAS Component Specification Inspector
        </h3>

        {selectedNode === 'hardware' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#a855f7' }}>⚡ ASAAS Hardware Microcontroller & Sensors</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
              ESP32 DevKit v1 acts as the core edge compute unit, polling MPU6050 impact sensors at 50Hz. Relay module triggers local horn warning sound. NEO-6M provides 3D GPS fixes, and SIM800L provides GSM GPRS HTTP POST failover + hardware SMS alerts.
            </p>
            <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#a855f7', fontFamily: 'var(--font-mono)' }}>
              Modules: MPU6050 (I2C 0x68) | Relay Switch (GPIO23) | Stop Circuit Button (GPIO18) | NEO-6M (UART2)
            </div>
          </div>
        )}

        {selectedNode === 'backend' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#10b981' }}>🖥️ Django / FastAPI Backend API Specifications</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
              FastAPI async worker pool processes telemetry streams. Executes the priority alert pipeline: Hospital (1st) &rarr; Police (2nd) &rarr; Family (3rd).
            </p>
            <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              Endpoints: POST /api/v1/telemetry | POST /api/v1/sos/dispatch | GET /api/v1/vehicles/{`{id}`}/documents
            </div>
          </div>
        )}

        {selectedNode === 'database' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#f59e0b' }}>🗄️ MySQL Database Schema Definition</h4>
            <pre style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
{`CREATE TABLE vehicles (
    id VARCHAR(36) PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. ASAAS-001
    registration_no VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('two-wheeler', 'four-wheeler') NOT NULL,
    rc_expiry DATE NOT NULL,
    insurance_expiry DATE NOT NULL,
    puc_expiry DATE NOT NULL,
    service_history JSON
);`}
            </pre>
          </div>
        )}

        {selectedNode === 'vehicle' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#f59e0b' }}>🚗 ASAAS Vehicle Management Subsystem</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Tracks two-wheelers & four-wheelers, RC, Insurance, PUC, Driving License, Warranty, and Service Records.
            </p>
          </div>
        )}

        {selectedNode === 'emergency' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ef4444' }}>🚨 ASAAS Emergency Response Center</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Sequential Priority Alert Dispatcher: Hospital (1st) &rarr; Police (2nd) &rarr; Family (3rd). Includes physical Stop Button circuit breaker.
            </p>
          </div>
        )}

        {selectedNode === 'medical' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#34d399' }}>🏥 ASAAS Medical Profile & Paramedic Dossier</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Instant blood group (O+), severe allergy flags, medical prescriptions, organ donor passes, and paramedic emergency mode.
            </p>
          </div>
        )}

        {selectedNode === 'website' || selectedNode === 'dashboard' ? (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#f59e0b' }}>🌐 ASAAS Live Web Dashboard</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Single-pane glassmorphic UI displaying live telemetry gauges, satellite counts, interactive Leaflet maps, and live sequential priority alerts.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
