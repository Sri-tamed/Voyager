import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Shield, Home, User, AlertTriangle, X, Search, SlidersHorizontal, ArrowRight, Zap, MapPin, Star, Share2, RefreshCw, CheckCircle2, Phone, Volume2, ShieldAlert, MessageCircle, Loader2, Landmark, Navigation2, Target, HeartPulse, Building2, Info, CarFront, DownloadCloud, Plus, Trash2, Edit2, ChevronRight, LogOut, Bell, CreditCard, Eye, Map as MapIcon, Globe, Lock, EyeOff, ShieldCheck, PhoneCall } from 'lucide-react';

// Types
interface Location {
    lat: number;
    lng: number;
}

interface DangerZone {
    id: string;
    name: string;
    location: Location;
    radius: number;
}

interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relation: string;
    avatar?: string;
}

enum SafetyStatus {
    SAFE = 'SAFE',
    CAUTION = 'CAUTION',
    EMERGENCY = 'EMERGENCY'
}

type View = 'onboarding' | 'home' | 'map' | 'emergency' | 'profile' | 'settings';

// Mock service
const getSafetyAdvice = async (locationName: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "• Stay alert in crowded zones.\n• Keep your device secured.\n• Verify local transport.";
};

// Constants
const MOCK_DANGER_ZONES: DangerZone[] = [
    { id: '1', name: 'Sealdah Transit Perimeter', location: { lat: 22.5671, lng: 88.3712 }, radius: 400 },
    { id: '2', name: 'Park Circus Sector', location: { lat: 22.5392, lng: 88.3662 }, radius: 500 }
];

const INITIAL_CONTACTS: EmergencyContact[] = [
    { id: '1', name: 'Aarav Sharma', phone: '+919876543210', relation: 'Brother', avatar: 'https://i.pravatar.cc/150?u=aarav' },
    { id: '2', name: 'Priya Das', phone: '+918765432109', relation: 'Partner', avatar: 'https://i.pravatar.cc/150?u=priya' },
    { id: '3', name: 'Vikram Roy', phone: '+917654321098', relation: 'Father', avatar: 'https://i.pravatar.cc/150?u=vikram' }
];

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

// Onboarding View
const OnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    return (
        <div className="fixed inset-0 z-[6000] overflow-hidden flex flex-col">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000"
                    className="w-full h-full object-cover"
                    alt="Traveler"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/95 via-teal-900/40 to-transparent" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-12">
                <h1 className="text-4xl font-bold text-white mb-8">Welcome to Voyager!</h1>

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

                <button
                    onClick={onComplete}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white h-14 rounded-xl font-bold tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-teal-900/40"
                >
                    LOGIN
                </button>
            </div>
        </div>
    );
};

// Home View
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

const HomeView: React.FC<{ status: SafetyStatus; onEmergencyTrigger: () => void; userLocation: Location | null; contacts: EmergencyContact[] }> = ({ status, onEmergencyTrigger, userLocation, contacts }) => {
    const [tips, setTips] = useState<string[]>([]);
    const [loadingAdvice, setLoadingAdvice] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAdvice = useCallback(async () => {
        setLoadingAdvice(true);
        setIsRefreshing(true);
        const res = await getSafetyAdvice("Kolkata and West Bengal");
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

            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-7">
                <div className={`flex items-center gap-4 p-5 rounded-[2rem] transition-all duration-500 ${status === SafetyStatus.SAFE ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`} style={{ backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="relative flex items-center justify-center">
                        <div className={`absolute w-6 h-6 rounded-full animate-ping opacity-20 ${status === SafetyStatus.SAFE ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <div className={`w-3.5 h-3.5 rounded-full relative z-10 ${status === SafetyStatus.SAFE ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ boxShadow: status === SafetyStatus.SAFE ? '0 0 15px rgba(52,211,153,0.8)' : '0 0 15px rgba(251,191,36,0.8)' }} />
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
                                    <div key={idx} className="flex gap-4">
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

// Emergency View
const EmergencyView: React.FC<{ onExit: () => void; userLocation: Location | null; contacts: EmergencyContact[] }> = ({ onExit, userLocation, contacts }) => {
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
        <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-between p-6 overflow-y-auto">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="w-[150%] h-[150%] rounded-full bg-red-600" style={{ animation: 'pulse 2s infinite ease-in-out' }}></div>
            </div>

            <div className="relative w-full flex flex-col items-center gap-2 mt-8 shrink-0">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-2" style={{ boxShadow: '0 0 50px rgba(220,38,38,0.5)' }}>
                    <ShieldAlert size={40} className="text-white animate-bounce" />
                </div>
                <h1 className="text-3xl font-black text-red-600 tracking-tighter uppercase">Emergency</h1>
                <p className="text-white/60 text-center text-xs font-medium tracking-wide">
                    AUDIBLE ALARM ACTIVE<br/>TRANSMITTING LIVE POSITION
                </p>
            </div>

            <div className="relative w-full flex-1 mt-6 mb-4 overflow-y-auto">
                <div className="flex items-center justify-between px-2 mb-3">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Trusted Contacts</h3>
                </div>

                <div className="space-y-3">
                    {contacts.length > 0 ? contacts.map((contact) => (
                        <div key={contact.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3" style={{ backdropFilter: 'blur(12px)' }}>
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
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center" style={{ backdropFilter: 'blur(12px)' }}>
                            <AlertTriangle className="mx-auto text-white/20 mb-2" size={32} />
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">No trusted contacts configured</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative w-full space-y-3 shrink-0 pb-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl" style={{ backdropFilter: 'blur(12px)' }}>
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

                <button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onMouseLeave={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    className={`w-full h-20 bg-slate-900/80 border border-white/10 text-white font-bold flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 rounded-2xl ${isHolding ? 'scale-[0.98] bg-slate-900' : ''}`}
                    style={{ backdropFilter: 'blur(4px)' }}
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
    );
};

// Profile View
const ProfileView: React.FC<{ contacts: EmergencyContact[]; setContacts: React.Dispatch<React.SetStateAction<EmergencyContact[]>> }> = ({ contacts, setContacts }) => {
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [relation, setRelation] = useState('');

    const resetForm = () => {
        setName('');
        setPhone('');
        setRelation('');
        setEditingContact(null);
        setIsAdding(false);
    };

    const handleEdit = (contact: EmergencyContact) => {
        setEditingContact(contact);
        setName(contact.name);
        setPhone(contact.phone);
        setRelation(contact.relation);
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        setContacts(prev => prev.filter(c => c.id !== id));
    };

    const handleSave = () => {
        if (!name || !phone) return;

        if (editingContact) {
            setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, name, phone, relation } : c));
        } else {
            const newContact: EmergencyContact = {
                id: Date.now().toString(),
                name,
                phone,
                relation,
                avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
            };
            setContacts(prev => [...prev, newContact]);
        }
        resetForm();
    };

    return (
        <div className="h-full w-full flex flex-col bg-[#042f2e] overflow-y-auto pb-24 relative">
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

            <div className="px-6 space-y-6">
                <section>
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-teal-400">Trusted Network</h3>
                        <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full font-bold border border-teal-500/30 uppercase tracking-tighter">
              {contacts.length} / 5 Active
            </span>
                    </div>

                    <div className="space-y-3">
                        {contacts.map((contact) => (
                            <div key={contact.id} className="bg-teal-900/20 rounded-2xl border border-teal-800/40 p-4 flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-full border border-teal-500/30 overflow-hidden shrink-0">
                                    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">{contact.name}</h4>
                                    <p className="text-[10px] text-teal-400/60 font-medium uppercase tracking-wider">{contact.relation}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(contact)}
                                        className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 hover:bg-teal-500/20 transition-all"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(contact.id)}
                                        className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {contacts.length < 5 && !isAdding && !editingContact && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-4 bg-teal-600/10 border border-teal-500/30 border-dashed rounded-2xl text-teal-300 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-teal-600/20 transition-all"
                            >
                                <Plus size={16} />
                                Add New Trusted Contact
                            </button>
                        )}
                    </div>
                </section>

                <button className="w-full flex items-center justify-center gap-2 py-8 text-rose-400 font-bold text-sm">
                    <LogOut size={18} />
                    Sign Out of Voyager
                </button>
            </div>

            {(isAdding || editingContact) && (
                <div className="fixed inset-0 z-[7000] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-black/80" style={{ backdropFilter: 'blur(4px)' }} onClick={resetForm} />
                    <div className="relative w-full bg-[#0d2e2c] border border-white/10 rounded-[2rem] p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">
                                {editingContact ? 'Edit Contact' : 'New Contact'}
                            </h3>
                            <button onClick={resetForm} className="text-white/40"><X size={24}/></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1 block">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1 block">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. +91 98765 43210"
                                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1 block">Relation</label>
                                <input
                                    type="text"
                                    value={relation}
                                    onChange={(e) => setRelation(e.target.value)}
                                    placeholder="e.g. Family, Friend, Partner"
                                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={resetForm}
                                    className="flex-1 py-4 rounded-xl font-bold text-xs bg-white/5 text-white/60 uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-4 rounded-xl font-bold text-xs bg-teal-600 text-white uppercase tracking-widest shadow-lg shadow-teal-900/40"
                                >
                                    Save Intel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Settings View
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
                        <ToggleItem icon={<CarFront size={18} />} label="Live Traffic Overlays" />
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

const ToggleItem: React.FC<{ icon: React.ReactNode; label: string; defaultChecked?: boolean }> = ({ icon, label, defaultChecked = false }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="text-teal-400">{icon}</div>
            <span className="text-sm text-white font-medium">{label}</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="w-11 h-6 bg-teal-950/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
        </label>
    </div>
);

// Map View
const MapView: React.FC<{ userLocation: Location | null; status: SafetyStatus; contacts: EmergencyContact[] }> = ({ userLocation, status, contacts }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const userMarkerRef = useRef<any>(null);
    const landmarkLayerRef = useRef<any>(null);
    const trafficLayerRef = useRef<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [showTraffic, setShowTraffic] = useState(false);
    const [isLiveSharing, setIsLiveSharing] = useState(false);
    
    const shareTimerRef = useRef<any>(null);
    const locationRef = useRef<Location | null>(userLocation);

    // Update location ref whenever userLocation changes without triggering re-effects
    useEffect(() => {
        locationRef.current = userLocation;
    }, [userLocation]);

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

    // Map Recurring Share Logic - Every 60 seconds
    useEffect(() => {
        if (isLiveSharing && contacts.length > 0) {
            const share = () => {
                if (!locationRef.current) return;
                const primary = contacts[0];
                const link = `https://www.google.com/maps?q=${locationRef.current.lat},${locationRef.current.lng}`;
                const msg = encodeURIComponent(`📍 VOYAGER LIVE FEED: I'm currently here: ${link}`);
                window.open(`https://wa.me/${primary.phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
            };

            // Initial share
            share();
            
            // Set interval to 60 seconds
            shareTimerRef.current = setInterval(share, 60000);
        } else {
            if (shareTimerRef.current) clearInterval(shareTimerRef.current);
        }
        return () => { if (shareTimerRef.current) clearInterval(shareTimerRef.current); };
    }, [isLiveSharing, contacts]);

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

    useEffect(() => {
        // @ts-ignore
        const L = window.L;
        if (!mapRef.current || !L) return;

        if (showTraffic) {
            if (!trafficLayerRef.current) {
                trafficLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    opacity: 0.5,
                    zIndex: 100
                });
            }
            trafficLayerRef.current.addTo(mapRef.current);
        } else {
            if (trafficLayerRef.current) {
                trafficLayerRef.current.remove();
            }
        }
    }, [showTraffic]);

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
                    <div className="flex justify-between items-start">
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
                                onClick={() => setShowTraffic(!showTraffic)}
                                className={`w-14 h-14 ${showTraffic ? 'bg-amber-500' : 'bg-teal-950/80 backdrop-blur-xl'} rounded-2xl flex items-center justify-center border border-white/10 shadow-xl active:scale-90 transition-all`}
                                title="Toggle Live Traffic"
                            >
                                <CarFront size={24} className={showTraffic ? 'text-white' : 'text-teal-400'} />
                            </button>
                            <button 
                                onClick={() => setIsLiveSharing(!isLiveSharing)}
                                className={`w-14 h-14 ${isLiveSharing ? 'bg-emerald-500' : 'bg-teal-950/80 backdrop-blur-xl'} rounded-2xl flex items-center justify-center border border-white/10 shadow-xl active:scale-90 transition-all`}
                                title="Toggle Recurring Share"
                            >
                                {isLiveSharing ? <Loader2 size={24} className="text-white animate-spin" /> : <Share2 size={24} className="text-teal-400" />}
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

            {!isSearching && !selectedLandmark && (
                <div className="absolute bottom-28 left-6 right-6 z-[1000] flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-teal-900/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                        {isLiveSharing ? 'Live Telemetry Active' : showTraffic ? 'Live Traffic Overwatch' : 'Central Kolkata Sector'}
                      </h4>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <Target size={12} className="text-emerald-400" />
                        <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-black">Active Vigilance</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-teal-100/50 leading-relaxed font-bold italic">
                      {isLiveSharing ? `Updating ${contacts[0]?.name || 'contacts'} with live coordinates every 60s.` : showTraffic ? 'Emphasizing high-congestion zones and transit corridors.' : 'Voyager SW active. Map tiles are being cached for offline safety.'}
                    </p>
                  </div>
                </div>
            )}
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('onboarding');
    const [status, setStatus] = useState<SafetyStatus>(SafetyStatus.SAFE);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [showNotification, setShowNotification] = useState<string | null>(null);
    const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Load Leaflet library
    useEffect(() => {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(script);
        };
    }, []);

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
        <div className="flex flex-col h-screen w-full bg-[#042f2e] text-teal-50 overflow-hidden relative">
            <main className="flex-1 relative overflow-hidden">
                {renderView()}
            </main>

            {showNotification && (
                <div className="fixed top-12 left-4 right-4 z-[2000] bg-rose-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <span className="text-sm font-bold flex-1">{showNotification}</span>
                    <button onClick={() => setShowNotification(null)}><X size={18} /></button>
                </div>
            )}

            {currentView !== 'emergency' && (
                <div className="fixed bottom-6 left-6 right-6 z-[1000]">
                    <nav className="h-16 bg-teal-800/90 rounded-[2rem] border border-white/10 flex items-center justify-around px-4 shadow-2xl" style={{ backdropFilter: 'blur(24px)' }}>
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

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
    <button onClick={onClick} className={`p-2 transition-all duration-300 ${active ? 'text-white' : 'text-teal-400/50'}`}>
        {icon}
    </button>
);

export default App;