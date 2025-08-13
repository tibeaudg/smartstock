export interface Database {
  public: {
    Tables: {
      onboarding_answers: {
        Row: {
          id: string;
          user_id: string;
          employees: string;
          stock_size: string;
          wants_notifications: boolean;
          wants_demo_stock: boolean;
          main_goal: string;
          uses_barcodes: boolean;
          uses_other_system: boolean;
          other_system_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          employees: string;
          stock_size: string;
          wants_notifications?: boolean;
          wants_demo_stock?: boolean;
          main_goal: string;
          uses_barcodes?: boolean;
          uses_other_system?: boolean;
          other_system_name?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          employees?: string;
          stock_size?: string;
          wants_notifications?: boolean;
          wants_demo_stock?: boolean;
          main_goal?: string;
          uses_barcodes?: boolean;
          uses_other_system?: boolean;
          other_system_name?: string;
          created_at?: string;
        };
      };
      // ... other existing tables ...
    };
  };
}
