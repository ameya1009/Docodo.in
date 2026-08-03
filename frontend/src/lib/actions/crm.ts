"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CreateCustomerSchema,
  UpdateCustomerNotesSchema,
  UpdateCustomerTagsSchema,
} from "@/lib/validations/crm";
import {
  parseTags,
  serializeTags,
  syncCustomerTagsWithTier,
} from "@/lib/engines/crm-engine";

export async function createCustomerAction(rawInput: {
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  tags?: string[];
  source?: "BOOKING" | "WHATSAPP" | "REFERRAL" | "WALK_IN" | "INSTAGRAM";
}) {
  const data = CreateCustomerSchema.parse(rawInput);

  // Apply automatic CRM tier evaluation
  const syncedTags = syncCustomerTagsWithTier(data.tags || [], 1, 0);
  const tagsJson = serializeTags(syncedTags);

  const customer = await prisma.customer.upsert({
    where: {
      businessId_phone: {
        businessId: data.businessId,
        phone: data.phone,
      },
    },
    update: {
      name: data.name,
      email: data.email || undefined,
      notes: data.notes || undefined,
      tags: tagsJson,
    },
    create: {
      businessId: data.businessId,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      notes: data.notes || null,
      tags: tagsJson,
      source: data.source,
      visitCount: 1,
      lifetimeValue: 0,
    },
  });

  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard");
  return customer;
}

export async function updateCustomerNotesAction(rawInput: {
  customerId: string;
  notes: string;
}) {
  const { customerId, notes } = UpdateCustomerNotesSchema.parse(rawInput);
  const updated = await prisma.customer.update({
    where: { id: customerId },
    data: { notes },
  });

  revalidatePath("/dashboard/customers");
  return updated;
}

export async function updateCustomerTagsAction(rawInput: {
  customerId: string;
  tags: string[];
}) {
  const { customerId, tags } = UpdateCustomerTagsSchema.parse(rawInput);
  const tagsJson = serializeTags(tags);

  const updated = await prisma.customer.update({
    where: { id: customerId },
    data: { tags: tagsJson },
  });

  revalidatePath("/dashboard/customers");
  return updated;
}

export async function syncCustomerTierAction(customerId: string) {
  if (!customerId) throw new Error("Customer ID required");
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) throw new Error("Customer not found in DB");

  const existingTags = parseTags(customer.tags);
  const synced = syncCustomerTagsWithTier(existingTags, customer.visitCount, customer.lifetimeValue);
  const newTagsJson = serializeTags(synced);

  const updated = await prisma.customer.update({
    where: { id: customerId },
    data: { tags: newTagsJson },
  });

  revalidatePath("/dashboard/customers");
  return updated;
}
