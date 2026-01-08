
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Home, User, AlertTriangle, X, Search, SlidersHorizontal } from 'lucide-react';
import HomeView from './views/HomeView';
import MapView from './views/MapView';
import OnboardingView from './views/OnboardingView';
import EmergencyView from './views/EmergencyView';
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import { View, SafetyStatus, Location, EmergencyContact } from './types';
import { MOCK_DANGER_ZONES, EMERGENCY_CONTACTS as INITIAL_CONTACTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('onboarding');
  const [status, setStatus] = useState<SafetyStatus>(SafetyStatus.SAFE);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize contacts from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem('voyager_contacts');
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch (e) {
        setContacts(INITIAL_CONTACTS);
      }
    } else {
      setContacts(INITIAL_CONTACTS);
    }
  }, []);

  // Save contacts whenever they change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('voyager_contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audioRef.current.loop = true;
  }, []);

  const calculateDistance = (l1: Location, l2: Location) => {
    const R = 6371e3;
    const φ1 = l1.lat * Math.PI / 180;
    const φ2 = l2.lat * Math.PI / 180;
    const Δφ = (l2.lat - l1.lat) * Math.PI / 180;
    const Δλ = (l2.lng - l1.lng) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleLocationUpdate = useCallback((lat: number, lng: number) => {
    const loc = { lat, lng };
    setUserLocation(loc);
    let nearDanger = false;
    MOCK_DANGER_ZONES.forEach(zone => {
      if (calculateDistance(loc, zone.location) < zone.radius) nearDanger = true;
    });
    if (nearDanger && status !== SafetyStatus.EMERGENCY) {
      setStatus(SafetyStatus.CAUTION);
      triggerEmergencyAlert("Security Caution: Perimeter Buffer Reached");
    } else if (!nearDanger && status === SafetyStatus.CAUTION) {
      setStatus(SafetyStatus.SAFE);
    }
  }, [status]);

  const triggerEmergencyAlert = (msg: string) => {
    setShowNotification(msg);
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    setTimeout(() => setShowNotification(null), 5000);
  };

  const enterEmergency = () => {
    setStatus(SafetyStatus.EMERGENCY);
    setCurrentView('emergency');
    audioRef.current?.play().catch(e => console.log("Audio block", e));
  };

  const exitEmergency = () => {
    setStatus(SafetyStatus.SAFE);
    setCurrentView('home');
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (currentView === 'onboarding') return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => handleLocationUpdate(pos.coords.latitude, pos.coords.longitude),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentView, handleLocationUpdate]);

  if (currentView === 'onboarding') {
    return <OnboardingView onComplete={() => setCurrentView('home')} />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'home': return <HomeView status={status} onEmergencyTrigger={enterEmergency} userLocation={userLocation} contacts={contacts} />;
      case 'map': return <MapView userLocation={userLocation} status={status} contacts={contacts} />;
      case 'emergency': return <EmergencyView onExit={exitEmergency} userLocation={userLocation} contacts={contacts} />;
      case 'profile': return <ProfileView contacts={contacts} setContacts={setContacts} />;
      case 'settings': return <SettingsView />;
      default: return <HomeView status={status} onEmergencyTrigger={enterEmergency} userLocation={userLocation} contacts={contacts} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#042f2e] text-teal-50 overflow-hidden font-inter relative">
      <main className="flex-1 relative overflow-hidden">
        {renderView()}
      </main>

      {showNotification && (
        <div className="fixed top-12 left-4 right-4 z-[2000] bg-rose-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <AlertTriangle size={20} />
          <span className="text-sm font-bold flex-1">{showNotification}</span>
          <button onClick={() => setShowNotification(null)}><X size={18} /></button>
        </div>
      )}

      {currentView !== 'emergency' && (
        <div className="fixed bottom-6 left-6 right-6 z-[1000]">
          <nav className="h-16 bg-teal-800/90 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-around px-4 shadow-2xl">
            <NavButton 
              active={currentView === 'home'} 
              onClick={() => setCurrentView('home')} 
              icon={<Home size={22} />} 
            />
            <NavButton 
              active={currentView === 'map'} 
              onClick={() => setCurrentView('map')} 
              icon={<Search size={22} />} 
            />
             <button 
              onClick={enterEmergency}
              className="flex items-center justify-center -mt-10 bg-teal-500 w-14 h-14 rounded-full shadow-lg shadow-teal-900/60 active:scale-90 transition-all duration-300"
            >
              <Shield size={24} className="text-white" />
            </button>
            <NavButton 
              active={currentView === 'settings'} 
              onClick={() => setCurrentView('settings')} 
              icon={<SlidersHorizontal size={22} />} 
            />
            <NavButton 
              active={currentView === 'profile'} 
              onClick={() => setCurrentView('profile')} 
              icon={<User size={22} />} 
            />
          </nav>
        </div>
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button onClick={onClick} className={`p-2 transition-all duration-300 ${active ? 'text-white' : 'text-teal-400/50'}`}>
    {icon}
  </button>
);

export default App;
