
import { DangerZone } from './types';

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
