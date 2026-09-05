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
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  isPublished: boolean;
  onboardingComplete: boolean;
  ownerId?: string | null;
}

export const db = {
  user: {
    async findUnique({ where }: { where: { email?: string; id?: string } }): Promise<DBUser | null> {
      let query = supabaseAdmin.from("User").select("*");
      if (where.email) query = query.eq("email", where.email.toLowerCase().trim());
      if (where.id) query = query.eq("id", where.id);
      
      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.error("[Supabase DB] user.findUnique error:", error);
      }
      return data || null;
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
    async findFirst({ where }: { where: { ownerId?: string; slug?: string } }): Promise<DBBusiness | null> {
      let query = supabaseAdmin.from("Business").select("*");
      if (where.ownerId) query = query.eq("ownerId", where.ownerId);
      if (where.slug) query = query.eq("slug", where.slug);

      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.error("[Supabase DB] business.findFirst error:", error);
      }
      return data || null;
    },

    async findUnique({ where }: { where: { slug?: string; id?: string } }): Promise<DBBusiness | null> {
      let query = supabaseAdmin.from("Business").select("*");
      if (where.slug) query = query.eq("slug", where.slug);
      if (where.id) query = query.eq("id", where.id);

      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.error("[Supabase DB] business.findUnique error:", error);
      }
      return data || null;
    },
  },
};
