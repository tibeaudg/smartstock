import { type } from "os";
import { string } from "zod";

// BlogPost type for Supabase integration
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  published: boolean;
  date_published?: string;
  author?: string;
};

// Blog Analytics types
export type BlogAnalytics = {
  id: string;
  blog_post_id?: string;
  slug: string;
  visitor_ip?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  page_load_time_ms?: number;
  time_on_page_seconds?: number;
  is_unique_visit: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogAnalyticsSummary = {
  slug: string;
  blog_post_id?: string;
  total_views: number;
  unique_visitors: number;
  avg_load_time_ms?: number;
  avg_time_on_page_seconds?: number;
  first_view: string;
  last_view: string;
};
      company_types: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          custom_type: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          custom_type?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          custom_type?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "company_types_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };




export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string;
          user_id: string;
          is_closed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          is_closed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          is_closed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          chat_id: string;
          sender_type: 'user' | 'admin';
          sender_id: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          sender_type: 'user' | 'admin';
          sender_id: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          sender_type?: 'user' | 'admin';
          sender_id?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      onboarding_answers: {
        Row: {
          id: string;
          user_id: string;
          employees: string | null;
          stock_size: string | null;
          wants_notifications: boolean | null;
          wants_demo_stock: boolean | null;
          main_goal: string | null;
          uses_barcodes: boolean | null;
          uses_other_system: boolean | null;
          other_system_name: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          employees?: string | null;
          stock_size?: string | null;
          wants_notifications?: boolean | null;
          wants_demo_stock?: boolean | null;
          main_goal?: string | null;
          uses_barcodes?: boolean | null;
          uses_other_system?: boolean | null;
          other_system_name?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          employees?: string | null;
          stock_size?: string | null;
          wants_notifications?: boolean | null;
          wants_demo_stock?: boolean | null;
          main_goal?: string | null;
          uses_barcodes?: boolean | null;
          uses_other_system?: boolean | null;
          other_system_name?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_answers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      company_types: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          custom_type: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          custom_type?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          custom_type?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "company_types_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          action: string
          branch_id: string | null
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          branch_id?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          branch_id?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_periods: {
        Row: {
          branch_count: number
          created_at: string
          id: string
          license_id: string | null
          period_end: string
          period_start: string
          status: string
          total_amount: number
          user_count: number
          // Toegevoegd voor facturatie/QR/reminders
          payment_reference: string | null // email.naam
          due_date: string | null
          paid_at: string | null
          reminder_sent_at: string | null
          reminder_count: number | null
        }
        Insert: {
          branch_count: number
          created_at?: string
          id?: string
          license_id?: string | null
          period_end: string
          period_start: string
          status?: string
          total_amount: number
          user_count: number
          // Toegevoegd voor facturatie/QR/reminders
          payment_reference?: string | null
          due_date?: string | null
          paid_at?: string | null
          reminder_sent_at?: string | null
          reminder_count?: number | null
        }
        Update: {
          branch_count?: number
          created_at?: string
          id?: string
          license_id?: string | null
          period_end?: string
          period_start?: string
          status?: string
          total_amount?: number
          user_count?: number
          // Toegevoegd voor facturatie/QR/reminders
          payment_reference?: string | null
          due_date?: string | null
          paid_at?: string | null
          reminder_sent_at?: string | null
          reminder_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_periods_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      branch_users: {
        Row: {
          branch_id: string | null
          granted_at: string
          granted_by: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          branch_id?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          branch_id?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branch_users_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_users_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          is_main: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_main?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_main?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          id: string
          title: string
          description: string
          category: 'optimization' | 'premium' | 'analytics' | 'integration'
          status: 'planned' | 'in-development' | 'released'
          priority: 'low' | 'medium' | 'high'
          estimated_release: string | null
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'optimization' | 'premium' | 'analytics' | 'integration'
          status?: 'planned' | 'in-development' | 'released'
          priority?: 'low' | 'medium' | 'high'
          estimated_release?: string | null
          icon: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'optimization' | 'premium' | 'analytics' | 'integration'
          status?: 'planned' | 'in-development' | 'released'
          priority?: 'low' | 'medium' | 'high'
          estimated_release?: string | null
          icon?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      feature_votes: {
        Row: {
          id: string
          feature_id: string
          user_id: string
          voted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          feature_id: string
          user_id: string
          voted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          feature_id?: string
          user_id?: string
          voted?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          admin_user_id: string | null
          created_at: string
          id: string
          is_active: boolean
          license_type: string
          max_branches: number
          max_users: number
          monthly_price: number
          updated_at: string
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          license_type?: string
          max_branches?: number
          max_users?: number
          monthly_price?: number
          updated_at?: string
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          license_type?: string
          max_branches?: number
          max_users?: number
          monthly_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          branch_id: string | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number | null
          unit_price: number
        }
        Insert: {
          branch_id?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price?: number | null
          unit_price: number
        }
        Update: {
          branch_id?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          branch_id: string | null
          created_at: string | null
          created_by: string | null
          expected_delivery: string | null
          id: string
          order_date: string | null
          order_number: string
          status: string
          supplier_id: string | null
          total_amount: number | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          expected_delivery?: string | null
          id?: string
          order_date?: string | null
          order_number: string
          status?: string
          supplier_id?: string | null
          total_amount?: number | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          expected_delivery?: string | null
          id?: string
          order_date?: string | null
          order_number?: string
          status?: string
          supplier_id?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          branch_id: string | null
          category_id: string | null
          category_name: string | null
          created_at: string | null
          description: string | null
          id: string
          minimum_stock_level: number
          name: string
          quantity_in_stock: number
          status: Database["public"]["Enums"]["stock_status"] | null
          supplier_id: string | null
          supplier_name: string | null
          unit_price: number
          updated_at: string | null
          purchase_price: number
          sale_price: number
          barcode: string | null
        }
        Insert: {
          branch_id?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          minimum_stock_level?: number
          name: string
          quantity_in_stock?: number
          status?: Database["public"]["Enums"]["stock_status"] | null
          supplier_id?: string | null
          supplier_name?: string | null
          unit_price?: number
          updated_at?: string | null
          purchase_price?: number
          sale_price?: number
          barcode?: string | null
        }
        Update: {
          branch_id?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          minimum_stock_level?: number
          name?: string
          quantity_in_stock?: number
          status?: Database["public"]["Enums"]["stock_status"] | null
          supplier_id?: string | null
          supplier_name?: string | null
          unit_price?: number
          updated_at?: string | null
          purchase_price?: number
          sale_price?: number
          barcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          selected_plan: string | null
          blocked: boolean | null
          onboarding_completed: boolean | null
          last_login: string | null
          is_owner: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          selected_plan?: string | null
          blocked?: boolean | null
          onboarding_completed?: boolean | null
          last_login?: string | null
          is_owner?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          selected_plan?: string | null
          blocked?: boolean | null
          onboarding_completed?: boolean | null
          last_login?: string | null
          is_owner?: boolean | null
        }
        Relationships: []
      }
      stock_transactions: {
        Row: {
          branch_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          product_id: string | null
          product_name: string | null
          quantity: number
          reference_number: string | null
          total_value: number | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          unit_price: number | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity: number
          reference_number?: string | null
          total_value?: number | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          unit_price?: number | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number
          reference_number?: string | null
          total_value?: number | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_transactions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_billing: {
        Args: { admin_id: string }
        Returns: {
          user_count: number
          branch_count: number
          base_price: number
          total_price: number
        }[]
      }
      get_admin_branches: {
        Args: { admin_id: string }
        Returns: {
          branch_id: string
          branch_name: string
          is_main: boolean
          user_count: number
          created_at: string
        }[]
      }
      get_user_branches: {
        Args: { user_id: string }
        Returns: {
          branch_id: string
          branch_name: string
          is_main: boolean
          user_role: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      stock_status: "in_stock" | "low_stock" | "out_of_stock"
      transaction_type: "incoming" | "outgoing"
      user_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      stock_status: ["in_stock", "low_stock", "out_of_stock"],
      transaction_type: ["incoming", "outgoing"],
      user_role: ["admin", "staff"],
    },
  },
} as const



