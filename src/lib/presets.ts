// Preset komponen berdasarkan tipe motor
// "Smart Presets" - User tidak perlu input manual

export interface ComponentPreset {
  id: string;
  name: string;
  km: number;
  month: number;
}

export interface BikePreset {
  label: string;
  parts: ComponentPreset[];
}

export const BIKE_PRESETS: Record<string, BikePreset> = {
  matic_honda: {
    label: "Matic Honda (Vario, Beat, Scoopy)",
    parts: [
      { id: "eng_oil", name: "Oli Mesin", km: 2000, month: 2 },
      { id: "gear_oil", name: "Oli Gardan", km: 8000, month: 6 },
      { id: "cvt_belt", name: "V-Belt", km: 24000, month: 24 },
      { id: "roller", name: "Roller", km: 24000, month: 24 },
      { id: "brake_f", name: "Kampas Rem Depan", km: 10000, month: 12 },
      { id: "brake_r", name: "Kampas Rem Belakang", km: 12000, month: 14 },
      { id: "tire_f", name: "Ban Depan", km: 15000, month: 18 },
      { id: "tire_r", name: "Ban Belakang", km: 12000, month: 12 },
      { id: "shock_f", name: "Shock Depan (Seal/Oli)", km: 20000, month: 24 },
      { id: "shock_r", name: "Shock Belakang", km: 30000, month: 36 },
      { id: "air_filter", name: "Filter Udara", km: 16000, month: 12 },
    ],
  },
  matic_yamaha: {
    label: "Matic Yamaha (NMAX, Aerox, Mio)",
    parts: [
      { id: "eng_oil", name: "Oli Mesin", km: 2000, month: 2 },
      { id: "gear_oil", name: "Oli Gardan", km: 8000, month: 6 },
      { id: "cvt_belt", name: "V-Belt", km: 20000, month: 24 },
      { id: "roller", name: "Roller", km: 20000, month: 24 },
      { id: "brake_f", name: "Kampas Rem Depan", km: 10000, month: 12 },
      { id: "brake_r", name: "Kampas Rem Belakang", km: 12000, month: 14 },
      { id: "tire_f", name: "Ban Depan", km: 15000, month: 18 },
      { id: "tire_r", name: "Ban Belakang", km: 12000, month: 12 },
      { id: "shock_f", name: "Shock Depan (Seal/Oli)", km: 20000, month: 24 },
      { id: "shock_r", name: "Shock Belakang", km: 30000, month: 36 },
      { id: "air_filter", name: "Filter Udara", km: 16000, month: 12 },
    ],
  },
  sport_yamaha: {
    label: "Sport Yamaha (Vixion, R15, MT-15)",
    parts: [
      { id: "eng_oil", name: "Oli Mesin", km: 3000, month: 2 },
      { id: "chain_kit", name: "Rantai & Gear", km: 15000, month: 12 },
      { id: "brake_f", name: "Kampas Rem Depan", km: 10000, month: 12 },
      { id: "brake_r", name: "Kampas Rem Belakang", km: 12000, month: 14 },
      { id: "tire_f", name: "Ban Depan", km: 15000, month: 18 },
      { id: "tire_r", name: "Ban Belakang", km: 12000, month: 12 },
      { id: "shock_f", name: "Shock Depan (Seal/Oli)", km: 20000, month: 24 },
      { id: "shock_r", name: "Shock Belakang", km: 30000, month: 36 },
      { id: "air_filter", name: "Filter Udara", km: 16000, month: 12 },
      { id: "spark_plug", name: "Busi", km: 10000, month: 12 },
      { id: "coolant", name: "Air Radiator", km: 20000, month: 24 },
    ],
  },
  sport_honda: {
    label: "Sport Honda (CBR, CB150R, Sonic)",
    parts: [
      { id: "eng_oil", name: "Oli Mesin", km: 3000, month: 2 },
      { id: "chain_kit", name: "Rantai & Gear", km: 15000, month: 12 },
      { id: "brake_f", name: "Kampas Rem Depan", km: 10000, month: 12 },
      { id: "brake_r", name: "Kampas Rem Belakang", km: 12000, month: 14 },
      { id: "tire_f", name: "Ban Depan", km: 15000, month: 18 },
      { id: "tire_r", name: "Ban Belakang", km: 12000, month: 12 },
      { id: "shock_f", name: "Shock Depan (Seal/Oli)", km: 20000, month: 24 },
      { id: "shock_r", name: "Shock Belakang", km: 30000, month: 36 },
      { id: "air_filter", name: "Filter Udara", km: 16000, month: 12 },
      { id: "spark_plug", name: "Busi", km: 10000, month: 12 },
      { id: "coolant", name: "Air Radiator", km: 20000, month: 24 },
    ],
  },
  bebek_honda: {
    label: "Bebek Honda (Supra, Revo, Blade)",
    parts: [
      { id: "eng_oil", name: "Oli Mesin", km: 2500, month: 2 },
      { id: "chain_kit", name: "Rantai & Gear", km: 15000, month: 12 },
      { id: "brake_f", name: "Kampas Rem Depan", km: 10000, month: 12 },
      { id: "brake_r", name: "Kampas Rem Belakang", km: 12000, month: 14 },
      { id: "tire_f", name: "Ban Depan", km: 18000, month: 24 },
      { id: "tire_r", name: "Ban Belakang", km: 15000, month: 18 },
      { id: "shock_r", name: "Shock Belakang", km: 30000, month: 36 },
      { id: "air_filter", name: "Filter Udara", km: 16000, month: 12 },
      { id: "spark_plug", name: "Busi", km: 10000, month: 12 },
    ],
  },
  bebek_yamaha: {
    label: "Bebek Yamaha (Jupiter, Vega)",
    parts: [
      { id: "eng_oil", name: "Oli Mesin", km: 2500, month: 2 },
      { id: "chain_kit", name: "Rantai & Gear", km: 15000, month: 12 },
      { id: "brake_f", name: "Kampas Rem Depan", km: 10000, month: 12 },
      { id: "brake_r", name: "Kampas Rem Belakang", km: 12000, month: 14 },
      { id: "tire_f", name: "Ban Depan", km: 18000, month: 24 },
      { id: "tire_r", name: "Ban Belakang", km: 15000, month: 18 },
      { id: "shock_r", name: "Shock Belakang", km: 30000, month: 36 },
      { id: "air_filter", name: "Filter Udara", km: 16000, month: 12 },
      { id: "spark_plug", name: "Busi", km: 10000, month: 12 },
    ],
  },
};

export type BikeType = keyof typeof BIKE_PRESETS;
