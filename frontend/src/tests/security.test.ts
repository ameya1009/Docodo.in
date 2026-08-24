import { describe, it, expect } from "vitest";
import { CreateBookingSchema, GetAvailableSlotsSchema, UpdateBookingStatusSchema } from "../lib/validations/booking";
import { CreateCustomerSchema, UpdateCustomerNotesSchema } from "../lib/validations/crm";
import { hasTimeSlotConflict, generateAvailableTimeSlots, calculateEndTime } from "../lib/engines/booking-engine";

describe("Security & Invariant Enforcement Tests", () => {
  describe("Booking Input Validation & SQLi/XSS Surface Restrictions", () => {
    it("rejects malicious payload with oversized text notes", () => {
      const maliciousPayload = {
        businessId: "biz_safe_123",
        serviceId: "srv_safe_456",
        customerName: "A".repeat(100), // Exceeds max 60 chars
        customerPhone: "9876543210",
        date: "2026-08-30",
        startTime: "11:00",
      };
      const result = CreateBookingSchema.safeParse(maliciousPayload);
      expect(result.success).toBe(false);
    });

    it("rejects invalid date formats to prevent malformed query parameters", () => {
      const payload = {
        businessId: "biz_123",
        serviceId: "srv_456",
        date: "30-08-2026", // Incorrect format (not YYYY-MM-DD)
      };
      expect(GetAvailableSlotsSchema.safeParse(payload).success).toBe(false);
    });

    it("restricts status updates strictly to allowed enum values", () => {
      const invalidStatus = {
        bookingId: "bk_123",
        status: "ADMIN_OVERRIDE_HACKED",
      };
      expect(UpdateBookingStatusSchema.safeParse(invalidStatus).success).toBe(false);

      const validStatus = {
        bookingId: "bk_123",
        status: "CONFIRMED" as const,
      };
      expect(UpdateBookingStatusSchema.safeParse(validStatus).success).toBe(true);
    });
  });

  describe("CRM Multi-Tenant Data Invariants", () => {
    it("requires businessId for customer creation", () => {
      const payload = {
        businessId: "",
        name: "Test Customer",
        phone: "9876543210",
      };
      expect(CreateCustomerSchema.safeParse(payload).success).toBe(false);
    });

    it("rejects customer notes exceeding maximum allowable storage limits", () => {
      const payload = {
        customerId: "cust_123",
        notes: "X".repeat(2001), // Exceeds max 2000 chars
      };
      expect(UpdateCustomerNotesSchema.safeParse(payload).success).toBe(false);
    });
  });

  describe("Time Slot Collision Engine Boundaries", () => {
    it("handles zero-minute and negative interval boundaries gracefully", () => {
      expect(calculateEndTime("10:00", 60)).toBe("11:00");
      expect(calculateEndTime("00:00", 15)).toBe("00:15");
    });

    it("prevents double-booking across exact boundary overlaps", () => {
      const activeBookings = [
        { startTime: "10:00", endTime: "11:00", status: "CONFIRMED" },
        { startTime: "11:30", endTime: "12:30", status: "PENDING" },
      ];

      // Exact match
      expect(hasTimeSlotConflict("10:00", "11:00", activeBookings)).toBe(true);
      // Partial overlap front
      expect(hasTimeSlotConflict("09:30", "10:30", activeBookings)).toBe(true);
      // Partial overlap back
      expect(hasTimeSlotConflict("10:30", "11:30", activeBookings)).toBe(true);
      // Clean slot between 11:00 and 11:30
      expect(hasTimeSlotConflict("11:00", "11:30", activeBookings)).toBe(false);
      // Clean slot after 12:30
      expect(hasTimeSlotConflict("12:30", "13:30", activeBookings)).toBe(false);
    });
  });
});
