import { z } from "zod";

export const FilterDateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  period: z.enum(["TODAY", "WEEK", "MONTH", "ALL"]).default("ALL"),
});

export const GetDashboardStatsSchema = z.object({
  businessId: z.string().min(1, "Business ID required"),
  dateFilter: FilterDateRangeSchema.optional(),
});

export type FilterDateRange = z.infer<typeof FilterDateRangeSchema>;
export type GetDashboardStatsInput = z.infer<typeof GetDashboardStatsSchema>;
