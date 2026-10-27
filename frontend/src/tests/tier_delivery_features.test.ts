import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before imports
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({ get: vi.fn(), set: vi.fn(), delete: vi.fn() })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { mockSession, mockBusiness, mockPrisma } = vi.hoisted(() => {
  const mockSession = {
    user: { id: "user_test_123", email: "drsharma@example.com", name: "Dr. Sharma" },
  };

  const mockBusiness = {
    id: "biz_test_123",
    ownerId: "user_test_123",
    name: "Sharma Dental Clinic",
    slug: "sharma-dental",
    isPublished: true,
    websiteConfig: JSON.stringify({
      googleReviewUrl: "https://g.page/r/sharma-dental/review",
    }),
  };

  const mockPrisma = {
    business: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    booking: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      groupBy: vi.fn(),
    },
    staff: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    workingHours: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    enquiry: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    customer: {
      upsert: vi.fn(),
      count: vi.fn(),
    },
    service: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  return { mockSession, mockBusiness, mockPrisma };
});

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/api-client", () => ({
  DocodoBackendAPI: {
    dispatchWhatsAppMessage: vi.fn(() => Promise.resolve({ success: true, messageId: "wa_123" })),
    verifyNDRBooking: vi.fn(() => Promise.resolve({ success: true })),
    generateContent: vi.fn(() => Promise.resolve({ content: "AI content" })),
  },
}));

vi.mock("@/lib/services/entitlement-service", () => ({
  canConsume: vi.fn(() => Promise.resolve({ allowed: true })),
  recordUsage: vi.fn(() => Promise.resolve({ count: 1 })),
  getBusinessSubscription: vi.fn(() => Promise.resolve({ planId: "GROWTH" })),
  requireFeature: vi.fn(() => Promise.resolve(true)),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true })),
}));

vi.mock("@/lib/concurrency", () => ({
  runWithSerializationRetry: vi.fn((fn: any) => fn()),
  isSerializationConflict: vi.fn(() => false),
}));

import {
  updateBookingStatus,
  createStaffAction,
  deleteStaffAction,
  updateWorkingHoursAction,
  requireBusinessOwnership,
} from "../lib/actions/dashboard";
import { updateEnquiryStatus } from "../lib/actions/enquiry";
import { createPublicBooking } from "../lib/actions/booking";
import { DocodoBackendAPI } from "../lib/api-client";
import { POST as reviewAutomationRoute } from "../app/api/reviews/automation/route";
import { NextRequest } from "next/server";

describe("Docodo Commercial Tier Delivery Features Verification Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
    mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);
  });

  describe("1. Automated Google Review Collection Sequence", () => {
    it("automatically dispatches WhatsApp review collection when booking status is updated to COMPLETED", async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: "book_abc",
        businessId: "biz_test_123",
      });

      mockPrisma.booking.update.mockResolvedValue({
        id: "book_abc",
        businessId: "biz_test_123",
        customerPhone: "9876543210",
        customerName: "Rohan Varma",
        status: "COMPLETED",
        reviewSent: true,
        business: mockBusiness,
        service: { name: "Root Canal" },
      });

      const res = await updateBookingStatus("book_abc", "COMPLETED");

      expect(mockPrisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "book_abc" },
          data: expect.objectContaining({
            status: "COMPLETED",
            reviewSent: true,
          }),
        })
      );

      expect(DocodoBackendAPI.dispatchWhatsAppMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          businessId: "biz_test_123",
          recipientPhone: "9876543210",
          messageType: "REVIEW_REQUEST",
          customMessage: expect.stringContaining("https://g.page/r/sharma-dental/review"),
        })
      );
      expect(res.reviewSent).toBe(true);
    });

    it("falls back to slug review link when business has no explicit googleReviewUrl", async () => {
      const bizWithoutGoogleUrl = {
        id: "biz_test_123",
        ownerId: "user_test_123",
        name: "Sharma Dental Clinic",
        slug: "sharma-dental",
        websiteConfig: null,
      };

      mockPrisma.business.findFirst.mockResolvedValue(bizWithoutGoogleUrl);
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: "book_xyz",
        businessId: "biz_test_123",
      });

      mockPrisma.booking.update.mockResolvedValue({
        id: "book_xyz",
        businessId: "biz_test_123",
        customerPhone: "9123456789",
        customerName: "Aarav Gupta",
        status: "COMPLETED",
        reviewSent: true,
        business: bizWithoutGoogleUrl,
      });

      await updateBookingStatus("book_xyz", "COMPLETED");

      expect(DocodoBackendAPI.dispatchWhatsAppMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          customMessage: expect.stringContaining("sharma-dental"),
        })
      );
    });

    it("does not dispatch WhatsApp review when booking status is updated to CONFIRMED", async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: "book_confirmed",
        businessId: "biz_test_123",
      });

      mockPrisma.booking.update.mockResolvedValue({
        id: "book_confirmed",
        businessId: "biz_test_123",
        customerPhone: "9123456789",
        status: "CONFIRMED",
        reviewSent: false,
        business: mockBusiness,
      });

      const res = await updateBookingStatus("book_confirmed", "CONFIRMED");

      expect(DocodoBackendAPI.dispatchWhatsAppMessage).not.toHaveBeenCalled();
      expect(mockPrisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "book_confirmed" },
          data: { status: "CONFIRMED" },
        })
      );
      expect(res.reviewSent).toBe(false);
    });

    it("dispatches real WhatsApp review message via /api/reviews/automation POST route", async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: "book_api_1",
        businessId: "biz_test_123",
        customerPhone: "9988776655",
        customerName: "Sneha Patil",
        business: mockBusiness,
      });

      mockPrisma.booking.update.mockResolvedValue({
        id: "book_api_1",
        reviewSent: true,
      });

      const req = new NextRequest("https://docodo.in/api/reviews/automation", {
        method: "POST",
        body: JSON.stringify({ bookingId: "book_api_1" }),
      });

      const response = await reviewAutomationRoute(req);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(DocodoBackendAPI.dispatchWhatsAppMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          businessId: "biz_test_123",
          recipientPhone: "9988776655",
          messageType: "REVIEW_REQUEST",
          customMessage: expect.stringContaining("https://g.page/r/sharma-dental/review"),
        })
      );
      expect(mockPrisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "book_api_1" },
          data: { reviewSent: true },
        })
      );
    });

    it("returns 404 in /api/reviews/automation when booking does not exist", async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);

      const req = new NextRequest("https://docodo.in/api/reviews/automation", {
        method: "POST",
        body: JSON.stringify({ bookingId: "book_missing" }),
      });

      const response = await reviewAutomationRoute(req);
      expect(response.status).toBe(404);
    });

    it("returns 403 in /api/reviews/automation when booking belongs to another business", async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: "book_foreign",
        businessId: "biz_OTHER_999",
      });

      const req = new NextRequest("https://docodo.in/api/reviews/automation", {
        method: "POST",
        body: JSON.stringify({ bookingId: "book_foreign" }),
      });

      const response = await reviewAutomationRoute(req);
      expect(response.status).toBe(403);
    });
  });

  describe("2. Multi-Staff Management CRUD Actions & Ownership", () => {
    it("creates a new staff member with tenant ownership validation", async () => {
      const createdStaff = {
        id: "staff_101",
        businessId: "biz_test_123",
        name: "Dr. Ananya Roy",
        role: "Pediatric Dentist",
        phone: "9876000001",
        email: "ananya@sharmadental.in",
        isActive: true,
      };

      mockPrisma.staff.create.mockResolvedValue(createdStaff);

      const result = await createStaffAction({
        name: "Dr. Ananya Roy",
        role: "Pediatric Dentist",
        phone: "9876000001",
        email: "ananya@sharmadental.in",
      });

      expect(mockPrisma.staff.create).toHaveBeenCalledWith({
        data: {
          businessId: "biz_test_123",
          name: "Dr. Ananya Roy",
          role: "Pediatric Dentist",
          phone: "9876000001",
          email: "ananya@sharmadental.in",
          isActive: true,
        },
      });
      expect(result.id).toBe("staff_101");
    });

    it("rejects staff creation when name is empty", async () => {
      await expect(createStaffAction({ name: "" })).rejects.toThrow("Staff name is required.");
    });

    it("deletes a staff member after verifying business ownership", async () => {
      mockPrisma.staff.findUnique.mockResolvedValue({
        id: "staff_101",
        businessId: "biz_test_123",
      });
      mockPrisma.staff.delete.mockResolvedValue({ id: "staff_101" });

      const res = await deleteStaffAction("staff_101");

      expect(mockPrisma.staff.delete).toHaveBeenCalledWith({
        where: { id: "staff_101" },
      });
      expect(res.success).toBe(true);
    });

    it("prevents IDOR: rejects deletion if staff belongs to another business", async () => {
      mockPrisma.staff.findUnique.mockResolvedValue({
        id: "staff_other",
        businessId: "biz_OTHER_456",
      });

      await expect(deleteStaffAction("staff_other")).rejects.toThrow("Forbidden");
    });
  });

  describe("3. Enquiry Pipeline Status Transitions", () => {
    it("updates enquiry pipeline status to CONTACTED, BOOKED, or LOST", async () => {
      mockPrisma.enquiry.findUnique.mockResolvedValue({
        id: "enq_777",
        businessId: "biz_test_123",
        business: { ownerId: "user_test_123" },
      });
      mockPrisma.enquiry.update.mockResolvedValue({
        id: "enq_777",
        status: "CONTACTED",
      });

      const res = await updateEnquiryStatus("enq_777", "CONTACTED");

      expect(mockPrisma.enquiry.update).toHaveBeenCalledWith({
        where: { id: "enq_777" },
        data: { status: "CONTACTED" },
      });
      expect(res.status).toBe("CONTACTED");
    });

    it("rejects enquiry status update if merchant does not own the enquiry", async () => {
      mockPrisma.enquiry.findUnique.mockResolvedValue({
        id: "enq_alien",
        businessId: "biz_foreign",
        business: { ownerId: "user_stranger" },
      });

      await expect(updateEnquiryStatus("enq_alien", "BOOKED")).rejects.toThrow("Forbidden");
    });
  });

  describe("4. Working Hours Post-Onboarding Updates", () => {
    it("updates working hours by dayOfWeek number mapping", async () => {
      mockPrisma.workingHours.upsert.mockImplementation(({ create }: any) => Promise.resolve(create));

      const input = [
        { dayOfWeek: 1, openTime: "08:30", closeTime: "18:30", isOpen: true }, // MON
        { dayOfWeek: 0, openTime: "10:00", closeTime: "14:00", isOpen: false }, // SUN
      ];

      const res = await updateWorkingHoursAction(input);

      expect(mockPrisma.workingHours.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            businessId_day: {
              businessId: "biz_test_123",
              day: "MON",
            },
          },
          create: expect.objectContaining({
            day: "MON",
            openTime: "08:30",
            closeTime: "18:30",
            isOpen: true,
          }),
        })
      );

      expect(mockPrisma.workingHours.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            businessId_day: {
              businessId: "biz_test_123",
              day: "SUN",
            },
          },
          create: expect.objectContaining({
            day: "SUN",
            isOpen: false,
          }),
        })
      );
      expect(res.length).toBe(2);
    });

    it("updates working hours with custom break intervals", async () => {
      mockPrisma.workingHours.upsert.mockImplementation(({ create }: any) => Promise.resolve(create));

      const input = [
        {
          day: "MON",
          openTime: "09:00",
          closeTime: "19:00",
          isOpen: true,
          breakStart: "13:00",
          breakEnd: "14:00",
        },
      ];

      const res = await updateWorkingHoursAction(input);

      expect(mockPrisma.workingHours.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            businessId_day: {
              businessId: "biz_test_123",
              day: "MON",
            },
          },
          create: expect.objectContaining({
            day: "MON",
            breakStart: "13:00",
            breakEnd: "14:00",
          }),
        })
      );
      expect(res[0].breakStart).toBe("13:00");
    });

    it("rejects empty working hours payload", async () => {
      await expect(updateWorkingHoursAction([])).rejects.toThrow("Invalid working hours data");
    });
  });

  describe("5. Multi-Provider Round-Robin Allocation", () => {
    it("allocates booking to staff member with the fewest bookings on that date when staffId is omitted", async () => {
      const mockActiveStaff = [
        { id: "staff_doc_A" },
        { id: "staff_doc_B" },
      ];

      const txMock = {
        business: {
          findFirst: vi.fn().mockResolvedValue(mockBusiness),
        },
        service: {
          findUnique: vi.fn().mockResolvedValue({
            id: "srv_teeth_cleaning",
            businessId: "biz_test_123",
            duration: 30,
            price: 1500,
            isActive: true,
          }),
        },
        staff: {
          findMany: vi.fn().mockResolvedValue(mockActiveStaff),
        },
        booking: {
          // staff_doc_A has 2 bookings today, staff_doc_B has 0 bookings today
          groupBy: vi.fn().mockResolvedValue([
            { staffId: "staff_doc_A", _count: { id: 2 } },
          ]),
          findMany: vi.fn().mockResolvedValue([]), // No slot conflict
          create: vi.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: "book_new_rr", ...data })),
        },
        customer: {
          upsert: vi.fn().mockResolvedValue({ id: "cust_1" }),
        },
      };

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return callback(txMock);
      });

      const res = await createPublicBooking({
        businessId: "biz_test_123",
        serviceId: "srv_teeth_cleaning",
        customerName: "Kavita Rao",
        customerPhone: "9822001122",
        date: "2026-11-05",
        startTime: "11:00",
      });

      // Staff B has 0 bookings vs Staff A with 2 bookings -> Staff B selected
      expect(txMock.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            staffId: "staff_doc_B",
            businessId: "biz_test_123",
            customerName: "Kavita Rao",
          }),
        })
      );
      expect(res.staffId).toBe("staff_doc_B");
    });

    it("prioritizes unconflicted staff when the practitioner with fewer bookings is already booked at that slot", async () => {
      const mockActiveStaff = [
        { id: "staff_doc_A" },
        { id: "staff_doc_B" },
      ];

      const txMock = {
        business: {
          findFirst: vi.fn().mockResolvedValue(mockBusiness),
        },
        service: {
          findUnique: vi.fn().mockResolvedValue({
            id: "srv_teeth_cleaning",
            businessId: "biz_test_123",
            duration: 30,
            price: 1500,
            isActive: true,
          }),
        },
        staff: {
          findMany: vi.fn().mockResolvedValue(mockActiveStaff),
        },
        booking: {
          // Staff A has 1 booking today, Staff B has 2 bookings today
          groupBy: vi.fn().mockResolvedValue([
            { staffId: "staff_doc_A", _count: { id: 1 } },
            { staffId: "staff_doc_B", _count: { id: 2 } },
          ]),
          // Staff A is booked at 11:00-11:30, Staff B is booked at 14:00-14:30 and 15:00-15:30
          findMany: vi.fn().mockImplementation(({ where }: any) => {
            if (where?.staffId?.in) {
              return Promise.resolve([
                { staffId: "staff_doc_A", startTime: "11:00", endTime: "11:30", status: "CONFIRMED" },
                { staffId: "staff_doc_B", startTime: "14:00", endTime: "14:30", status: "CONFIRMED" },
                { staffId: "staff_doc_B", startTime: "15:00", endTime: "15:30", status: "CONFIRMED" },
              ]);
            }
            // For Step 5 final conflict check
            return Promise.resolve([]);
          }),
          create: vi.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: "book_rr_conflict_aware", ...data })),
        },
        customer: {
          upsert: vi.fn().mockResolvedValue({ id: "cust_1" }),
        },
      };

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return callback(txMock);
      });

      const res = await createPublicBooking({
        businessId: "biz_test_123",
        serviceId: "srv_teeth_cleaning",
        customerName: "Vikram Malhotra",
        customerPhone: "9833445566",
        date: "2026-11-05",
        startTime: "11:00",
      });

      // Staff B should be selected because Staff A has a conflict at 11:00
      expect(txMock.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            staffId: "staff_doc_B",
            businessId: "biz_test_123",
          }),
        })
      );
      expect(res.staffId).toBe("staff_doc_B");
    });

    it("respects explicit staffId if user specified a preferred doctor", async () => {
      const txMock = {
        business: {
          findFirst: vi.fn().mockResolvedValue(mockBusiness),
        },
        service: {
          findUnique: vi.fn().mockResolvedValue({
            id: "srv_teeth_cleaning",
            businessId: "biz_test_123",
            duration: 30,
            price: 1500,
            isActive: true,
          }),
        },
        staff: {
          findMany: vi.fn(),
        },
        booking: {
          findMany: vi.fn().mockResolvedValue([]),
          create: vi.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: "book_manual_staff", ...data })),
        },
        customer: {
          upsert: vi.fn().mockResolvedValue({ id: "cust_1" }),
        },
      };

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return callback(txMock);
      });

      const res = await createPublicBooking({
        businessId: "biz_test_123",
        serviceId: "srv_teeth_cleaning",
        staffId: "staff_preferred_doc",
        customerName: "Kavita Rao",
        customerPhone: "9822001122",
        date: "2026-11-05",
        startTime: "11:00",
      });

      // Should not query active staff for round robin when explicitly specified
      expect(txMock.staff.findMany).not.toHaveBeenCalled();
      expect(res.staffId).toBe("staff_preferred_doc");
    });
  });
});
