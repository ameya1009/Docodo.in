export interface BookingRecord {
  price: number;
  status: string;
  date?: string;
  createdAt?: Date | string;
}

export function calculateTotalRevenue(bookings: BookingRecord[]): number {
  return bookings
    .filter((b) => ["CONFIRMED", "COMPLETED"].includes(b.status))
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);
}

export function calculateCompletionRate(bookings: BookingRecord[]): number {
  if (bookings.length === 0) return 0;
  const completedOrConfirmed = bookings.filter((b) =>
    ["CONFIRMED", "COMPLETED"].includes(b.status)
  ).length;
  return Math.round((completedOrConfirmed / bookings.length) * 100);
}

export function calculateAverageOrderValue(totalRevenue: number, count: number): number {
  if (count <= 0 || !totalRevenue) return 0;
  return Math.round((totalRevenue / count) * 100) / 100;
}

export function getStatusBreakdown(bookings: BookingRecord[]): Record<string, number> {
  const counts: Record<string, number> = {
    CONFIRMED: 0,
    COMPLETED: 0,
    PENDING: 0,
    CANCELLED: 0,
    NO_SHOW: 0,
    NDR_HOLD: 0,
  };
  for (const b of bookings) {
    const s = b.status || "CONFIRMED";
    counts[s] = (counts[s] || 0) + 1;
  }
  return counts;
}

export function aggregateRevenueByDate(bookings: BookingRecord[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const b of bookings) {
    if (!["CONFIRMED", "COMPLETED"].includes(b.status) || !b.date) continue;
    const dateKey = b.date;
    map[dateKey] = (map[dateKey] || 0) + (Number(b.price) || 0);
  }
  return map;
}
