// Type definitions untuk MotoMetric

export interface ServiceHistory {
  date: string;
  km: number;
  notes?: string;
  cost?: number;
}

export interface BikeComponent {
  id: string;
  name: string;
  intervalKm: number;
  intervalMonth: number;
  lastServiceKm: number;
  lastServiceDate: string;
  history: ServiceHistory[];
}

export interface Bike {
  id: string;
  name: string;
  type: string;
  currentOdometer: number;
  dailyUsageAvg: number;
  lastUpdated: string;
  components: BikeComponent[];
}

export interface AppSettings {
  theme: "light" | "dark";
  notifications_enabled: boolean;
}

export interface AppData {
  settings: AppSettings;
  garage: Bike[];
  activeBikeId: string | null;
}

export interface ComponentStatus {
  component: BikeComponent;
  kmPercent: number;
  timePercent: number;
  maxPercent: number;
  status: "safe" | "warning" | "danger";
  remainingKm: number;
  remainingDays: number;
  estimatedServiceDate: string;
}
