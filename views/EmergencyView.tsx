
import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, Phone, Volume2, ShieldAlert, MessageCircle, X, Share2, Loader2 } from 'lucide-react';
import { Location, EmergencyContact } from '../types';

interface EmergencyViewProps {
  onExit: () => void;
  userLocation: Location | null;
  contacts: EmergencyContact[];
}

const EmergencyView: React.FC<EmergencyViewProps> = ({ onExit, userLocation, contacts }) => {
  const [countdown, setCountdown] = useState(30);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isAutoSharing, setIsAutoSharing] = useState(false);
  // Using any for the interval ref to avoid NodeJS namespace issues in the browser
  const shareTimerRef = useRef<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recurring Location Sharing Logic
  useEffect(() => {
    if (isAutoSharing && userLocation && contacts.length > 0) {
      const shareLocation = () => {
        const primary = contacts[0];
        const locationLink = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
        const message = encodeURIComponent(`🚨 VOYAGER AUTO-ALERT: My live position is updated. ${locationLink}`);
        const whatsappUrl = `https://wa.me/${primary.phone.replace(/\D/g, '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
      };

      // Immediate first share
      shareLocation();

      // Set recurring interval (every 60 seconds)
      shareTimerRef.current = setInterval(shareLocation, 60000);
    } else {
      if (shareTimerRef.current) clearInterval(shareTimerRef.current);
    }

    return () => {
      if (shareTimerRef.current) clearInterval(shareTimerRef.current);
    };
  }, [isAutoSharing, userLocation, contacts]);

  useEffect(() => {
    let interval: any;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            onExit();
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, onExit]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (contact: EmergencyContact) => {
    const locationStr = userLocation 
      ? `My current location: https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}` 
      : "I am unable to share my exact coordinates right now.";
    
    const message = encodeURIComponent(`EMERGENCY: I am in danger and using Voyager Safety App. Please help me! ${locationStr}`);
    const whatsappUrl = `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-between p-6 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      {/* Background Pulse */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[150%] h-[150%] rounded-full bg-red-600 pulse-animation"></div>
      </div>

      <div className="relative w-full flex flex-col items-center gap-2 mt-8 shrink-0">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] mb-2">
          <ShieldAlert size={40} className="text-white animate-bounce" />
        </div>
        <h1 className="text-3xl font-black text-red-600 tracking-tighter uppercase">Emergency</h1>
        <p className="text-white/60 text-center text-xs font-medium tracking-wide">
          AUDIBLE ALARM ACTIVE<br/>TRANSMITTING LIVE POSITION
        </p>
      </div>

      <div className="relative w-full flex-1 mt-6 mb-4 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between px-2 mb-3">
           <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Trusted Contacts</h3>
           <button 
             onClick={() => setIsAutoSharing(!isAutoSharing)}
             className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${isAutoSharing ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse' : 'bg-white/5 text-white/40 border-white/10'}`}
           >
             {isAutoSharing ? <Loader2 size={10} className="animate-spin" /> : <Share2 size={10} />}
             {isAutoSharing ? 'Recurring Live Feed Active' : 'Enable Live Feed'}
           </button>
        </div>

        <div className="space-y-3">
          {contacts.length > 0 ? contacts.map((contact) => (
            <div key={contact.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
              <div className="w-12 h-12 rounded-full border-2 border-red-500/30 overflow-hidden shrink-0">
                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">{contact.name}</h4>
                <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{contact.relation}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleWhatsApp(contact)}
                  className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 active:scale-90 transition-transform"
                >
                  <MessageCircle size={18} fill="currentColor" className="fill-emerald-400/20" />
                </button>
                <button 
                  onClick={() => handleCall(contact.phone)}
                  className="w-10 h-10 bg-red-600/20 border border-red-500/30 rounded-xl flex items-center justify-center text-red-400 active:scale-90 transition-transform"
                >
                  <Phone size={18} fill="currentColor" className="fill-red-400/20" />
                </button>
              </div>
            </div>
          )) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-md">
              <AlertTriangle className="mx-auto text-white/20 mb-2" size={32} />
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest">No trusted contacts configured</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full space-y-3 shrink-0 pb-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Auto-Alert Trigger</span>
            <span className="text-red-500 font-mono text-lg">{countdown}s</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-1000 ease-linear" 
              style={{ width: `${(countdown / 30) * 100}%` }}
            />
          </div>
        </div>

        <button 
          onClick={() => handleCall('100')}
          className="w-full bg-red-600 text-white h-16 rounded-2xl font-black text-base flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-red-900/40"
        >
          <Phone size={20} fill="currentColor" />
          DIAL AUTHORITIES
        </button>

        {/* Enhanced Hold to Cancel Button */}
        <div className="relative h-20 w-full rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 z-0">
             <svg className="w-full h-full" preserveAspectRatio="none">
                <rect 
                  x="2" y="2" 
                  width="calc(100% - 4px)" 
                  height="calc(100% - 4px)" 
                  rx="14" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="4"
                />
                <rect 
                  x="2" y="2" 
                  width="calc(100% - 4px)" 
                  height="calc(100% - 4px)" 
                  rx="14" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="4"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 - (holdProgress * 10)}
                  className="transition-all duration-75 ease-linear"
                />
             </svg>
          </div>

          <button 
            onMouseDown={() => setIsHolding(true)}
            onMouseUp={() => setIsHolding(false)}
            onMouseLeave={() => setIsHolding(false)}
            onTouchStart={() => setIsHolding(true)}
            onTouchEnd={() => setIsHolding(false)}
            className={`w-full h-full bg-slate-900/80 backdrop-blur-sm border border-white/10 text-white font-bold flex flex-col items-center justify-center relative overflow-hidden z-10 transition-all duration-300 ${isHolding ? 'scale-[0.98] bg-slate-900' : ''}`}
          >
            <div 
              className="absolute inset-0 bg-red-600/10 transition-all duration-75 pointer-events-none"
              style={{ opacity: holdProgress / 100 }}
            />
            
            <div className="flex items-center gap-2 mb-1">
              {isHolding ? (
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              ) : (
                <X size={14} className="text-white/40" />
              )}
              <span className="text-sm tracking-[0.2em] uppercase font-black">Hold to Cancel</span>
            </div>
            
            <span className="text-[9px] uppercase tracking-widest opacity-40 font-bold">
              {isHolding ? `${Math.ceil((100 - holdProgress) / 20)}s remaining` : '5 Second Safety Lock'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyView;
