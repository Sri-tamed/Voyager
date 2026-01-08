
import React, { useState } from 'react';
import { User, Shield, Bell, CreditCard, ChevronRight, LogOut, Phone, MessageCircle, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { EmergencyContact } from '../types';

interface ProfileViewProps {
  contacts: EmergencyContact[];
  setContacts: React.Dispatch<React.SetStateAction<EmergencyContact[]>>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ contacts, setContacts }) => {
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
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

        <section>
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-teal-400 px-2 mb-3">Account Settings</h3>
          <div className="bg-teal-900/20 rounded-2xl border border-teal-800/40 overflow-hidden">
            <ProfileItem icon={<User size={18} />} label="Personal Information" />
            <ProfileItem icon={<Shield size={18} />} label="Privacy & Security" />
            <ProfileItem icon={<Bell size={18} />} label="Notification Preferences" />
            <ProfileItem icon={<CreditCard size={18} />} label="Payment Methods" border={false} />
          </div>
        </section>

        <button className="w-full flex items-center justify-center gap-2 py-8 text-rose-400 font-bold text-sm">
          <LogOut size={18} />
          Sign Out of Voyager
        </button>
      </div>

      {/* Management Modal */}
      {(isAdding || editingContact) && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full bg-[#0d2e2c] border border-white/10 rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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

const ProfileItem: React.FC<{ icon: React.ReactNode, label: string, border?: boolean }> = ({ icon, label, border = true }) => (
  <button className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${border ? 'border-b border-white/5' : ''}`}>
    <div className="text-teal-400">{icon}</div>
    <span className="text-sm text-teal-50 flex-1 text-left font-medium">{label}</span>
    <ChevronRight size={16} className="text-teal-400/30" />
  </button>
);

export default ProfileView;
