import { Database as DatabaseGenerated } from './supabase-generated';

export interface Database extends DatabaseGenerated {
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
    };
  };
}
