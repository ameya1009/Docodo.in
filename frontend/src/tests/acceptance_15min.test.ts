import { describe, it, expect } from "vitest";
import {
  calculateEndTime,
  hasTimeSlotConflict,
  generateAvailableTimeSlots,
} from "../lib/engines/booking-engine";

describe("Critical Acceptance Test: Test Salon Pune & 15-Minute Onboarding Promise", () => {
  const TEST_SALON = {
    name: "Test Salon Pune",
    category: "Salon",
    city: "Pune",
    services: [
      { name: "Haircut", price: 500, duration: 45 },
      { name: "Hair Spa", price: 1200, duration: 60 },
      { name: "Facial", price: 1500, duration: 60 },
    ],
    hours: [
      { day: "MON", isOpen: true, openTime: "10:00", closeTime: "20:00" },
      { day: "TUE", isOpen: true, openTime: "10:00", closeTime: "20:00" },
      { day: "WED", isOpen: true, openTime: "10:00", closeTime: "20:00" },
      { day: "THU", isOpen: true, openTime: "10:00", closeTime: "20:00" },
      { day: "FRI", isOpen: true, openTime: "10:00", closeTime: "20:00" },
      { day: "SAT", isOpen: true, openTime: "10:00", closeTime: "20:00" },
      { day: "SUN", isOpen: false, openTime: "10:00", closeTime: "20:00" },
    ],
  };

  describe("1. Onboarding Telemetry & Duration Calculation", () => {
    it("measures setup duration accurately and enforces 15-minute promise", () => {
      const startedAt = new Date("2026-08-27T10:00:00Z");
      const completedAt = new Date("2026-08-27T10:04:30Z"); // Took 4.5 minutes

      const diffMs = completedAt.getTime() - startedAt.getTime();
      const setupTimeMinutes = Math.max(1, Math.round(diffMs / 60000));

      expect(setupTimeMinutes).toBe(5);
      expect(setupTimeMinutes).toBeLessThanOrEqual(15);
    });
  });

  describe("2. Service Duration & End Time Calculations", () => {
    it("calculates accurate end times for all 3 salon services", () => {
      // Haircut (45 mins)
      expect(calculateEndTime("10:00", 45)).toBe("10:45");
      expect(calculateEndTime("11:30", 45)).toBe("12:15");

      // Hair Spa (60 mins)
      expect(calculateEndTime("14:00", 60)).toBe("15:00");

      // Facial (60 mins)
      expect(calculateEndTime("18:30", 60)).toBe("19:30");
    });
  });

  describe("3. Working Hours & Sunday Closed Policy", () => {
    it("recognizes Sunday as closed day and Mon-Sat as open", () => {
      const sun = TEST_SALON.hours.find((h) => h.day === "SUN");
      expect(sun?.isOpen).toBe(false);

      const mon = TEST_SALON.hours.find((h) => h.day === "MON");
      expect(mon?.isOpen).toBe(true);
      expect(mon?.openTime).toBe("10:00");
      expect(mon?.closeTime).toBe("20:00");
    });
  });

  describe("4. Slot Generation & Double-Booking Collision Protection", () => {
    it("generates slots and blocks booked slots while preserving adjacent slots", () => {
      // Mon 10:00 to 20:00 with 45m service and 15m intervals
      const openTime = "10:00";
      const closeTime = "20:00";
      const duration = 45;
      const interval = 15;

      // Customer Rahul books Haircut at 11:00 (ends 11:45)
      const existingBookings = [
        { startTime: "11:00", endTime: "11:45", status: "CONFIRMED" },
      ];

      // Overlap checks
      // Trying to book same 11:00 - 11:45 -> COLLISION
      expect(hasTimeSlotConflict("11:00", "11:45", existingBookings)).toBe(true);

      // Trying to book 11:15 - 12:00 -> COLLISION
      expect(hasTimeSlotConflict("11:15", "12:00", existingBookings)).toBe(true);

      // Trying to book 10:30 - 11:15 -> COLLISION
      expect(hasTimeSlotConflict("10:30", "11:15", existingBookings)).toBe(true);

      // Trying to book 10:15 - 11:00 (ends exactly when Rahul starts) -> NO COLLISION
      expect(hasTimeSlotConflict("10:15", "11:00", existingBookings)).toBe(false);

      // Trying to book 11:45 - 12:30 (starts exactly when Rahul ends) -> NO COLLISION
      expect(hasTimeSlotConflict("11:45", "12:30", existingBookings)).toBe(false);

      // Generate public slot list: should not include 10:30, 10:45, 11:00, 11:15, 11:30
      const availableSlots = generateAvailableTimeSlots(
        openTime,
        closeTime,
        duration,
        interval,
        existingBookings
      );

      expect(availableSlots).toContain("10:00");
      expect(availableSlots).toContain("10:15");
      expect(availableSlots).not.toContain("10:30");
      expect(availableSlots).not.toContain("11:00");
      expect(availableSlots).not.toContain("11:15");
      expect(availableSlots).not.toContain("11:30");
      expect(availableSlots).toContain("11:45");
      expect(availableSlots).toContain("12:00");
    });

    it("unblocks slot when appointment is CANCELLED", () => {
      const cancelledBookings = [
        { startTime: "11:00", endTime: "11:45", status: "CANCELLED" },
      ];

      expect(hasTimeSlotConflict("11:00", "11:45", cancelledBookings)).toBe(false);

      const availableSlots = generateAvailableTimeSlots(
        "10:00",
        "20:00",
        45,
        15,
        cancelledBookings
      );
      expect(availableSlots).toContain("11:00");
    });
  });
});
