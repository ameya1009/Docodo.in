export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMins = timeToMinutes(startTime);
  const endMins = startMins + durationMinutes;
  return minutesToTime(endMins);
}

export interface BookingTimeInterval {
  startTime: string;
  endTime: string;
  status: string;
}

export function hasTimeSlotConflict(
  candidateStart: string,
  candidateEnd: string,
  existingBookings: BookingTimeInterval[]
): boolean {
  const candStartMins = timeToMinutes(candidateStart);
  const candEndMins = timeToMinutes(candidateEnd);

  for (const existing of existingBookings) {
    // Ignore cancelled or rejected bookings
    if (existing.status === "CANCELLED" || existing.status === "NO_SHOW") continue;

    const existStartMins = timeToMinutes(existing.startTime);
    const existEndMins = timeToMinutes(existing.endTime);

    // Two intervals overlap if candStart < existEnd AND candEnd > existStart
    if (candStartMins < existEndMins && candEndMins > existStartMins) {
      return true;
    }
  }

  return false;
}

export function generateAvailableTimeSlots(
  openTime: string,
  closeTime: string,
  serviceDuration: number,
  intervalMinutes: number = 30,
  existingBookings: BookingTimeInterval[] = []
): string[] {
  const openMins = timeToMinutes(openTime);
  const closeMins = timeToMinutes(closeTime);
  const slots: string[] = [];

  for (let current = openMins; current + serviceDuration <= closeMins; current += intervalMinutes) {
    const slotStart = minutesToTime(current);
    const slotEnd = minutesToTime(current + serviceDuration);

    if (!hasTimeSlotConflict(slotStart, slotEnd, existingBookings)) {
      slots.push(slotStart);
    }
  }

  return slots;
}
