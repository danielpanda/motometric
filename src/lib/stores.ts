// Svelte Store dengan LocalStorage persistence
import { writable, derived, get } from "svelte/store";
import type { AppData, Bike, BikeComponent, AppSettings } from "./types";
import { BIKE_PRESETS } from "./presets";
import {
  generateId,
  getTodayISO,
  calculateAllComponentStatus,
  getNextService,
} from "./utils";

const STORAGE_KEY = "motometric_data";

// Default data
const defaultData: AppData = {
  settings: {
    theme: "dark",
    notifications_enabled: true,
  },
  garage: [],
  activeBikeId: null,
};

// Load from localStorage
function loadFromStorage(): AppData {
  if (typeof window === "undefined") return defaultData;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure all required fields exist
      return {
        ...defaultData,
        ...data,
        settings: { ...defaultData.settings, ...data.settings },
      };
    }
  } catch (e) {
    console.error("Failed to load data from localStorage:", e);
  }
  return defaultData;
}

// Save to localStorage
function saveToStorage(data: AppData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data to localStorage:", e);
  }
}

// Create the main store
function createAppStore() {
  const { subscribe, set, update } = writable<AppData>(defaultData);

  return {
    subscribe,

    // Initialize dari localStorage (call di onMount)
    init: () => {
      const data = loadFromStorage();
      set(data);
    },

    // Settings
    updateSettings: (newSettings: Partial<AppSettings>) => {
      update((data) => {
        const updated = {
          ...data,
          settings: { ...data.settings, ...newSettings },
        };
        saveToStorage(updated);
        return updated;
      });
    },

    toggleTheme: () => {
      update((data) => {
        const newTheme: 'light' | 'dark' = data.settings.theme === "dark" ? "light" : "dark";
        const updated = {
          ...data,
          settings: { ...data.settings, theme: newTheme },
        };
        saveToStorage(updated);
        return updated;
      });
    },

    // Garage management
    addBike: (
      name: string,
      type: string,
      currentOdometer: number,
      dailyUsageAvg: number,
      freshService: boolean
    ) => {
      const preset = BIKE_PRESETS[type];
      if (!preset) return;

      const today = getTodayISO();
      const bikeId = generateId();

      const components: BikeComponent[] = preset.parts.map((part) => ({
        id: part.id,
        name: part.name,
        intervalKm: part.km,
        intervalMonth: part.month,
        lastServiceKm: freshService
          ? currentOdometer
          : currentOdometer - Math.floor(part.km * 0.3),
        lastServiceDate: freshService
          ? today
          : (() => {
              const d = new Date();
              d.setMonth(d.getMonth() - Math.floor(part.month * 0.3));
              return d.toISOString().split("T")[0];
            })(),
        history: [],
      }));

      const newBike: Bike = {
        id: bikeId,
        name,
        type,
        currentOdometer,
        dailyUsageAvg,
        lastUpdated: today,
        components,
      };

      update((data) => {
        const updated = {
          ...data,
          garage: [...data.garage, newBike],
          activeBikeId: data.activeBikeId || bikeId,
        };
        saveToStorage(updated);
        return updated;
      });

      return bikeId;
    },

    removeBike: (bikeId: string) => {
      update((data) => {
        const newGarage = data.garage.filter((b) => b.id !== bikeId);
        const updated = {
          ...data,
          garage: newGarage,
          activeBikeId:
            data.activeBikeId === bikeId
              ? newGarage.length > 0
                ? newGarage[0].id
                : null
              : data.activeBikeId,
        };
        saveToStorage(updated);
        return updated;
      });
    },

    setActiveBike: (bikeId: string) => {
      update((data) => {
        const updated = { ...data, activeBikeId: bikeId };
        saveToStorage(updated);
        return updated;
      });
    },

    // Odometer update
    updateOdometer: (bikeId: string, newOdometer: number) => {
      update((data) => {
        const updated = {
          ...data,
          garage: data.garage.map((bike) =>
            bike.id === bikeId
              ? {
                  ...bike,
                  currentOdometer: newOdometer,
                  lastUpdated: getTodayISO(),
                }
              : bike
          ),
        };
        saveToStorage(updated);
        return updated;
      });
    },

    updateDailyUsage: (bikeId: string, dailyUsageAvg: number) => {
      update((data) => {
        const updated = {
          ...data,
          garage: data.garage.map((bike) =>
            bike.id === bikeId ? { ...bike, dailyUsageAvg } : bike
          ),
        };
        saveToStorage(updated);
        return updated;
      });
    },

    // Update nama motor
    updateBikeName: (bikeId: string, name: string) => {
      update((data) => {
        const updated = {
          ...data,
          garage: data.garage.map((bike) =>
            bike.id === bikeId ? { ...bike, name } : bike
          ),
        };
        saveToStorage(updated);
        return updated;
      });
    },

    // Service a component
    serviceComponent: (
      bikeId: string,
      componentId: string,
      date: string,
      km: number,
      notes?: string,
      cost?: number
    ) => {
      update((data) => {
        const updated = {
          ...data,
          garage: data.garage.map((bike) => {
            if (bike.id !== bikeId) return bike;

            return {
              ...bike,
              components: bike.components.map((comp) => {
                if (comp.id !== componentId) return comp;

                return {
                  ...comp,
                  lastServiceKm: km,
                  lastServiceDate: date,
                  history: [...comp.history, { date, km, notes, cost }],
                };
              }),
            };
          }),
        };
        saveToStorage(updated);
        return updated;
      });
    },

    // Add custom component
    addCustomComponent: (
      bikeId: string,
      name: string,
      intervalKm: number,
      intervalMonth: number
    ) => {
      const componentId = `custom_${Date.now()}`;

      update((data) => {
        const updated = {
          ...data,
          garage: data.garage.map((bike) => {
            if (bike.id !== bikeId) return bike;

            const newComponent: BikeComponent = {
              id: componentId,
              name,
              intervalKm,
              intervalMonth,
              lastServiceKm: bike.currentOdometer,
              lastServiceDate: getTodayISO(),
              history: [],
            };

            return {
              ...bike,
              components: [...bike.components, newComponent],
            };
          }),
        };
        saveToStorage(updated);
        return updated;
      });
    },

    // Remove component
    removeComponent: (bikeId: string, componentId: string) => {
      update((data) => {
        const updated = {
          ...data,
          garage: data.garage.map((bike) => {
            if (bike.id !== bikeId) return bike;

            return {
              ...bike,
              components: bike.components.filter((c) => c.id !== componentId),
            };
          }),
        };
        saveToStorage(updated);
        return updated;
      });
    },

    // Export data
    exportData: (): string => {
      const data = get(appStore);
      return JSON.stringify(data, null, 2);
    },

    // Import data
    importData: (jsonString: string): boolean => {
      try {
        const data = JSON.parse(jsonString) as AppData;
        // Basic validation
        if (!data.settings || !data.garage) {
          throw new Error("Invalid data format");
        }
        set(data);
        saveToStorage(data);
        return true;
      } catch (e) {
        console.error("Failed to import data:", e);
        return false;
      }
    },

    // Reset all data
    resetAll: () => {
      set(defaultData);
      saveToStorage(defaultData);
    },
  };
}

export const appStore = createAppStore();

// Derived stores for convenience
export const activeBike = derived(appStore, ($app) => {
  if (!$app.activeBikeId) return null;
  return $app.garage.find((b) => b.id === $app.activeBikeId) || null;
});

export const activeBikeStatus = derived(activeBike, ($bike) => {
  if (!$bike) return [];
  return calculateAllComponentStatus($bike);
});

export const nextServiceInfo = derived(activeBikeStatus, ($statuses) => {
  return getNextService($statuses);
});

export const garageCount = derived(appStore, ($app) => $app.garage.length);

export const isDarkTheme = derived(
  appStore,
  ($app) => $app.settings.theme === "dark"
);
