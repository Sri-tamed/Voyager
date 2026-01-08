
import React, { useEffect, useState, useCallback } from 'react';
import { Shield, ArrowRight, Zap, MapPin, Star, Share2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SafetyStatus, Location, EmergencyContact } from '../types';
import { getSafetyAdvice } from '../services/geminiService';

interface HomeViewProps {
  status: SafetyStatus;
  onEmergencyTrigger: () => void;
  userLocation: Location | null;
  contacts: EmergencyContact[];
}

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const HomeView: React.FC<HomeViewProps> = ({ status, onEmergencyTrigger, userLocation, contacts }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAdvice = useCallback(async () => {
    setLoadingAdvice(true);
    setIsRefreshing(true);
    const res = await getSafetyAdvice("Kolkata and West Bengal");
    // Parse tips by splitting newlines and cleaning bullets
    const parsedTips = res.split('\n')
      .map(t => t.replace(/^[•\-\d\.]+\s*/, '').trim())
      .filter(t => t.length > 0);
    
    setTips(parsedTips.length > 0 ? parsedTips : ["Stay alert in crowded zones.", "Keep your device secured.", "Verify local transport."]);
    setLoadingAdvice(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAdvice();
  }, [userLocation, fetchAdvice]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-[#042f2e]">
      {/* Header Section */}
      <div className="relative h-64 w-full shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1558431382-27e39cbef4bc?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover"
          alt="Victoria Memorial"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-teal-950/40 to-transparent" />
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
           <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <MapPin className="text-teal-400" size={16} />
              <span className="text-white text-xs font-bold tracking-tight">Kolkata, WB</span>
           </div>
           <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white active:scale-90 transition-all">
             <Share2 size={18} />
           </button>
        </div>
        <div className="absolute bottom-6 left-6">
           <h2 className="text-[10px] uppercase tracking-[0.3em] text-teal-400 font-black mb-1">Local Safety Intel</h2>
           <h1 className="text-3xl font-black text-white tracking-tighter">The City of Joy</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-7 no-scrollbar">
        {/* Status Chip */}
        <div className={`flex items-center gap-4 p-5 rounded-[2rem] glass transition-all duration-500 ${status === SafetyStatus.SAFE ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
           <div className="relative flex items-center justify-center">
             <div className={`absolute w-6 h-6 rounded-full animate-ping opacity-20 ${status === SafetyStatus.SAFE ? 'bg-emerald-400' : 'bg-amber-400'}`} />
             <div className={`w-3.5 h-3.5 rounded-full relative z-10 ${status === SafetyStatus.SAFE ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]'}`} />
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest text-teal-400/60 leading-none mb-1">Environment Status</span>
             <span className="text-base font-bold text-white">
               {status === SafetyStatus.SAFE ? 'Safe Sector Perimeter' : 'Active Vigilance Mode'}
             </span>
           </div>
           <div className="ml-auto flex gap-0.5">
             {[1, 2, 3, 4, 5].map(i => (
               <Star key={i} size={12} className={i <= 4 ? "text-amber-400 fill-amber-400" : "text-white/10"} />
             ))}
           </div>
        </div>

        {/* Dynamic Voyager Tips Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-black text-teal-400 flex items-center gap-2">
              <Zap size={14} className="fill-teal-400" /> Voyager Safety Tips
            </h3>
            <button 
              onClick={fetchAdvice}
              disabled={loadingAdvice}
              className={`p-2 rounded-full transition-all active:rotate-180 ${isRefreshing ? 'text-teal-400' : 'text-teal-400/40 hover:text-teal-400'}`}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div className="bg-teal-900/10 rounded-[2.5rem] border border-white/5 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Shield size={80} className="text-teal-400" />
            </div>
            
            {loadingAdvice ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-800/40 animate-pulse mt-0.5" />
                    <div className="h-3 bg-teal-800/40 animate-pulse rounded w-full mt-1.5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5 relative z-10">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} className="text-teal-400" />
                    </div>
                    <p className="text-sm text-teal-50/90 leading-tight font-medium py-0.5">
                      <TypewriterText text={tip} />
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Verified Safe Hubs */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
             <h3 className="text-[10px] uppercase tracking-[0.25em] font-black text-teal-400">Verified Safe Hubs</h3>
             <span className="text-[10px] font-bold text-teal-400/40">Nearby (3)</span>
           </div>
           <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
             {[
               { name: 'Park St. Safe Zone', dist: '0.4km', img: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=200' },
               { name: 'Esplanade Metro', dist: '1.2km', img: 'https://images.unsplash.com/photo-1517330357046-3ab5b5dd42a1?auto=format&fit=crop&q=80&w=200' },
               { name: 'Howrah Junction', dist: '3.8km', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=200' }
             ].map((hub, i) => (
               <div key={i} className="min-w-[160px] bg-teal-950/40 rounded-[2rem] border border-white/5 p-4 shrink-0 hover:border-teal-500/30 transition-all active:scale-95 group">
                  <div className="h-24 bg-teal-900 rounded-2xl mb-3 overflow-hidden">
                    <img src={hub.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={hub.name} />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 truncate">{hub.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-teal-400/60 font-bold uppercase tracking-widest">{hub.dist}</span>
                    <ArrowRight size={12} className="text-teal-400 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Primary Action */}
        <div className="pt-2">
          <button 
            onClick={onEmergencyTrigger}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white h-18 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 active:scale-[0.97] transition-all shadow-2xl shadow-teal-900/60 border border-white/10"
          >
            <Shield size={22} className="fill-white/20" />
            Enable Emergency Overwatch
          </button>
          <p className="text-center text-[9px] text-teal-400/40 font-bold uppercase tracking-widest mt-4">
            Secured by Voyager End-to-End Telemetry
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
