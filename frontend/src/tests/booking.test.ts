import { describe, it, expect } from "vitest";
import { CreateBookingSchema, GetAvailableSlotsSchema } from "../lib/validations/booking";
import {
  calculateEndTime,
  hasTimeSlotConflict,
  generateAvailableTimeSlots,
  timeToMinutes,
} from "../lib/engines/booking-engine";

describe("Priority 3: Booking Engine - Validation & Mathematical Collision Tests", () => {
  describe("CreateBookingSchema Validation", () => {
    it("validates well-formed public booking payloads", () => {
      const payload = {
        businessId: "biz_999",
        serviceId: "srv_555",
        customerName: "Vikram Malhotra",
        customerPhone: "9876543210",
        customerEmail: "vikram@gmail.com",
        date: "2026-08-15",
        startTime: "14:30",
        paymentMethod: "UPI" as const,
      };
      expect(CreateBookingSchema.safeParse(payload).success).toBe(true);
    });

    it("rejects improperly formatted date and time strings", () => {
      const invalidDate = {
        businessId: "biz_1",
        serviceId: "srv_1",
        customerName: "Test",
        customerPhone: "9876543210",
        date: "15/08/2026",
        startTime: "2:30 PM",
      };
      const res = CreateBookingSchema.safeParse(invalidDate);
      expect(res.success).toBe(false);
    });
  });

  describe("Booking Engine Math & Time Slot Calculations", () => {
    it("calculates exact end times from start intervals and durations in minutes", () => {
      expect(calculateEndTime("09:30", 45)).toBe("10:15");
      expect(calculateEndTime("23:15", 60)).toBe("00:15");
      expect(calculateEndTime("11:00", 30)).toBe("11:30");
    });

    it("detects time slot overlap collisions accurately against active bookings", () => {
      const existing = [
        { startTime: "10:00", endTime: "11:00", status: "CONFIRMED" },
        { startTime: "14:00", endTime: "15:00", status: "CANCELLED" }, // Should ignore cancelled
      ];

      // Overlaps at end of slot
      expect(hasTimeSlotConflict("09:30", "10:30", existing)).toBe(true);
      // Overlaps completely inside
      expect(hasTimeSlotConflict("10:15", "10:45", existing)).toBe(true);
      // No overlap (before)
      expect(hasTimeSlotConflict("09:00", "10:00", existing)).toBe(false);
      // No overlap (after)
      expect(hasTimeSlotConflict("11:00", "12:00", existing)).toBe(false);
      // Overlap with CANCELLED slot should be allowed!
      expect(hasTimeSlotConflict("14:00", "15:00", existing)).toBe(false);
    });

    it("generates clean available scheduling intervals excluding booked hours", () => {
      const existing = [
        { startTime: "09:30", endTime: "10:30", status: "CONFIRMED" },
      ];
      const slots = generateAvailableTimeSlots("09:00", "12:00", 60, 30, existing);

      // 09:00-10:00 conflicts with 09:30-10:30 -> excluded
      // 09:30-10:30 conflicts -> excluded
      // 10:00-11:00 conflicts -> excluded
      // 10:30-11:30 ok! -> included
      // 11:00-12:00 ok! -> included
      expect(slots).not.toContain("09:00");
      expect(slots).not.toContain("09:30");
      expect(slots).not.toContain("10:00");
      expect(slots).toContain("10:30");
      expect(slots).toContain("11:00");
    });
  });
});
