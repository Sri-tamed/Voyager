
import React from 'react';
import { User, Shield, Bell, CreditCard, ChevronRight, LogOut, Settings } from 'lucide-react';

const ProfileView: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col bg-[#042f2e] overflow-y-auto pb-24">
      <div className="p-8 pt-16 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full border-4 border-teal-500/30 p-1 mb-4">
          <img 
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" 
            className="w-full h-full object-cover rounded-full"
            alt="Profile"
          />
        </div>
        <h2 className="text-xl font-bold text-white">Traveler_Alpha</h2>
        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mt-1">Premium Voyager Member</p>
      </div>

      <div className="px-6 space-y-4">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-teal-400 px-2">Account Settings</h3>
        
        <div className="bg-teal-900/20 rounded-2xl border border-teal-800/40 overflow-hidden">
          <ProfileItem icon={<User size={18} />} label="Personal Information" />
          <ProfileItem icon={<Shield size={18} />} label="Privacy & Security" />
          <ProfileItem icon={<Bell size={18} />} label="Notification Preferences" />
          <ProfileItem icon={<CreditCard size={18} />} label="Payment Methods" border={false} />
        </div>

        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-teal-400 px-2 pt-4">Safety Network</h3>
        <div className="bg-teal-900/20 rounded-2xl border border-teal-800/40 p-4">
          <div className="flex items-center justify-between mb-4">
             <span className="text-sm text-white">Emergency Contacts</span>
             <span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full font-bold">3 Active</span>
          </div>
          <button className="w-full py-3 bg-teal-600/20 border border-teal-500/30 rounded-xl text-teal-300 text-xs font-bold uppercase tracking-widest">
            Manage Trusted Circles
          </button>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-4 text-rose-400 font-bold text-sm mt-4">
          <LogOut size={18} />
          Sign Out of Voyager
        </button>
      </div>
    </div>
  );
};

const ProfileItem: React.FC<{ icon: React.ReactNode, label: string, border?: boolean }> = ({ icon, label, border = true }) => (
  <button className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${border ? 'border-b border-white/5' : ''}`}>
    <div className="text-teal-400">{icon}</div>
    <span className="text-sm text-teal-50 flex-1 text-left font-medium">{label}</span>
    <ChevronRight size={16} className="text-teal-400/30" />
  </button>
);

export default ProfileView;
