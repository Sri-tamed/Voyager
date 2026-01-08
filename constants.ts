
import { DangerZone, EmergencyContact } from './types';

export const MOCK_DANGER_ZONES: DangerZone[] = [
  {
    id: '1',
    name: 'Sealdah Transit Perimeter',
    location: { lat: 22.5671, lng: 88.3712 },
    radius: 400
  },
  {
    id: '2',
    name: 'Park Circus Sector',
    location: { lat: 22.5392, lng: 88.3662 },
    radius: 500
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Aarav Sharma', phone: '+919876543210', relation: 'Brother', avatar: 'https://i.pravatar.cc/150?u=aarav' },
  { id: '2', name: 'Priya Das', phone: '+918765432109', relation: 'Partner', avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: '3', name: 'Vikram Roy', phone: '+917654321098', relation: 'Father', avatar: 'https://i.pravatar.cc/150?u=vikram' },
  { id: '4', name: 'Ananya Sen', phone: '+916543210987', relation: 'Sister', avatar: 'https://i.pravatar.cc/150?u=ananya' },
  { id: '5', name: 'Rohan Mehta', phone: '+915432109876', relation: 'Best Friend', avatar: 'https://i.pravatar.cc/150?u=rohan' }
];

export const COLORS = {
  primary: '#0d9488',    // Teal 600
  secondary: '#134e4a',  // Teal 900
  accent: '#2dd4bf',     // Teal 400
  danger: '#f43f5e',     // Rose 500
  safe: '#10b981',       // Emerald 500
  text: '#f0fdfa',       // Teal 50
  muted: '#99f6e4',      // Teal 200
  background: '#042f2e'  // Deep Dark Teal
};
