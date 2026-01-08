
export interface Location {
  lat: number;
  lng: number;
}

export interface DangerZone {
  id: string;
  name: string;
  location: Location;
  radius: number; // in meters
}

export enum SafetyStatus {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  EMERGENCY = 'EMERGENCY'
}

export type View = 'onboarding' | 'home' | 'map' | 'emergency' | 'profile' | 'settings';
