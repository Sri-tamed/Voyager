
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Phone, Volume2, ShieldAlert } from 'lucide-react';

interface EmergencyViewProps {
  onExit: () => void;
}

const EmergencyView: React.FC<EmergencyViewProps> = ({ onExit }) => {
  const [countdown, setCountdown] = useState(30);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            onExit();
            return 100;
          }
          return prev + 2.5;
        });
      }, 50);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, onExit]);

  return (
    <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-between p-8 animate-in fade-in duration-500">
      {/* Background Pulse */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
        <div className="w-[150%] h-[150%] rounded-full bg-red-600 pulse-animation"></div>
      </div>

      <div className="relative w-full flex flex-col items-center gap-4 mt-12">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] mb-4">
          <ShieldAlert size={48} className="text-white animate-bounce" />
        </div>
        <h1 className="text-4xl font-black text-red-600 tracking-tighter uppercase">Emergency</h1>
        <p className="text-white/60 text-center text-sm font-medium tracking-wide">
          AUDIBLE ALARM ACTIVE<br/>TRANSMITTING LIVE POSITION
        </p>
      </div>

      <div className="relative w-full space-y-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Auto-Alert Trigger</span>
            <span className="text-red-500 font-mono text-xl">{countdown}s</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-1000 ease-linear" 
              style={{ width: `${(countdown / 30) * 100}%` }}
            />
          </div>
        </div>

        <button className="w-full bg-red-600 text-white h-20 rounded-3xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-red-900/40">
          <Phone size={24} fill="currentColor" />
          DIAL EMERGENCY
        </button>

        <div className="relative h-20 w-full overflow-hidden rounded-3xl">
          <button 
            onMouseDown={() => setIsHolding(true)}
            onMouseUp={() => setIsHolding(false)}
            onMouseLeave={() => setIsHolding(false)}
            onTouchStart={() => setIsHolding(true)}
            onTouchEnd={() => setIsHolding(false)}
            className="w-full h-full bg-slate-900 border border-white/20 text-white font-bold flex flex-col items-center justify-center relative overflow-hidden z-10"
          >
            <div 
              className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-75"
              style={{ width: `${holdProgress}%` }}
            />
            <span className="relative text-sm tracking-widest uppercase opacity-80">Hold to Cancel</span>
            <span className="relative text-[10px] opacity-40 mt-1">Intentional friction for safety</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyView;
