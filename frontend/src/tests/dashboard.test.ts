import { describe, it, expect } from "vitest";
import { GetDashboardStatsSchema, FilterDateRangeSchema } from "../lib/validations/dashboard";
import {
  calculateTotalRevenue,
  calculateCompletionRate,
  calculateAverageOrderValue,
  getStatusBreakdown,
  aggregateRevenueByDate,
} from "../lib/engines/dashboard-engine";

describe("Priority 6: Dashboard Engine - Statistical Metrics & Analytics Tests", () => {
  describe("GetDashboardStatsSchema Validation", () => {
    it("validates dashboard metrics filter request", () => {
      const valid = {
        businessId: "biz_999",
        dateFilter: { period: "MONTH" as const },
      };
      expect(GetDashboardStatsSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects blank business IDs", () => {
      expect(GetDashboardStatsSchema.safeParse({ businessId: "" }).success).toBe(false);
    });
  });

  describe("Dashboard Domain Engine (dashboard-engine)", () => {
    const mockBookings = [
      { price: 500, status: "CONFIRMED", date: "2026-08-01" },
      { price: 1200, status: "COMPLETED", date: "2026-08-01" },
      { price: 800, status: "CANCELLED", date: "2026-08-02" },
      { price: 1500, status: "CONFIRMED", date: "2026-08-02" },
    ];

    it("calculates accurate total realized revenue by filtering out cancelled orders", () => {
      const total = calculateTotalRevenue(mockBookings);
      expect(total).toBe(500 + 1200 + 1500); // 3200 (ignores the 800 CANCELLED item)
    });

    it("computes appointment completion rate percentages safely without division by zero", () => {
      expect(calculateCompletionRate([])).toBe(0);
      expect(calculateCompletionRate(mockBookings)).toBe(75); // 3 out of 4 are CONFIRMED/COMPLETED
    });

    it("determines average order value with zero-division guard", () => {
      expect(calculateAverageOrderValue(3200, 3)).toBe(1066.67);
      expect(calculateAverageOrderValue(0, 0)).toBe(0);
    });

    it("aggregates revenue cleanly grouped by appointment date", () => {
      const byDate = aggregateRevenueByDate(mockBookings);
      expect(byDate["2026-08-01"]).toBe(1700);
      expect(byDate["2026-08-02"]).toBe(1500);
    });

    it("provides accurate booking status frequency counts", () => {
      const breakdown = getStatusBreakdown(mockBookings);
      expect(breakdown.CONFIRMED).toBe(2);
      expect(breakdown.COMPLETED).toBe(1);
      expect(breakdown.CANCELLED).toBe(1);
      expect(breakdown.NO_SHOW).toBe(0);
    });
  });
});
