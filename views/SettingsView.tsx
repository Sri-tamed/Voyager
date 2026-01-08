
import React from 'react';
import { SlidersHorizontal, Eye, Volume2, Map as MapIcon, Globe, Info } from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col bg-[#042f2e] overflow-y-auto pb-24">
      <div className="p-8 pt-16">
        <h1 className="text-2xl font-bold text-white mb-2">Voyager Filters</h1>
        <p className="text-teal-400/60 text-xs font-medium uppercase tracking-widest">Optimize your safety experience</p>
      </div>

      <div className="px-6 space-y-6">
        <section className="space-y-4">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-teal-400 px-2">Map Visibility</h3>
          <div className="bg-teal-900/20 rounded-2xl border border-teal-800/40 p-4 space-y-4">
            <ToggleItem icon={<MapIcon size={18} />} label="Show Danger Zones" defaultChecked />
            <ToggleItem icon={<Eye size={18} />} label="Heatmap Intensity" defaultChecked />
            <ToggleItem icon={<Globe size={18} />} label="Satellite Overlays" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-teal-400 px-2">Audio Alerts</h3>
          <div className="bg-teal-900/20 rounded-2xl border border-teal-800/40 p-4 space-y-4">
            <ToggleItem icon={<Volume2 size={18} />} label="Emergency Siren" defaultChecked />
            <ToggleItem icon={<Info size={18} />} label="Voice Guidance" />
          </div>
        </section>

        <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20">
          <p className="text-[11px] text-teal-100/60 leading-relaxed italic">
            "Voyager settings are synced across your safety network. Any changes here will reflect in your real-time telemetry feed."
          </p>
        </div>
      </div>
    </div>
  );
};

const ToggleItem: React.FC<{ icon: React.ReactNode, label: string, defaultChecked?: boolean }> = ({ icon, label, defaultChecked = false }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="text-teal-400">{icon}</div>
      <span className="text-sm text-white font-medium">{label}</span>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-teal-950/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
    </label>
  </div>
);

export default SettingsView;
