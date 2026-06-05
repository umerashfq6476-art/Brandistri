/**
 * Supabase database types.
 *
 * These mirror the schema defined in lib/supabase/schema.sql. Keep them in
 * sync when you alter the schema. Once your project is provisioned you can
 * regenerate this file with:
 *
 *   npx supabase gen types typescript --project-id <ref> --schema public > lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/* ─── Domain enums (string unions matching the SQL CHECK constraints) ─── */

export type PostCategory =
  | "Branding"
  | "Strategy"
  | "Web"
  | "Social"
  | "Video"
  | "Insights"
  | "Case Study";

export type ProjectCategory =
  | "Brand Identity"
  | "Web Design"
  | "Social Branding"
  | "Video Content"
  | "Brand Strategy";

export type MessageSource = "contact" | "newsletter" | "service" | "package";

export type PricePeriod = "one-time" | "monthly" | "yearly" | "custom";

/* ─── Shared embedded shapes (jsonb columns) ─── */

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
  description: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

/* ─── Row / Insert / Update shapes per table ───────────────────────────── */

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          category: PostCategory;
          tags: string[];
          author_id: string | null;
          author_name: string | null;
          read_time: number;
          featured: boolean;
          published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[];
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          category?: PostCategory;
          tags?: string[];
          author_id?: string | null;
          author_name?: string | null;
          read_time?: number;
          featured?: boolean;
          published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          category?: PostCategory;
          tags?: string[];
          author_id?: string | null;
          author_name?: string | null;
          read_time?: number;
          featured?: boolean;
          published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          client: string;
          category: ProjectCategory;
          tags: string[];
          description: string;
          challenge: string | null;
          solution: string | null;
          results: string | null;
          cover_image: string | null;
          gallery_images: string[];
          accent_color: string;
          featured: boolean;
          published: boolean;
          year: number;
          duration: string | null;
          services: string[];
          metrics: ProjectMetric[];
          testimonial: ProjectTestimonial | null;
          display_order: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          client: string;
          category: ProjectCategory;
          tags?: string[];
          description?: string;
          challenge?: string | null;
          solution?: string | null;
          results?: string | null;
          cover_image?: string | null;
          gallery_images?: string[];
          accent_color?: string;
          featured?: boolean;
          published?: boolean;
          year?: number;
          duration?: string | null;
          services?: string[];
          metrics?: ProjectMetric[];
          testimonial?: ProjectTestimonial | null;
          display_order?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          client?: string;
          category?: ProjectCategory;
          tags?: string[];
          description?: string;
          challenge?: string | null;
          solution?: string | null;
          results?: string | null;
          cover_image?: string | null;
          gallery_images?: string[];
          accent_color?: string;
          featured?: boolean;
          published?: boolean;
          year?: number;
          duration?: string | null;
          services?: string[];
          metrics?: ProjectMetric[];
          testimonial?: ProjectTestimonial | null;
          display_order?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tagline: string | null;
          summary: string | null;
          description: string;
          icon: string | null;
          deliverables: string[];
          process: ProcessStep[];
          benefits: ServiceBenefit[];
          starting_price: number | null;
          price_label: string | null;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          tagline?: string | null;
          summary?: string | null;
          description?: string;
          icon?: string | null;
          deliverables?: string[];
          process?: ProcessStep[];
          benefits?: ServiceBenefit[];
          starting_price?: number | null;
          price_label?: string | null;
          display_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          tagline?: string | null;
          summary?: string | null;
          description?: string;
          icon?: string | null;
          deliverables?: string[];
          process?: ProcessStep[];
          benefits?: ServiceBenefit[];
          starting_price?: number | null;
          price_label?: string | null;
          display_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      packages: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number | null;
          price_label: string | null;
          price_period: PricePeriod;
          features: string[];
          popular: boolean;
          active: boolean;
          display_order: number;
          cta_label: string | null;
          cta_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number | null;
          price_label?: string | null;
          price_period?: PricePeriod;
          features?: string[];
          popular?: boolean;
          active?: boolean;
          display_order?: number;
          cta_label?: string | null;
          cta_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number | null;
          price_label?: string | null;
          price_period?: PricePeriod;
          features?: string[];
          popular?: boolean;
          active?: boolean;
          display_order?: number;
          cta_label?: string | null;
          cta_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          project_type: string | null;
          service_type: string | null;
          budget: string | null;
          timeline: string | null;
          message: string;
          source: MessageSource;
          read: boolean;
          read_at: string | null;
          replied: boolean;
          replied_at: string | null;
          archived: boolean;
          received_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          project_type?: string | null;
          service_type?: string | null;
          budget?: string | null;
          timeline?: string | null;
          message: string;
          source?: MessageSource;
          read?: boolean;
          read_at?: string | null;
          replied?: boolean;
          replied_at?: string | null;
          archived?: boolean;
          received_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          project_type?: string | null;
          service_type?: string | null;
          budget?: string | null;
          timeline?: string | null;
          message?: string;
          source?: MessageSource;
          read?: boolean;
          read_at?: string | null;
          replied?: boolean;
          replied_at?: string | null;
          archived?: boolean;
          received_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

/* ─── Row helpers ───────────────────────────────────────────────────────── */

type PublicSchema = Database["public"];

export type PostRow = PublicSchema["Tables"]["posts"]["Row"];
export type PostInsert = PublicSchema["Tables"]["posts"]["Insert"];
export type PostUpdate = PublicSchema["Tables"]["posts"]["Update"];

export type ProjectRow = PublicSchema["Tables"]["projects"]["Row"];
export type ProjectInsert = PublicSchema["Tables"]["projects"]["Insert"];
export type ProjectUpdate = PublicSchema["Tables"]["projects"]["Update"];

export type ServiceRow = PublicSchema["Tables"]["services"]["Row"];
export type ServiceInsert = PublicSchema["Tables"]["services"]["Insert"];
export type ServiceUpdate = PublicSchema["Tables"]["services"]["Update"];

export type PackageRow = PublicSchema["Tables"]["packages"]["Row"];
export type PackageInsert = PublicSchema["Tables"]["packages"]["Insert"];
export type PackageUpdate = PublicSchema["Tables"]["packages"]["Update"];

export type MessageRow = PublicSchema["Tables"]["messages"]["Row"];
export type MessageInsert = PublicSchema["Tables"]["messages"]["Insert"];
export type MessageUpdate = PublicSchema["Tables"]["messages"]["Update"];

export type SettingRow = PublicSchema["Tables"]["settings"]["Row"];
export type SettingInsert = PublicSchema["Tables"]["settings"]["Insert"];
export type SettingUpdate = PublicSchema["Tables"]["settings"]["Update"];
