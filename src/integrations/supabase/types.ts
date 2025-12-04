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
          updated_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          sender_type: 'user' | 'admin';
          sender_id: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          sender_type?: 'user' | 'admin';
          sender_id?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
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
      modules: {
        Row: {
          id: string
          title: string
          description: string
          status: 'available' | 'coming-soon' | 'beta'
          price_monthly: number
          price_yearly: number
          features: any
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'available' | 'coming-soon' | 'beta'
          price_monthly?: number
          price_yearly?: number
          features?: any
          icon?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'available' | 'coming-soon' | 'beta'
          price_monthly?: number
          price_yearly?: number
          features?: any
          icon?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_module_subscriptions: {
        Row: {
          id: string
          user_id: string
          module_id: string
          status: 'active' | 'cancelled' | 'expired'
          billing_cycle: 'monthly' | 'yearly'
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          module_id: string
          status?: 'active' | 'cancelled' | 'expired'
          billing_cycle: 'monthly' | 'yearly'
          start_date?: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          module_id?: string
          status?: 'active' | 'cancelled' | 'expired'
          billing_cycle?: 'monthly' | 'yearly'
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_subscriptions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_module_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          invoice_number: string
          amount: number
          currency: string
          status: 'pending' | 'paid' | 'failed' | 'cancelled'
          stripe_invoice_id: string | null
          pdf_url: string | null
          due_date: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          invoice_number: string
          amount: number
          currency?: string
          status?: 'pending' | 'paid' | 'failed' | 'cancelled'
          stripe_invoice_id?: string | null
          pdf_url?: string | null
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          invoice_number?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'paid' | 'failed' | 'cancelled'
          stripe_invoice_id?: string | null
          pdf_url?: string | null
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_module_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
      leads: {
        Row: {
          id: string
          email: string
          source: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: []
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
          parent_product_id: string | null
          is_variant: boolean | null
          variant_name: string | null
          variant_attributes: Json | null
          variant_sku: string | null
          variant_barcode: string | null
          image_url: string | null
          location: string | null
          is_favorite: boolean | null
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
          parent_product_id?: string | null
          is_variant?: boolean | null
          variant_name?: string | null
          variant_attributes?: Json | null
          variant_sku?: string | null
          variant_barcode?: string | null
          image_url?: string | null
          location?: string | null
          is_favorite?: boolean | null
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
          parent_product_id?: string | null
          is_variant?: boolean | null
          variant_name?: string | null
          variant_attributes?: Json | null
          variant_sku?: string | null
          variant_barcode?: string | null
          image_url?: string | null
          location?: string | null
          is_favorite?: boolean | null
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
          role: Database["public"]["Enums"]["user_role"] | string
          updated_at: string | null
          selected_plan: string | null
          blocked: boolean | null
          last_login: string | null
          is_owner: boolean | null
          onboarding: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | string
          updated_at?: string | null
          selected_plan?: string | null
          blocked?: boolean | null
          last_login?: string | null
          is_owner?: boolean | null
          onboarding?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | string
          updated_at?: string | null
          selected_plan?: string | null
          blocked?: boolean | null
          last_login?: string | null
          is_owner?: boolean | null
          onboarding?: string | null
        }
        Relationships: [        ]
      }
      guest_sessions: {
        Row: {
          id: string
          session_token: string
          expires_at: string
          created_at: string | null
          demo_data_created: boolean | null
          last_accessed: string | null
        }
        Insert: {
          id?: string
          session_token: string
          expires_at: string
          created_at?: string | null
          demo_data_created?: boolean | null
          last_accessed?: string | null
        }
        Update: {
          id?: string
          session_token?: string
          expires_at?: string
          created_at?: string | null
          demo_data_created?: boolean | null
          last_accessed?: string | null
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
          variant_id: string | null
          variant_name: string | null
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
          variant_id?: string | null
          variant_name?: string | null
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
          variant_id?: string | null
          variant_name?: string | null
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
      company_types: {
        Row: {
          id: string
          user_id: string
          type: string
          custom_type: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          custom_type?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          custom_type?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_types_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          parent_category_id: string | null
          icon: string | null
          color: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          parent_category_id?: string | null
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          parent_category_id?: string | null
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
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
          user_id: string | null
          contact_person: string | null
          updated_at: string | null
          municipality: string | null
          group: string | null
          peppol_enabled: boolean
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          user_id?: string | null
          contact_person?: string | null
          updated_at?: string | null
          municipality?: string | null
          group?: string | null
          peppol_enabled?: boolean
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          user_id?: string | null
          contact_person?: string | null
          updated_at?: string | null
          municipality?: string | null
          group?: string | null
          peppol_enabled?: boolean
        }
        Relationships: []
      }
      delivery_notes: {
        Row: {
          id: string
          user_id: string
          type: 'incoming' | 'outgoing'
          status: 'draft' | 'processing' | 'completed' | 'cancelled'
          supplier_id: string | null
          customer_name: string | null
          customer_email: string | null
          customer_address: string | null
          delivery_date: string | null
          reference_number: string | null
          notes: string | null
          total_amount: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'incoming' | 'outgoing'
          status?: 'draft' | 'processing' | 'completed' | 'cancelled'
          supplier_id?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_address?: string | null
          delivery_date?: string | null
          reference_number?: string | null
          notes?: string | null
          total_amount?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'incoming' | 'outgoing'
          status?: 'draft' | 'processing' | 'completed' | 'cancelled'
          supplier_id?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_address?: string | null
          delivery_date?: string | null
          reference_number?: string | null
          notes?: string | null
          total_amount?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_notes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: 'info' | 'warning' | 'error' | 'success'
          is_read: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type?: 'info' | 'warning' | 'error' | 'success'
          is_read?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'error' | 'success'
          is_read?: boolean
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          id: string
          notification_id: string
          user_id: string
          read_at: string
        }
        Insert: {
          id?: string
          notification_id: string
          user_id: string
          read_at?: string
        }
        Update: {
          id?: string
          notification_id?: string
          user_id?: string
          read_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          }
        ]
      }
      blogposts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          author: string | null
          date_published: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          author?: string | null
          date_published?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          author?: string | null
          date_published?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_analytics: {
        Row: {
          id: string
          blog_post_id: string | null
          visitor_ip: string | null
          user_agent: string | null
          referrer: string | null
          slug: string | null
          created_at: string
        }
        Insert: {
          id?: string
          blog_post_id?: string | null
          visitor_ip?: string | null
          user_agent?: string | null
          referrer?: string | null
          slug?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          blog_post_id?: string | null
          visitor_ip?: string | null
          user_agent?: string | null
          referrer?: string | null
          slug?: string | null
          created_at?: string
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



