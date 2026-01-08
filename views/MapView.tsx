
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Search, MapPin, Landmark, Navigation2, Target, X, ShieldCheck, HeartPulse, Building2, Info, Star, PhoneCall, AlertTriangle, DownloadCloud, CheckCircle2 } from 'lucide-react';
import { SafetyStatus, Location } from '../types';
import { MOCK_DANGER_ZONES } from '../constants';

interface MapViewProps {
  userLocation: Location | null;
  status: SafetyStatus;
}

interface LandmarkData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'park' | 'museum' | 'monument' | 'transport' | 'safety' | 'medical';
  description: string;
  safetyScore: number;
  safetyNote: string;
  contact?: string;
}

const KOLKATA_LANDMARKS: LandmarkData[] = [
  { 
    id: 'l1', 
    name: 'Victoria Memorial Hall', 
    lat: 22.5448, 
    lng: 88.3426, 
    type: 'monument', 
    description: 'Iconic marble building in Kolkata, a major tourist attraction with extensive gardens and high security.',
    safetyScore: 4.9,
    safetyNote: 'Designated safe zone. Heavy CISF/Police presence. Well-lit and family-friendly.',
    contact: '033 2223 1890'
  },
  { 
    id: 'l2', 
    name: 'Howrah Junction', 
    lat: 22.5851, 
    lng: 88.3468, 
    type: 'transport', 
    description: 'One of the largest and oldest railway complexes in India. Gateway to West Bengal.',
    safetyScore: 3.5,
    safetyNote: 'High crowd density. Transit police outposts available. Stay alert in subways.',
    contact: '139'
  },
  { 
    id: 'l3', 
    name: 'Indian Museum', 
    lat: 22.5579, 
    lng: 88.3511, 
    type: 'museum', 
    description: 'The largest and oldest museum in India, located in Central Kolkata.',
    safetyScore: 4.6,
    safetyNote: 'Excellent indoor security. Safe harbor during heavy rains or public disturbances.',
    contact: '033 2286 1699'
  },
  { 
    id: 'l4', 
    name: 'Eden Gardens', 
    lat: 22.5646, 
    lng: 88.3433, 
    type: 'park', 
    description: 'Legendary cricket stadium and surrounding Maidan area.',
    safetyScore: 4.2,
    safetyNote: 'Safe perimeter during daytime. Maidan areas can be dark at night; use main roads.'
  },
  { 
    id: 'l5', 
    name: 'Dakshineswar Kali Temple', 
    lat: 22.6550, 
    lng: 88.3575, 
    type: 'monument', 
    description: 'Historic Hindu temple on the eastern bank of the Hooghly River.',
    safetyScore: 4.7,
    safetyNote: 'Strict security checks at entrance. Very safe for solo pilgrims.'
  },
  { 
    id: 'l6', 
    name: 'SSKM Hospital (IPGMER)', 
    lat: 22.5398, 
    lng: 88.3444, 
    type: 'medical', 
    description: 'Premier government hospital and medical research institute in Kolkata.',
    safetyScore: 4.8,
    safetyNote: '24/7 Emergency trauma center. High police presence in vicinity.',
    contact: '033 2204 1100'
  },
  { 
    id: 'l7', 
    name: 'Voyager Safe Hub: Park Street', 
    lat: 22.5490, 
    lng: 88.3530, 
    type: 'safety', 
    description: 'Verified Voyager security outpost in the heart of Kolkata\'s dining district.',
    safetyScore: 5.0,
    safetyNote: 'Equipped with emergency SOS links, satellite comms, and verified local transport contacts.'
  }
];

const MapView: React.FC<MapViewProps> = ({ userLocation, status }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const landmarkLayerRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const categories = [
    { id: 'safety', label: 'Safe Hubs', icon: <ShieldCheck size={14} /> },
    { id: 'medical', label: 'Hospitals', icon: <HeartPulse size={14} /> },
    { id: 'monument', label: 'Cultural', icon: <Landmark size={14} /> },
    { id: 'transport', label: 'Transit', icon: <Building2 size={14} /> },
  ];

  const filteredResults = useMemo(() => {
    return KOLKATA_LANDMARKS.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? l.type === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const initMap = async () => {
      // @ts-ignore
      const L = window.L;
      if (!L) return;
      
      if (!mapRef.current) {
        const startPos: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [22.5726, 88.3639];
        mapRef.current = L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false
        }).setView(startPos, 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          crossOrigin: true 
        }).addTo(mapRef.current);

        MOCK_DANGER_ZONES.forEach(zone => {
          L.circle([zone.location.lat, zone.location.lng], {
            color: 'rgba(244, 63, 94, 0.4)',
            fillColor: 'rgba(244, 63, 94, 0.1)',
            fillOpacity: 0.3,
            radius: zone.radius,
            weight: 1,
            dashArray: '4, 6'
          }).addTo(mapRef.current);
        });

        landmarkLayerRef.current = L.layerGroup().addTo(mapRef.current);
        refreshMarkers();
      }
    };
    initMap();
  }, []);

  const refreshMarkers = () => {
    // @ts-ignore
    const L = window.L;
    if (!L || !landmarkLayerRef.current) return;
    
    landmarkLayerRef.current.clearLayers();
    KOLKATA_LANDMARKS.forEach(landmark => {
      const colorClass = landmark.type === 'safety' ? 'text-emerald-400' : 
                         landmark.type === 'medical' ? 'text-rose-400' : 'text-teal-400';
      const bgClass = landmark.type === 'safety' ? 'bg-emerald-500/20' : 
                      landmark.type === 'medical' ? 'bg-rose-500/20' : 'bg-teal-500/20';

      const landmarkIcon = L.divIcon({
        className: 'custom-landmark-icon',
        html: `
          <div class="flex flex-col items-center group">
            <div class="${bgClass} backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl ${colorClass} transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-1.9a2.44 2.44 0 0 1 3.45 0L10.3 21l1.9-1.9a2.44 2.44 0 0 1 3.45 0L17.55 21l1.9-1.9a2.44 2.44 0 0 1 3.45 0L24.8 21"/><path d="M9 18V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v13"/><path d="M5 18v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8"/></svg>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });
      
      const marker = L.marker([landmark.lat, landmark.lng], { icon: landmarkIcon }).addTo(landmarkLayerRef.current);
      marker.on('click', () => {
        setSelectedLandmark(landmark);
        mapRef.current.setView([landmark.lat, landmark.lng], 16, { animate: true });
      });
    });
  };

  useEffect(() => {
    // @ts-ignore
    const L = window.L;
    if (userLocation && mapRef.current && L) {
      if (!userMarkerRef.current) {
        const userIcon = L.divIcon({
          className: 'custom-user-icon',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-10 h-10 bg-teal-400/20 rounded-full animate-ping"></div>
              <div class="w-6 h-6 bg-teal-400 border-2 border-white rounded-full shadow-[0_0_25px_rgba(45,212,191,0.6)] flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(mapRef.current);
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
    }
  }, [userLocation]);

  const selectResult = (landmark: LandmarkData) => {
    setSelectedLandmark(landmark);
    if (mapRef.current) {
      mapRef.current.setView([landmark.lat, landmark.lng], 16, { animate: true });
    }
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 2500);
  };

  const recenter = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo([userLocation.lat, userLocation.lng], { animate: true });
    }
  };

  const handleStartNavigation = (landmark: LandmarkData) => {
    // Open navigation in a new tab using standard URL schemes
    // 'travelmode=walking' is usually safer for tight city navigation in Kolkata landmarks
    const url = `https://www.google.com/maps/dir/?api=1&destination=${landmark.lat},${landmark.lng}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-[#042f2e]">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      
      {/* Search & Interface Overlays */}
      <div className="absolute top-12 left-6 right-6 z-[2000] flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search West Bengal destinations..." 
            value={searchQuery}
            onFocus={() => setIsSearching(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-teal-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl py-4.5 pl-12 pr-12 text-teal-50 placeholder-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-2xl"
          />
          {(searchQuery || isSearching) && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
                setSelectedCategory(null);
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-teal-400"
            >
              <X size={20} />
            </button>
          )}

          {/* Search Dropdown */}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-teal-950/95 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-300 max-h-[60vh] overflow-y-auto">
              <div className="flex gap-2 p-4 border-b border-white/5 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                      selectedCategory === cat.id 
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                        : 'bg-white/5 text-teal-300 hover:bg-white/10'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="py-2">
                {filteredResults.length > 0 ? (
                  filteredResults.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => selectResult(res)}
                      className="w-full flex items-center gap-5 px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        res.type === 'safety' ? 'bg-emerald-500/10 text-emerald-400' : 
                        res.type === 'medical' ? 'bg-rose-500/10 text-rose-400' : 'bg-teal-500/10 text-teal-400'
                      }`}>
                        {res.type === 'safety' ? <ShieldCheck size={22} /> : <MapPin size={22} />}
                      </div>
                      <div className="text-left overflow-hidden">
                        <h4 className="text-sm font-bold text-white truncate">{res.name}</h4>
                        <p className="text-[10px] text-teal-400/50 truncate uppercase tracking-widest font-bold mt-0.5">{res.type}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <AlertTriangle size={32} className="mx-auto text-teal-400/20 mb-3" />
                    <p className="text-xs text-teal-400/40 font-bold uppercase tracking-[0.2em]">No local data found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!isSearching && !selectedLandmark && (
          <div className="flex justify-between items-center">
            <div className="bg-teal-950/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${status === SafetyStatus.SAFE ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-amber-400 animate-pulse'}`}></div>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-teal-50">Sector: Kolkata West</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={recenter}
                className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl active:scale-90 transition-all"
              >
                <Navigation2 size={24} className="text-white fill-white/20" />
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className={`w-14 h-14 bg-teal-950/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-xl active:scale-90 transition-all ${isDownloading ? 'opacity-50' : ''}`}
              >
                {downloaded ? <CheckCircle2 size={24} className="text-emerald-400" /> : <DownloadCloud size={24} className={isDownloading ? 'animate-bounce text-teal-400' : 'text-teal-400'} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LANDMARK BOTTOM SHEET */}
      {selectedLandmark && (
        <div className="absolute inset-x-0 bottom-0 z-[3000] animate-in slide-in-from-bottom-full duration-500 ease-out">
           <div className="absolute -top-[100vh] inset-x-0 h-[100vh] bg-black/40 backdrop-blur-[2px]" onClick={() => setSelectedLandmark(null)} />
           
           <div className="bg-teal-950/95 backdrop-blur-3xl border-t border-white/10 rounded-t-[3rem] p-8 pb-10 shadow-[0_-30px_60px_rgba(0,0,0,0.6)] relative">
             <div className="w-14 h-1.5 bg-white/10 rounded-full mx-auto mb-8 cursor-pointer active:bg-white/20" onClick={() => setSelectedLandmark(null)} />
             
             <div className="flex justify-between items-start mb-8">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                      selectedLandmark.type === 'safety' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      selectedLandmark.type === 'medical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                      'bg-teal-500/10 border-teal-500/20 text-teal-400'
                    }`}>
                      {selectedLandmark.type}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                      <Star size={12} fill="#fbbf24" className="text-yellow-400" />
                      <span className="text-xs font-black text-yellow-400">{selectedLandmark.safetyScore}</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight leading-tight">{selectedLandmark.name}</h2>
               </div>
               <button 
                 onClick={() => setSelectedLandmark(null)}
                 className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 transition-all active:scale-90"
               >
                 <X size={24} />
               </button>
             </div>

             <div className="space-y-8">
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Location Intel</h4>
                  <p className="text-sm text-teal-50/70 leading-relaxed font-medium">{selectedLandmark.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-teal-900/40 border border-teal-500/20 rounded-3xl p-5 flex flex-col gap-3">
                    <ShieldCheck size={24} className="text-teal-400" />
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-teal-400 mb-1">Voyager Alert</h4>
                      <p className="text-[11px] text-teal-50/60 leading-tight font-medium">{selectedLandmark.safetyNote}</p>
                    </div>
                  </div>
                  
                  {selectedLandmark.contact && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
                      <PhoneCall size={24} className="text-white/60" />
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-1">Contact</h4>
                        <p className="text-[11px] text-white font-mono tracking-wider">{selectedLandmark.contact}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => handleStartNavigation(selectedLandmark)}
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white h-16 rounded-[1.5rem] font-black text-sm tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-teal-900/50 transition-all active:scale-95 group"
                  >
                    <Navigation2 size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    START NAVIGATION
                  </button>
                  <button className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
                    <Target size={24} />
                  </button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Default Bottom Stats Card */}
      {!isSearching && !selectedLandmark && (
        <div className="absolute bottom-28 left-6 right-6 z-[1000] flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-700">
          <div className="bg-teal-900/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Central Kolkata Sector</h4>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Target size={12} className="text-emerald-400" />
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-black">Active Vigilance</span>
              </div>
            </div>
            <p className="text-[11px] text-teal-100/50 leading-relaxed font-bold italic">
              {isDownloading ? 'Caching current map tiles for offline overwatch...' : 'Voyager SW active. Map tiles are being cached for offline safety.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
