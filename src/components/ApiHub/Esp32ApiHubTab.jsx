import React, { useState } from 'react';
import { 
  Cpu, 
  Code, 
  Send, 
  Copy, 
  CheckCircle2, 
  Download, 
  Terminal, 
  Radio, 
  Zap,
  Activity
} from 'lucide-react';

export default function Esp32ApiHubTab({ updateTelemetry, triggerEmergency }) {
  const [copied, setCopied] = useState(false);
  const [jsonPayload, setJsonPayload] = useState(JSON.stringify({
    device_id: "ESP32-SAFE-CRETA-01",
    api_key: "sk_live_safe_drive_9921",
    speed_kmh: 68.5,
    accel_x_g: 5.84,
    accel_y_g: 2.10,
    accel_z_g: 1.45,
    total_g: 6.22,
    pitch_deg: 14.5,
    roll_deg: 48.2,
    gps: {
      lat: 28.4595,
      lng: 77.0266,
      sats: 12,
      hdop: 0.7
    },
    battery_percent: 88,
    gsm_dbm: -68,
    sos_button: "RELEASED"
  }, null, 2));

  const [responseStatus, setResponseStatus] = useState(null);

  const handleSendPacket = () => {
    try {
      const parsed = JSON.parse(jsonPayload);
      updateTelemetry({
        speedKmh: parsed.speed_kmh || 50,
        accelX: parsed.accel_x_g || 0.1,
        accelY: parsed.accel_y_g || 0.1,
        accelZ: parsed.accel_z_g || 0.98,
        totalGForce: parsed.total_g || 1.0,
        pitchDeg: parsed.pitch_deg || 0,
        rollDeg: parsed.roll_deg || 0,
        lat: parsed.gps?.lat || 28.4595,
        lng: parsed.gps?.lng || 77.0266,
        gpsSatellites: parsed.gps?.sats || 10,
        batteryPercent: parsed.battery_percent || 90,
        gsmSignalDbm: parsed.gsm_dbm || -70,
        sosPhysicalButton: parsed.sos_button || 'RELEASED',
        lastUpdateTimestamp: new Date().toLocaleTimeString()
      });

      if (parsed.total_g > 4.0 || Math.abs(parsed.roll_deg) > 60) {
        triggerEmergency('ESP32_API_JSON_IMPACT', 'CRITICAL', `ESP32 Reported ${parsed.total_g}g Impact & ${parsed.roll_deg}° Roll`);
      }

      setResponseStatus({
        code: 200,
        message: "HTTP/1.1 200 OK - Telemetry packet processed & dashboard updated!"
      });
    } catch (e) {
      setResponseStatus({
        code: 400,
        message: "HTTP/1.1 400 Bad Request - Invalid JSON payload syntax."
      });
    }
  };

  const cppArduinoSketch = `/*
 * SafeDrive IoT - ESP32 Firmware Sketch v2.4
 * Hardware: ESP32 DevKit v1, MPU-6050 Gyro/Accel, NEO-6M GPS, SIM800L GSM
 */

#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <TinyGPS++.h>
#include <HTTPClient.h>
#include <WiFi.h>

const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";
const char* API_URL   = "https://api.safedrive-iot.org/v1/telemetry";

Adafruit_MPU6050 mpu;
TinyGPSPlus gps;
HardwareSerial SerialGPS(2); // RX2 = GPIO16, TX2 = GPIO17

void setup() {
  Serial.begin(115200);
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17);
  
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }

  if (!mpu.begin()) {
    Serial.println("MPU6050 sensor error!");
  }
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float total_g = sqrt(pow(a.acceleration.x/9.81, 2) + pow(a.acceleration.y/9.81, 2) + pow(a.acceleration.z/9.81, 2));

  if (total_g > 4.0) { // Crash Threshold Trigger
    sendTelemetryPayload(total_g, a.acceleration.x, a.acceleration.y, a.acceleration.z);
  }

  delay(200);
}

void sendTelemetryPayload(float total_g, float ax, float ay, float az) {
  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");

  String json = "{\\"device_id\\":\\"ESP32-CRETA-01\\",\\"total_g\\":" + String(total_g) + "}";
  int httpCode = http.POST(json);
  http.end();
}
`;

  const copyCode = () => {
    navigator.clipboard.writeText(cppArduinoSketch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={26} color="#10b981" /> ESP32 & Arduino Developer API Hub
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
          Connect ESP32 / Arduino UNO / STM32 hardware over HTTP REST, WebSockets, or MQTT telemetry endpoints
        </p>
      </div>

      {/* Interactive JSON Telemetry Payload Tester */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="#10b981" /> Live ESP32 JSON Payload Sandbox
          </h3>
          <span className="badge badge-success"><Radio size={12} /> REST ENDPOINT: POST /api/v1/telemetry</span>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '14px' }}>
          Edit the JSON sensor telemetry frame below and click <strong>"SEND JSON TO DASHBOARD"</strong> to test live telemetry streaming & crash alerts.
        </p>

        <textarea 
          rows={12}
          value={jsonPayload}
          onChange={e => setJsonPayload(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: 'var(--bg-dark)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#f59e0b',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            outline: 'none',
            lineHeight: 1.5
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <button onClick={handleSendPacket} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Send size={16} /> SEND JSON PACKET TO DASHBOARD
          </button>

          {responseStatus && (
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: responseStatus.code === 200 ? '#34d399' : '#f87171',
              background: responseStatus.code === 200 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: `1px solid ${responseStatus.code === 200 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              {responseStatus.message}
            </div>
          )}
        </div>
      </div>

      {/* Arduino C++ Code Snippet Box */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={18} color="#f59e0b" /> Ready-to-Flash ESP32 Firmware Sketch (.ino)
          </h3>

          <button onClick={copyCode} className="btn btn-ghost" style={{ fontSize: '0.78rem' }}>
            {copied ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Sketch'}
          </button>
        </div>

        <pre style={{
          background: 'var(--bg-dark)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#e2e8f0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          maxHeight: '340px',
          overflowY: 'auto',
          lineHeight: 1.5
        }}>
          {cppArduinoSketch}
        </pre>
      </div>
    </div>
  );
}
