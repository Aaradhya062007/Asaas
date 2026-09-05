import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TelemetryBar from './components/TelemetryBar';
import DashboardTab from './components/Dashboard/DashboardTab';
import AccidentMapTab from './components/Map/AccidentMapTab';
import PersonalHospitalMapTab from './components/Map/PersonalHospitalMapTab';
import AiAnalysisTab from './components/AIAnalysis/AiAnalysisTab';
import VehicleManagerTab from './components/Vehicles/VehicleManagerTab';
import MedicalCareTab from './components/Medical/MedicalCareTab';
import EmergencyContactsTab from './components/Contacts/EmergencyContactsTab';
import AccidentHistoryTab from './components/History/AccidentHistoryTab';
import Esp32ApiHubTab from './components/ApiHub/Esp32ApiHubTab';
import ArchitectureTab from './components/Architecture/ArchitectureTab';
import EmergencySosModal from './components/Emergency/EmergencySosModal';
import AuthModal from './components/Auth/AuthModal';
import LoginPage from './components/Auth/LoginPage';
import VehicleInfoForm from './components/Forms/VehicleInfoForm';
import MedicalInfoForm from './components/Forms/MedicalInfoForm';

import { 
  initialVehicles, 
  initialMedicalProfile, 
  initialEmergencyContacts 
} from './services/mockData';
import { defaultTelemetryState } from './services/telemetryEngine';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState(initialVehicles[0]);
  const [medicalProfile, setMedicalProfile] = useState(initialMedicalProfile);
  const [emergencyContacts, setEmergencyContacts] = useState(initialEmergencyContacts);
  const [telemetry, setTelemetry] = useState(defaultTelemetryState);

  // Emergency SOS Modal State
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [emergencyData, setEmergencyData] = useState({ triggerSource: '', severity: '', reason: '' });

  // Auth User State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Mercer',
    email: 'alex.mercer@safedrive.io',
    role: 'Vehicle Owner'
  });

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Calculate global document expiry count for badges
  const allDocs = vehicles.flatMap(v => v.documents);
  const expiryAlertCount = allDocs.filter(d => d.status === 'expired' || d.status === 'expiring_soon').length;

  const triggerEmergency = (triggerSource, severity, reason) => {
    setEmergencyData({ triggerSource, severity, reason });
    setTelemetry(prev => ({
      ...prev,
      isEmergencyAlert: true,
      alertSeverity: severity,
      alertReason: reason
    }));
    setIsSosOpen(true);
  };

  const updateTelemetry = (newTelemetry) => {
    setTelemetry(prev => ({ ...prev, ...newTelemetry }));
  };

  // IF NOT LOGGED IN -> RENDER FIRST LOGIN / REGISTRATION PAGE
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const currentUserWithLogout = currentUser ? { ...currentUser, onLogout: handleLogout } : null;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar 
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        telemetry={telemetry}
        triggerEmergency={triggerEmergency}
        currentUser={currentUserWithLogout}
        openAuthModal={() => setIsAuthOpen(true)}
        expiryAlertCount={expiryAlertCount}
      />

      {/* Hardware Status Strip */}
      <TelemetryBar telemetry={telemetry} />

      {/* Main Grid Content */}
      <div className="app-main">
        {/* Sidebar Nav */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentExpiryCount={expiryAlertCount}
          emergencyActive={telemetry.isEmergencyAlert}
        />

        {/* Tab Content Rendering */}
        <main style={{ minHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <DashboardTab 
              selectedVehicle={selectedVehicle}
              setSelectedVehicle={setSelectedVehicle}
              vehicles={vehicles}
              setVehicles={setVehicles}
              medicalProfile={medicalProfile}
              setMedicalProfile={setMedicalProfile}
              telemetry={telemetry}
              updateTelemetry={updateTelemetry}
              triggerEmergency={triggerEmergency}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'map' && (
            <AccidentMapTab 
              selectedVehicle={selectedVehicle}
              telemetry={telemetry}
            />
          )}

          {activeTab === 'hospital-map' && (
            <PersonalHospitalMapTab 
              selectedVehicle={selectedVehicle}
              medicalProfile={medicalProfile}
              telemetry={telemetry}
              triggerEmergency={triggerEmergency}
            />
          )}

          {activeTab === 'ai-analysis' && (
            <AiAnalysisTab 
              selectedVehicle={selectedVehicle}
              telemetry={telemetry}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehicleManagerTab 
              vehicles={vehicles}
              setVehicles={setVehicles}
              selectedVehicle={selectedVehicle}
              setSelectedVehicle={setSelectedVehicle}
            />
          )}

          {activeTab === 'medical' && (
            <MedicalCareTab 
              medicalProfile={medicalProfile}
              setMedicalProfile={setMedicalProfile}
            />
          )}

          {activeTab === 'contacts' && (
            <EmergencyContactsTab 
              contacts={emergencyContacts}
              setContacts={setEmergencyContacts}
              telemetry={telemetry}
              selectedVehicle={selectedVehicle}
            />
          )}

          {activeTab === 'history' && (
            <AccidentHistoryTab />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureTab />
          )}

          {activeTab === 'api-hub' && (
            <Esp32ApiHubTab 
              updateTelemetry={updateTelemetry}
              triggerEmergency={triggerEmergency}
            />
          )}
        </main>
      </div>

      {/* High Priority Emergency SOS Modal */}
      <EmergencySosModal 
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        selectedVehicle={selectedVehicle}
        telemetry={telemetry}
        emergencyData={emergencyData}
        medicalProfile={medicalProfile}
        emergencyContacts={emergencyContacts}
      />

      {/* User Login & Role Switcher Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </div>
  );
}
