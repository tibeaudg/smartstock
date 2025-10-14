export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          first_name: string | null;
          last_name: string | null;
          role: 'user' | 'admin' | 'staff';
          is_owner: boolean;
          blocked: boolean;
          stripe_customer_id: string | null;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'user' | 'admin' | 'staff';
          is_owner?: boolean;
          blocked?: boolean;
          stripe_customer_id?: string | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'user' | 'admin' | 'staff';
          is_owner?: boolean;
          blocked?: boolean;
          stripe_customer_id?: string | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_person: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category_id: string | null;
          supplier_id: string | null;
          barcode: string | null;
          location: string | null;
          branch_id: string | null;
          min_stock: number;
          max_stock: number;
          current_stock: number;
          unit_price: number;
          status: 'active' | 'inactive' | 'discontinued';
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category_id?: string | null;
          supplier_id?: string | null;
          barcode?: string | null;
          location?: string | null;
          branch_id?: string | null;
          min_stock?: number;
          max_stock?: number;
          current_stock?: number;
          unit_price?: number;
          status?: 'active' | 'inactive' | 'discontinued';
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category_id?: string | null;
          supplier_id?: string | null;
          barcode?: string | null;
          location?: string | null;
          branch_id?: string | null;
          min_stock?: number;
          max_stock?: number;
          current_stock?: number;
          unit_price?: number;
          status?: 'active' | 'inactive' | 'discontinued';
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      stock_transactions: {
        Row: {
          id: string;
          product_id: string;
          transaction_type: 'in' | 'out' | 'adjustment';
          quantity: number;
          reason: string | null;
          reference: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          transaction_type: 'in' | 'out' | 'adjustment';
          quantity: number;
          reason?: string | null;
          reference?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          transaction_type?: 'in' | 'out' | 'adjustment';
          quantity?: number;
          reason?: string | null;
          reference?: string | null;
          user_id?: string;
          created_at?: string;
        };
      };

      branches: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      branch_users: {
        Row: {
          id: string;
          branch_id: string;
          user_id: string;
          role: 'admin' | 'staff';
          created_at: string;
        };
        Insert: {
          id?: string;
          branch_id: string;
          user_id: string;
          role?: 'admin' | 'staff';
          created_at?: string;
        };
        Update: {
          id?: string;
          branch_id?: string;
          user_id?: string;
          role?: 'admin' | 'staff';
          created_at?: string;
        };
      };

      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: 'info' | 'warning' | 'error' | 'success';
          is_read: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          message: string;
          type?: 'info' | 'warning' | 'error' | 'success';
          is_read?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: 'info' | 'warning' | 'error' | 'success';
          is_read?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };

      notification_reads: {
        Row: {
          id: string;
          notification_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          id?: string;
          notification_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: {
          id?: string;
          notification_id?: string;
          user_id?: string;
          read_at?: string;
        };
      };

      blogposts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          author: string | null;
          date_published: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          author?: string | null;
          date_published?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          author?: string | null;
          date_published?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      blog_analytics: {
        Row: {
          id: string;
          blog_post_id: string | null;
          visitor_ip: string | null;
          user_agent: string | null;
          referrer: string | null;
          slug: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          blog_post_id?: string | null;
          visitor_ip?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          slug?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          blog_post_id?: string | null;
          visitor_ip?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          slug?: string | null;
          created_at?: string;
        };
      };

      auth_conversion_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          session_id: string | null;
          visitor_ip: string | null;
          user_agent: string | null;
          email: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          country: string | null;
          city: string | null;
          page_load_time_ms: number | null;
          time_on_page_seconds: number | null;
          form_abandonment_step: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          session_id?: string | null;
          visitor_ip?: string | null;
          user_agent?: string | null;
          email?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          country?: string | null;
          city?: string | null;
          page_load_time_ms?: number | null;
          time_on_page_seconds?: number | null;
          form_abandonment_step?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_type?: string;
          session_id?: string | null;
          visitor_ip?: string | null;
          user_agent?: string | null;
          email?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          country?: string | null;
          city?: string | null;
          page_load_time_ms?: number | null;
          time_on_page_seconds?: number | null;
          form_abandonment_step?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      auth_conversion_analytics: {
        Row: {
          id: string;
          date: string;
          event_type: string;
          event_count: number;
          unique_sessions: number;
          unique_visitors: number;
          unique_emails: number;
          avg_load_time_ms: number | null;
          avg_time_on_page_seconds: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          event_type: string;
          event_count?: number;
          unique_sessions?: number;
          unique_visitors?: number;
          unique_emails?: number;
          avg_load_time_ms?: number | null;
          avg_time_on_page_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          event_type?: string;
          event_count?: number;
          unique_sessions?: number;
          unique_visitors?: number;
          unique_emails?: number;
          avg_load_time_ms?: number | null;
          avg_time_on_page_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      auth_conversion_funnel: {
        Row: {
          id: string;
          date: string;
          page_views: number;
          registration_started: number;
          registration_completed: number;
          login_attempts: number;
          login_success: number;
          registration_start_rate: number;
          registration_completion_rate: number;
          overall_conversion_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          page_views?: number;
          registration_started?: number;
          registration_completed?: number;
          login_attempts?: number;
          login_success?: number;
          registration_start_rate?: number;
          registration_completion_rate?: number;
          overall_conversion_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          page_views?: number;
          registration_started?: number;
          registration_completed?: number;
          login_attempts?: number;
          login_success?: number;
          registration_start_rate?: number;
          registration_completion_rate?: number;
          overall_conversion_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      delivery_notes: {
        Row: {
          id: string;
          user_id: string;
          type: 'incoming' | 'outgoing';
          status: 'draft' | 'processing' | 'completed' | 'cancelled';
          supplier_id: string | null;
          customer_name: string | null;
          customer_email: string | null;
          customer_address: string | null;
          delivery_date: string | null;
          reference_number: string | null;
          notes: string | null;
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'incoming' | 'outgoing';
          status?: 'draft' | 'processing' | 'completed' | 'cancelled';
          supplier_id?: string | null;
          customer_name?: string | null;
          customer_email?: string | null;
          customer_address?: string | null;
          delivery_date?: string | null;
          reference_number?: string | null;
          notes?: string | null;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'incoming' | 'outgoing';
          status?: 'draft' | 'processing' | 'completed' | 'cancelled';
          supplier_id?: string | null;
          customer_name?: string | null;
          customer_email?: string | null;
          customer_address?: string | null;
          delivery_date?: string | null;
          reference_number?: string | null;
          notes?: string | null;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      features: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: 'general' | 'analytics' | 'automation' | 'integration';
          status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
          priority: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category?: 'general' | 'analytics' | 'automation' | 'integration';
          status?: 'planned' | 'in-progress' | 'completed' | 'cancelled';
          priority?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: 'general' | 'analytics' | 'automation' | 'integration';
          status?: 'planned' | 'in-progress' | 'completed' | 'cancelled';
          priority?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      feature_votes: {
        Row: {
          id: string;
          feature_id: string;
          user_id: string;
          vote_type: 'upvote' | 'downvote';
          created_at: string;
        };
        Insert: {
          id?: string;
          feature_id: string;
          user_id: string;
          vote_type?: 'upvote' | 'downvote';
          created_at?: string;
        };
        Update: {
          id?: string;
          feature_id?: string;
          user_id?: string;
          vote_type?: 'upvote' | 'downvote';
          created_at?: string;
        };
      };

      company_types: {
        Row: {
          id: string;
          user_id: string;
          company_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_type?: string;
          created_at?: string;
        };
      };

      onboarding_answers: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          answer: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          answer?: string;
          created_at?: string;
        };
      };

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
    };
  };
}
