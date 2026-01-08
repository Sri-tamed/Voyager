
import React, { useEffect, useState } from 'react';
import { Shield, ArrowRight, Zap, MapPin, Star, Share2 } from 'lucide-react';
import { SafetyStatus, Location } from '../types';
import { getSafetyAdvice } from '../services/geminiService';

interface HomeViewProps {
  status: SafetyStatus;
  onEmergencyTrigger: () => void;
  userLocation: Location | null;
}

const HomeView: React.FC<HomeViewProps> = ({ status, onEmergencyTrigger, userLocation }) => {
  const [advice, setAdvice] = useState<string>("Analyzing local West Bengal trends...");
  const [loadingAdvice, setLoadingAdvice] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const res = await getSafetyAdvice("Kolkata and West Bengal");
      setAdvice(res);
      setLoadingAdvice(false);
    };
    fetchAdvice();
  }, [userLocation]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header Section from image style */}
      <div className="relative h-64 w-full shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1558431382-27e39cbef4bc?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover"
          alt="Victoria Memorial"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 to-transparent" />
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <MapPin className="text-white" size={20} />
              <span className="text-white font-medium">Kolkata, WB</span>
           </div>
           <Share2 className="text-white" size={20} />
        </div>
        <div className="absolute bottom-6 left-6">
           <h2 className="text-xs uppercase tracking-widest text-teal-100/80 font-bold mb-1">Local Safety Intel</h2>
           <h1 className="text-2xl font-bold text-white">The City of Joy</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-6">
        {/* Status Chip */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl glass ${status === SafetyStatus.SAFE ? 'border-emerald-500/30' : 'border-amber-500/30'}`}>
           <div className={`w-3 h-3 rounded-full ${status === SafetyStatus.SAFE ? 'bg-emerald-500 safe-glow' : 'bg-amber-500'}`} />
           <span className="text-sm font-semibold text-teal-50">
             {status === SafetyStatus.SAFE ? 'Sector Secure' : 'Active Caution'}
           </span>
           <div className="ml-auto">
             <Star className="text-yellow-400 inline" size={14} fill="currentColor" />
             <Star className="text-yellow-400 inline" size={14} fill="currentColor" />
             <Star className="text-yellow-400 inline" size={14} fill="currentColor" />
             <Star className="text-yellow-400 inline" size={14} fill="currentColor" />
             <Star className="text-white inline opacity-20" size={14} />
           </div>
        </div>

        {/* Gemini Advice Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.1em] font-bold text-teal-400 flex items-center gap-2">
              <Zap size={14} /> Voyager Safety Tips
            </h3>
          </div>
          <div className="bg-teal-900/20 rounded-2xl border border-teal-800/40 p-5">
            {loadingAdvice ? (
              <div className="space-y-2">
                <div className="h-3 w-3/4 bg-teal-800/40 animate-pulse rounded" />
                <div className="h-3 w-full bg-teal-800/40 animate-pulse rounded" />
              </div>
            ) : (
              <p className="text-sm text-teal-50/80 leading-relaxed italic">
                "{advice}"
              </p>
            )}
          </div>
        </div>

        {/* Recommendation Cards as seen in the image middle panel */}
        <div className="space-y-3">
           <h3 className="text-xs uppercase tracking-[0.1em] font-bold text-teal-400">Verified Safe Hubs</h3>
           <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
             {[
               { name: 'Park St. Safe Zone', img: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=200' },
               { name: 'Esplanade Metro', img: 'https://images.unsplash.com/photo-1517330357046-3ab5b5dd42a1?auto=format&fit=crop&q=80&w=200' },
               { name: 'Howrah Junction', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=200' }
             ].map((hub, i) => (
               <div key={i} className="min-w-[140px] bg-teal-900/40 rounded-2xl border border-teal-800/50 p-3 shrink-0">
                  <div className="h-20 bg-teal-800 rounded-xl mb-3 overflow-hidden">
                    <img src={hub.img} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-[11px] font-bold text-white mb-1">{hub.name}</h4>
                  <button className="text-[9px] text-teal-400 font-bold uppercase tracking-wider">Details</button>
               </div>
             ))}
           </div>
        </div>

        {/* Call to Action */}
        <button 
          onClick={onEmergencyTrigger}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-teal-900/40"
        >
          <Shield size={20} />
          ENABLE EMERGENCY OVERWATCH
        </button>
      </div>
    </div>
  );
};

export default HomeView;
