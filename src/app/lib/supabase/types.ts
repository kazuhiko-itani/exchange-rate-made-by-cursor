export type Profile = {
  id: string
  name: string | null
  avatar_url: string | null
  updated_at: string | null
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'updated_at'>>
      }
    }
  }
}
