export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      deploy_waitlist: {
        Row: {
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: never
          user_id?: string
        }
        Relationships: []
      }
      deployed_databases: {
        Row: {
          created_at: string
          deployment_provider_integration_id: number
          id: number
          local_database_id: string
          provider_metadata: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          deployment_provider_integration_id: number
          id?: never
          local_database_id: string
          provider_metadata?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          deployment_provider_integration_id?: number
          id?: never
          local_database_id?: string
          provider_metadata?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployed_databases_deployment_provider_integration_id_fkey"
            columns: ["deployment_provider_integration_id"]
            isOneToOne: false
            referencedRelation: "deployment_provider_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      deployment_provider_integrations: {
        Row: {
          created_at: string
          credentials: string | null
          deployment_provider_id: number | null
          id: number
          revoked_at: string | null
          scope: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials?: string | null
          deployment_provider_id?: number | null
          id?: never
          revoked_at?: string | null
          scope?: Json
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          credentials?: string | null
          deployment_provider_id?: number | null
          id?: never
          revoked_at?: string | null
          scope?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployment_provider_integrations_deployment_provider_id_fkey"
            columns: ["deployment_provider_id"]
            isOneToOne: false
            referencedRelation: "deployment_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      deployment_providers: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      deployments: {
        Row: {
          created_at: string
          deployed_database_id: number | null
          events: Json
          id: number
          local_database_id: string
          status: Database["public"]["Enums"]["deployment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deployed_database_id?: number | null
          events?: Json
          id?: never
          local_database_id: string
          status?: Database["public"]["Enums"]["deployment_status"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          deployed_database_id?: number | null
          events?: Json
          id?: never
          local_database_id?: string
          status?: Database["public"]["Enums"]["deployment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployments_deployed_database_id_fkey"
            columns: ["deployed_database_id"]
            isOneToOne: false
            referencedRelation: "deployed_databases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployments_deployed_database_id_fkey"
            columns: ["deployed_database_id"]
            isOneToOne: false
            referencedRelation: "latest_deployed_databases"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      latest_deployed_databases: {
        Row: {
          created_at: string | null
          deployment_provider_integration_id: number | null
          id: number | null
          last_deployment_at: string | null
          local_database_id: string | null
          provider_metadata: Json | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deployed_databases_deployment_provider_integration_id_fkey"
            columns: ["deployment_provider_integration_id"]
            isOneToOne: false
            referencedRelation: "deployment_provider_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_secret: {
        Args: {
          secret_id: string
        }
        Returns: number
      }
      insert_secret: {
        Args: {
          secret: string
          name: string
        }
        Returns: string
      }
      read_secret: {
        Args: {
          secret_id: string
        }
        Returns: string
      }
      supabase_functions_certificate_secret: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      supabase_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_secret: {
        Args: {
          secret_id: string
          new_secret: string
        }
        Returns: string
      }
      upsert_secret: {
        Args: {
          secret: string
          name: string
        }
        Returns: string
      }
    }
    Enums: {
      deployment_status: "in_progress" | "success" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

