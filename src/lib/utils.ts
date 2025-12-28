// Utility functions untuk kalkulasi Dual Trigger System

import type { BikeComponent, ComponentStatus, Bike } from "./types";

/**
 * Menghitung selisih hari antara dua tanggal
 */
export function daysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format tanggal ke string Indonesia
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format angka dengan separator ribuan
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("id-ID");
}

/**
 * Generate ID unik
 */
export function generateId(): string {
  return `bike_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get tanggal hari ini dalam format ISO
 */
export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Menghitung status komponen dengan Dual Trigger System
 */
export function calculateComponentStatus(
  component: BikeComponent,
  currentOdometer: number,
  dailyUsageAvg: number
): ComponentStatus {
  const today = getTodayISO();

  // Trigger KM: %KM = ((OdometerSekarang - KM_ServisTerakhir) / IntervalKM) * 100
  const kmUsed = currentOdometer - component.lastServiceKm;
  const kmPercent = Math.round((kmUsed / component.intervalKm) * 100);

  // Trigger Waktu: %Waktu = ((HariIni - Tanggal_ServisTerakhir) / (IntervalBulan * 30)) * 100
  const daysUsed = daysDifference(component.lastServiceDate, today);
  const intervalDays = component.intervalMonth * 30;
  const timePercent = Math.round((daysUsed / intervalDays) * 100);

  // Ambil yang paling parah
  const maxPercent = Math.max(kmPercent, timePercent);

  // Sisa KM dan hari
  const remainingKm = Math.max(0, component.intervalKm - kmUsed);
  const remainingDaysFromKm = Math.round(remainingKm / dailyUsageAvg);
  const remainingDaysFromTime = Math.max(0, intervalDays - daysUsed);
  const remainingDays = Math.min(remainingDaysFromKm, remainingDaysFromTime);

  // Estimasi tanggal servis berikutnya
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + remainingDays);
  const estimatedServiceDate = estimatedDate.toISOString().split("T")[0];

  // Status warna
  let status: "safe" | "warning" | "danger";
  if (maxPercent < 80) {
    status = "safe";
  } else if (maxPercent < 100) {
    status = "warning";
  } else {
    status = "danger";
  }

  return {
    component,
    kmPercent,
    timePercent,
    maxPercent,
    status,
    remainingKm,
    remainingDays,
    estimatedServiceDate,
  };
}

/**
 * Menghitung semua status komponen untuk satu motor
 */
export function calculateAllComponentStatus(bike: Bike): ComponentStatus[] {
  return bike.components.map((comp) =>
    calculateComponentStatus(comp, bike.currentOdometer, bike.dailyUsageAvg)
  );
}

/**
 * Mencari komponen dengan servis terdekat
 */
export function getNextService(
  statuses: ComponentStatus[]
): ComponentStatus | null {
  if (statuses.length === 0) return null;

  // Filter yang belum lewat 100%, atau jika semua sudah lewat, ambil yang paling urgent
  const sorted = [...statuses].sort((a, b) => b.maxPercent - a.maxPercent);
  return sorted[0];
}

/**
 * Menghitung total estimasi biaya servis dalam periode tertentu
 */
export function estimateCostInPeriod(
  statuses: ComponentStatus[],
  days: number
): { components: ComponentStatus[]; totalCost: number } {
  const upcoming = statuses.filter((s) => s.remainingDays <= days);
  const totalCost = upcoming.reduce((sum, s) => {
    // Check last history for cost reference
    const lastCost =
      s.component.history.length > 0
        ? s.component.history[s.component.history.length - 1].cost || 0
        : 0;
    return sum + lastCost;
  }, 0);

  return { components: upcoming, totalCost };
}
