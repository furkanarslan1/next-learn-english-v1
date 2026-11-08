export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      deck_words: {
        Row: {
          deck_id: number
          position: number
          word_id: number
        }
        Insert: {
          deck_id: number
          position?: number
          word_id: number
        }
        Update: {
          deck_id?: number
          position?: number
          word_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "deck_words_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_words_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          category: Database["public"]["Enums"]["deck_category"]
          created_at: string
          id: number
          level: Database["public"]["Enums"]["cefr_level"] | null
          position: number
          title: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["deck_category"]
          created_at?: string
          id?: never
          level?: Database["public"]["Enums"]["cefr_level"] | null
          position?: number
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["deck_category"]
          created_at?: string
          id?: never
          level?: Database["public"]["Enums"]["cefr_level"] | null
          position?: number
          title?: string
        }
        Relationships: []
      }
      duel_answer_keys: {
        Row: {
          correct: number[]
          duel_id: string
        }
        Insert: {
          correct: number[]
          duel_id: string
        }
        Update: {
          correct?: number[]
          duel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duel_answer_keys_duel_id_fkey"
            columns: ["duel_id"]
            isOneToOne: true
            referencedRelation: "duels"
            referencedColumns: ["id"]
          },
        ]
      }
      duels: {
        Row: {
          created_at: string
          creator_finished_at: string | null
          creator_id: string
          creator_score: number | null
          creator_time_ms: number | null
          id: string
          opponent_finished_at: string | null
          opponent_id: string | null
          opponent_score: number | null
          opponent_time_ms: number | null
          question_word_ids: number[]
          questions: Json
          status: Database["public"]["Enums"]["duel_status"]
        }
        Insert: {
          created_at?: string
          creator_finished_at?: string | null
          creator_id: string
          creator_score?: number | null
          creator_time_ms?: number | null
          id?: string
          opponent_finished_at?: string | null
          opponent_id?: string | null
          opponent_score?: number | null
          opponent_time_ms?: number | null
          question_word_ids: number[]
          questions?: Json
          status?: Database["public"]["Enums"]["duel_status"]
        }
        Update: {
          created_at?: string
          creator_finished_at?: string | null
          creator_id?: string
          creator_score?: number | null
          creator_time_ms?: number | null
          id?: string
          opponent_finished_at?: string | null
          opponent_id?: string | null
          opponent_score?: number | null
          opponent_time_ms?: number | null
          question_word_ids?: number[]
          questions?: Json
          status?: Database["public"]["Enums"]["duel_status"]
        }
        Relationships: [
          {
            foreignKeyName: "duels_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duels_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_topics: {
        Row: {
          content: Json
          created_at: string
          id: number
          level: Database["public"]["Enums"]["cefr_level"]
          position: number
          slug: string
          title: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: never
          level: Database["public"]["Enums"]["cefr_level"]
          position?: number
          slug: string
          title: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: never
          level?: Database["public"]["Enums"]["cefr_level"]
          position?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          learned_deck_ids: number[]
          learned_word_ids: number[]
          level: Database["public"]["Enums"]["cefr_level"]
          streak_best: number
          streak_count: number
          streak_last_date: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          learned_deck_ids?: number[]
          learned_word_ids?: number[]
          level?: Database["public"]["Enums"]["cefr_level"]
          streak_best?: number
          streak_count?: number
          streak_last_date?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          learned_deck_ids?: number[]
          learned_word_ids?: number[]
          level?: Database["public"]["Enums"]["cefr_level"]
          streak_best?: number
          streak_count?: number
          streak_last_date?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_decks: {
        Row: {
          deck_id: number
          known_word_ids: number[]
          next_review_at: string
          stage: number
          started_at: string
          success_count: number
          user_id: string
        }
        Insert: {
          deck_id: number
          known_word_ids?: number[]
          next_review_at?: string
          stage?: number
          started_at?: string
          success_count?: number
          user_id: string
        }
        Update: {
          deck_id?: number
          known_word_ids?: number[]
          next_review_at?: string
          stage?: number
          started_at?: string
          success_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_decks_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_decks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_grammar: {
        Row: {
          next_review_at: string
          stage: number
          success_count: number
          topic_id: number
          user_id: string
        }
        Insert: {
          next_review_at?: string
          stage?: number
          success_count?: number
          topic_id: number
          user_id: string
        }
        Update: {
          next_review_at?: string
          stage?: number
          success_count?: number
          topic_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_grammar_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "grammar_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_grammar_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          created_at: string
          english: string
          example_en: string | null
          example_tr: string | null
          id: number
          level: Database["public"]["Enums"]["cefr_level"] | null
          part_of_speech: string | null
          synonyms: string[]
          turkish: string
          usage_note: string | null
        }
        Insert: {
          created_at?: string
          english: string
          example_en?: string | null
          example_tr?: string | null
          id?: never
          level?: Database["public"]["Enums"]["cefr_level"] | null
          part_of_speech?: string | null
          synonyms?: string[]
          turkish: string
          usage_note?: string | null
        }
        Update: {
          created_at?: string
          english?: string
          example_en?: string | null
          example_tr?: string | null
          id?: never
          level?: Database["public"]["Enums"]["cefr_level"] | null
          part_of_speech?: string | null
          synonyms?: string[]
          turkish?: string
          usage_note?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_duel: {
        Args: { p_opponent_nickname: string; p_question_count?: number }
        Returns: string
      }
      learn_deck: { Args: { p_deck_id: number }; Returns: undefined }
      my_duels: {
        Args: { p_duel_id?: string }
        Returns: {
          created_at: string
          id: string
          my_finished: boolean
          my_score: number
          my_time_ms: number
          opponent_nickname: string
          question_count: number
          status: Database["public"]["Enums"]["duel_status"]
          their_finished: boolean
          their_score: number
          their_time_ms: number
        }[]
      }
      submit_duel: {
        Args: { p_answers: number[]; p_duel_id: string; p_time_ms: number }
        Returns: number
      }
      touch_streak: { Args: never; Returns: undefined }
    }
    Enums: {
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      deck_category: "general" | "yds"
      duel_status: "pending" | "active" | "finished" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cefr_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      deck_category: ["general", "yds"],
      duel_status: ["pending", "active", "finished", "cancelled"],
    },
  },
} as const
