import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://undxnktmncfunryhjmlm.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_u89PIOiarYqQ80NIIDc0BQ_O6wHN-yz";

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface DBUser {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  password: string | null;
  role: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBBusiness {
  id: string;
  slug: string;
  name: string;
  industry: string;
  tagline: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  isPublished: boolean;
  onboardingComplete: boolean;
  onboardingStep: number;
  setupTimeMinutes?: number;
  ownerId?: string | null;
  websiteConfig?: string | null;
  style?: string | null;
  primaryColor?: string | null;
  accentColor?: string | null;
  fontHeading?: string | null;
  fontBody?: string | null;
  darkMode?: boolean;
  seoTitle?: string | null;
  seoDesc?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const db = {
  user: {
    async findUnique({ where }: { where: { email?: string; id?: string } }): Promise<DBUser | null> {
      let query = supabaseAdmin.from("User").select("*");
      if (where.email) query = query.eq("email", where.email.toLowerCase().trim());
      if (where.id) query = query.eq("id", where.id);
      
      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.warn("[Supabase DB] user.findUnique error:", error);
      }
      return data || null;
    },

    async findFirst({ where, include }: any): Promise<any> {
      let query = supabaseAdmin.from("User").select("*");
      if (where?.id) query = query.eq("id", where.id);
      if (where?.email) query = query.eq("email", where.email.toLowerCase().trim());

      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.warn("[Supabase DB] user.findFirst error:", error);
      }
      if (!data) return null;

      if (include?.businesses) {
        const businesses = await db.business.findMany({ where: { ownerId: data.id } });
        return { ...data, businesses };
      }
      return data;
    },

    async create({ data }: { data: { id?: string; name: string; email: string; password?: string; role?: string; plan?: string } }): Promise<DBUser> {
      const id = data.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      const payload = {
        id,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: data.password || null,
        role: data.role || "OWNER",
        plan: data.plan || "STARTER",
        updatedAt: now,
      };

      const { data: created, error } = await supabaseAdmin.from("User").insert([payload]).select().single();
      if (error) {
        console.error("[Supabase DB] user.create error:", error);
        throw new Error(error.message || "Failed to create user record");
      }
      return created;
    },
  },

  business: {
    async findFirst({ where, include, select }: any): Promise<any> {
      let query = supabaseAdmin.from("Business").select("*");
      if (where?.ownerId) query = query.eq("ownerId", where.ownerId);
      if (where?.slug) query = query.eq("slug", where.slug);
      if (where?.id) query = query.eq("id", where.id);

      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.warn("[Supabase DB] business.findFirst error:", error);
      }
      if (!data) return null;

      const result: any = { ...data };
      if (include?.services) {
        result.services = await db.service.findMany({ where: { businessId: data.id } });
      }
      if (include?.staff) {
        result.staff = [];
      }
      if (include?.workingHours) {
        result.workingHours = await db.workingHours.findMany({ where: { businessId: data.id } });
      }
      if (include?.aiContents) {
        result.aiContents = await db.aIContent.findMany({ where: { businessId: data.id } });
      }
      if (include?.bookings) {
        result.bookings = await db.booking.findMany({ where: { businessId: data.id } });
      }

      return result;
    },

    async findUnique({ where, include, select }: any): Promise<any> {
      let query = supabaseAdmin.from("Business").select("*");
      if (where?.slug) query = query.eq("slug", where.slug);
      if (where?.id) query = query.eq("id", where.id);

      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.warn("[Supabase DB] business.findUnique error:", error);
      }
      if (!data) return null;

      const result: any = { ...data };
      if (include?.services) {
        result.services = await db.service.findMany({ where: { businessId: data.id } });
      }
      if (include?.staff) {
        result.staff = [];
      }
      if (include?.workingHours) {
        result.workingHours = await db.workingHours.findMany({ where: { businessId: data.id } });
      }
      return result;
    },

    async findMany({ where }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("Business").select("*");
      if (where?.ownerId) query = query.eq("ownerId", where.ownerId);

      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase DB] business.findMany error:", error);
        return [];
      }
      return data || [];
    },

    async create({ data }: { data: any }): Promise<any> {
      const id = data.id || `biz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      const payload = {
        ...data,
        id,
        updatedAt: now,
      };

      const { data: created, error } = await supabaseAdmin.from("Business").insert([payload]).select().single();
      if (error) {
        console.error("[Supabase DB] business.create error:", error);
        throw new Error(error.message || "Failed to create business");
      }
      return created;
    },

    async update({ where, data }: { where: { id: string }; data: any }): Promise<any> {
      const now = new Date().toISOString();
      const payload = { ...data, updatedAt: now };

      const { data: updated, error } = await supabaseAdmin
        .from("Business")
        .update(payload)
        .eq("id", where.id)
        .select()
        .single();

      if (error) {
        console.error("[Supabase DB] business.update error:", error);
        throw new Error(error.message || "Failed to update business");
      }
      return updated;
    },
  },

  service: {
    async findMany({ where }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("Service").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      if (where?.isActive !== undefined) query = query.eq("isActive", where.isActive);
      query = query.order("order", { ascending: true });

      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase DB] service.findMany error:", error);
        return [];
      }
      return data || [];
    },

    async findUnique({ where }: any): Promise<any> {
      let query = supabaseAdmin.from("Service").select("*");
      if (where?.id) query = query.eq("id", where.id);
      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.warn("[Supabase DB] service.findUnique error:", error);
      }
      return data || null;
    },

    async create({ data }: any): Promise<any> {
      const id = data.id || `svc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const payload = { ...data, id, updatedAt: new Date().toISOString() };
      const { data: created, error } = await supabaseAdmin.from("Service").insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return created;
    },

    async createMany({ data }: { data: any[] }): Promise<{ count: number }> {
      const payloads = data.map((d, i) => ({
        ...d,
        id: d.id || `svc_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        updatedAt: new Date().toISOString(),
      }));
      const { error } = await supabaseAdmin.from("Service").insert(payloads);
      if (error) {
        console.warn("[Supabase DB] service.createMany error:", error);
      }
      return { count: data.length };
    },

    async update({ where, data }: any): Promise<any> {
      const payload = { ...data, updatedAt: new Date().toISOString() };
      const { data: updated, error } = await supabaseAdmin.from("Service").update(payload).eq("id", where.id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    },

    async delete({ where }: any): Promise<any> {
      const { error } = await supabaseAdmin.from("Service").delete().eq("id", where.id);
      if (error) throw new Error(error.message);
      return { id: where.id };
    },

    async deleteMany({ where }: any): Promise<{ count: number }> {
      let query = supabaseAdmin.from("Service").delete();
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      const { error } = await query;
      if (error) console.warn("[Supabase DB] service.deleteMany error:", error);
      return { count: 1 };
    },

    async count({ where }: any = {}): Promise<number> {
      let query = supabaseAdmin.from("Service").select("*", { count: "exact", head: true });
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      const { count } = await query;
      return count || 0;
    },
  },

  workingHours: {
    async findMany({ where }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("WorkingHours").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      const { data, error } = await query;
      if (error) return [];
      return data || [];
    },

    async createMany({ data }: { data: any[] }): Promise<{ count: number }> {
      const payloads = data.map((d, i) => ({
        ...d,
        id: d.id || `wh_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      }));
      await supabaseAdmin.from("WorkingHours").insert(payloads);
      return { count: data.length };
    },

    async deleteMany({ where }: any): Promise<{ count: number }> {
      let query = supabaseAdmin.from("WorkingHours").delete();
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      await query;
      return { count: 1 };
    },
  },

  booking: {
    async findMany({ where, orderBy, take, include, select }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("Booking").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      if (where?.date?.gte) query = query.gte("date", where.date.gte);
      if (where?.date?.lte) query = query.lte("date", where.date.lte);
      if (where?.date && typeof where.date === "string") query = query.eq("date", where.date);
      if (where?.status?.in) query = query.in("status", where.status.in);
      if (where?.status?.not) query = query.neq("status", where.status.not);
      if (where?.status && typeof where.status === "string") query = query.eq("status", where.status);
      query = query.order("createdAt", { ascending: false });
      if (take) query = query.limit(take);

      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase DB] booking.findMany error:", error);
        return [];
      }
      return data || [];
    },

    async findUnique({ where }: any): Promise<any> {
      let query = supabaseAdmin.from("Booking").select("*");
      if (where?.id) query = query.eq("id", where.id);
      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") console.warn("[Supabase DB] booking.findUnique error:", error);
      return data || null;
    },

    async create({ data }: any): Promise<any> {
      const id = data.id || `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const payload = {
        ...data,
        id,
        updatedAt: new Date().toISOString(),
      };
      const { data: created, error } = await supabaseAdmin.from("Booking").insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return created;
    },

    async update({ where, data }: any): Promise<any> {
      const payload = { ...data, updatedAt: new Date().toISOString() };
      const { data: updated, error } = await supabaseAdmin.from("Booking").update(payload).eq("id", where.id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    },

    async count({ where }: any = {}): Promise<number> {
      let query = supabaseAdmin.from("Booking").select("*", { count: "exact", head: true });
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      const { count } = await query;
      return count || 0;
    },
  },

  customer: {
    async findMany({ where, include, orderBy, take }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("Customer").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      query = query.order("createdAt", { ascending: false });
      if (take) query = query.limit(take);

      const { data, error } = await query;
      if (error) {
        console.warn("[Supabase DB] customer.findMany error:", error);
        return [];
      }
      return (data || []).map((c) => ({ ...c, bookings: [] }));
    },

    async count({ where }: any = {}): Promise<number> {
      let query = supabaseAdmin.from("Customer").select("*", { count: "exact", head: true });
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      const { count } = await query;
      return count || 0;
    },

    async upsert({ where, update, create }: any): Promise<any> {
      const phone = where?.businessId_phone?.phone || create?.phone;
      const businessId = where?.businessId_phone?.businessId || create?.businessId;

      const existing = await supabaseAdmin
        .from("Customer")
        .select("*")
        .eq("businessId", businessId)
        .eq("phone", phone)
        .maybeSingle();

      if (existing.data) {
        const payload: any = { updatedAt: new Date().toISOString() };
        if (update.name) payload.name = update.name;
        if (update.email) payload.email = update.email;
        if (update.visitCount?.increment) payload.visitCount = (existing.data.visitCount || 1) + update.visitCount.increment;
        if (update.lifetimeValue?.increment) payload.lifetimeValue = (existing.data.lifetimeValue || 0) + update.lifetimeValue.increment;

        const { data: updated } = await supabaseAdmin.from("Customer").update(payload).eq("id", existing.data.id).select().single();
        return updated || existing.data;
      } else {
        const id = `cst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const payload = {
          ...create,
          id,
          visitCount: create.visitCount || 1,
          lifetimeValue: create.lifetimeValue || 0,
          updatedAt: new Date().toISOString(),
        };
        const { data: created, error } = await supabaseAdmin.from("Customer").insert([payload]).select().single();
        if (error) throw new Error(error.message);
        return created;
      }
    },
  },

  enquiry: {
    async findMany({ where, orderBy, take }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("Enquiry").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      query = query.order("createdAt", { ascending: false });
      if (take) query = query.limit(take);

      const { data, error } = await query;
      if (error) return [];
      return data || [];
    },

    async create({ data }: any): Promise<any> {
      const id = data.id || `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const payload = { ...data, id, updatedAt: new Date().toISOString() };
      const { data: created, error } = await supabaseAdmin.from("Enquiry").insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return created;
    },
  },

  whatsAppLog: {
    async findMany({ where, orderBy, take }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("WhatsAppLog").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      query = query.order("timestamp", { ascending: false });
      if (take) query = query.limit(take);
      const { data, error } = await query;
      if (error) return [];
      return data || [];
    },

    async create({ data }: any): Promise<any> {
      const id = data.id || `wal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const { data: created, error } = await supabaseAdmin.from("WhatsAppLog").insert([{ ...data, id }]).select().single();
      if (error) throw new Error(error.message);
      return created;
    },

    async createMany({ data }: { data: any[] }): Promise<{ count: number }> {
      const payloads = data.map((d, i) => ({
        ...d,
        id: d.id || `wal_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      }));
      await supabaseAdmin.from("WhatsAppLog").insert(payloads);
      return { count: data.length };
    },
  },

  conversation: {
    async findMany({ where, orderBy, take, include }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("Conversation").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      query = query.order("lastMessageAt", { ascending: false });
      if (take) query = query.limit(take);
      const { data, error } = await query;
      if (error) return [];
      return (data || []).map((c) => ({ ...c, messages: [] }));
    },

    async findUnique({ where }: any): Promise<any> {
      let query = supabaseAdmin.from("Conversation").select("*");
      if (where?.id) query = query.eq("id", where.id);
      const { data, error } = await query.maybeSingle();
      return data || null;
    },

    async update({ where, data }: any): Promise<any> {
      const { data: updated, error } = await supabaseAdmin.from("Conversation").update(data).eq("id", where.id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    },
  },

  chatMessage: {
    async findMany({ where, orderBy, take }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("ChatMessage").select("*");
      if (where?.conversationId) query = query.eq("conversationId", where.conversationId);
      query = query.order("timestamp", { ascending: true });
      if (take) query = query.limit(take);
      const { data, error } = await query;
      if (error) return [];
      return data || [];
    },

    async create({ data }: any): Promise<any> {
      const id = data.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const { data: created, error } = await supabaseAdmin.from("ChatMessage").insert([{ ...data, id }]).select().single();
      if (error) throw new Error(error.message);
      return created;
    },
  },

  knowledgeBase: {
    async findMany({ where, orderBy }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("KnowledgeBase").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      query = query.order("createdAt", { ascending: false });
      const { data, error } = await query;
      if (error) return [];
      return data || [];
    },
  },

  aIContent: {
    async findMany({ where, orderBy, take }: any = {}): Promise<any[]> {
      let query = supabaseAdmin.from("AIContent").select("*");
      if (where?.businessId) query = query.eq("businessId", where.businessId);
      query = query.order("createdAt", { ascending: false });
      if (take) query = query.limit(take);
      const { data, error } = await query;
      if (error) return [];
      return data || [];
    },

    async create({ data }: any): Promise<any> {
      const id = data.id || `aic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const { data: created, error } = await supabaseAdmin.from("AIContent").insert([{ ...data, id }]).select().single();
      if (error) throw new Error(error.message);
      return created;
    },

    async createMany({ data }: { data: any[] }): Promise<{ count: number }> {
      const payloads = data.map((d, i) => ({
        ...d,
        id: d.id || `aic_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      }));
      await supabaseAdmin.from("AIContent").insert(payloads);
      return { count: data.length };
    },
  },
};
