
import React, { useState } from 'react';
import { Shield, ChevronRight, User, Lock, EyeOff } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-[6000] overflow-hidden flex flex-col">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover"
          alt="Traveler"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/95 via-teal-900/40 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-12">
        <h1 className="text-4xl font-bold text-white mb-8">Welcome !</h1>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-100/60">
              <User size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Username" 
              defaultValue="Traveler_Alpha"
              readOnly
              className="w-full bg-teal-950/40 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-teal-100/40 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-100/60">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              defaultValue="voyager2025"
              readOnly
              className="w-full bg-teal-950/40 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-teal-100/40 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-teal-100/60">
              <EyeOff size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-teal-400 text-teal-600 focus:ring-teal-400" />
            <span className="text-xs text-teal-100/80">Remember Me</span>
          </label>
          <button className="text-xs text-teal-100/80 hover:text-teal-400">Forgot Password?</button>
        </div>

        <button 
          onClick={onComplete}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white h-14 rounded-xl font-bold tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-teal-900/40"
        >
          LOGIN
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-teal-100/60 font-medium">
            Don't have an account? <span className="text-teal-400 font-bold ml-1 cursor-pointer">Signup</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
