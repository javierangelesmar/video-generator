// Supabase generated types placeholder — replace with `supabase gen types typescript`
export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }>;
    Views: Record<string, { Row: Record<string, unknown> }>;
    Functions: Record<string, unknown>;
    Enums: {
      user_role: 'patient' | 'doctor' | 'admin';
      consultation_status: 'pending' | 'active' | 'resolved' | 'closed';
    };
  };
};
