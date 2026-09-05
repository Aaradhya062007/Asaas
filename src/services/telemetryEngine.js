// Web Audio API Alarm Synthesizer for Emergency Siren / Relay Horn
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.intervalId = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  startSiren() {
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.isPlaying) return;

      this.isPlaying = true;
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(600, this.audioCtx.currentTime);

      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.oscillator.start();

      let high = false;
      this.intervalId = setInterval(() => {
        if (!this.oscillator || !this.audioCtx) return;
        const targetFreq = high ? 600 : 950;
        this.oscillator.frequency.exponentialRampToValueAtTime(targetFreq, this.audioCtx.currentTime + 0.3);
        high = !high;
      }, 400);
    } catch (e) {
      console.warn('Audio Siren init blocked or unsupported:', e);
    }
  }

  stopSiren() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {}
      this.oscillator = null;
    }
    this.isPlaying = false;
  }
}

export const sirenSound = new SoundManager();

// Default ASAAS Telemetry State
export const defaultTelemetryState = {
  deviceId: 'ASAAS-001',
  systemOnline: true,
  gpsActive: true,
  sensorsActive: true,
  communicationActive: true,
  vehicleRunning: true,

  relayHornActive: false,
  stopButtonPressed: false,
  
  speedKmh: 58.4,
  accelX: 0.12, // g
  accelY: 0.08, // g
  accelZ: 0.98, // g
  totalGForce: 0.99,
  pitchDeg: 2.1,
  rollDeg: -1.4,
  lat: 28.4595,
  lng: 77.0266,
  altitudeMeters: 216,
  batteryPercent: 92,
  batteryVoltage: '4.18V',
  gpsSatellites: 12,
  gpsHdop: 0.7,
  gsmSignalDbm: -64,
  gsmCarrier: 'Airtel 4G IoT',
  mpuSensorStatus: 'HEALTHY',
  sosPhysicalButton: 'RELEASED',
  lastUpdateTimestamp: new Date().toLocaleTimeString(),
  isEmergencyAlert: false,
  alertSeverity: 'NONE', // 'NONE' | 'WARNING' | 'CRITICAL'
  alertReason: '',

  // ASAAS Priority Sequence Tracking
  sequentialStage: 'IDLE', // 'IDLE' | 'ACCIDENT' | 'GPS_FIX' | 'HOSPITAL' | 'POLICE' | 'FAMILY' | 'STOPPED'
  timelineEvents: []
};
