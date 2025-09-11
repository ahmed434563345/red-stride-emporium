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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_content: {
        Row: {
          content_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          page: string
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          content_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          page: string
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          page?: string
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          product_id: string | null
          seller_id: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          product_id?: string | null
          seller_id?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          product_id?: string | null
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachment_url: string | null
          conversation_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          sender_type: string
          user_id: string
        }
        Insert: {
          attachment_url?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          sender_type: string
          user_id: string
        }
        Update: {
          attachment_url?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          sender_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      erb_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          module_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          module_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          module_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      erb_modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      erb_permissions: {
        Row: {
          can_delete: boolean | null
          can_read: boolean | null
          can_write: boolean | null
          created_at: string
          id: string
          module_id: string | null
          user_id: string | null
        }
        Insert: {
          can_delete?: boolean | null
          can_read?: boolean | null
          can_write?: boolean | null
          created_at?: string
          id?: string
          module_id?: string | null
          user_id?: string | null
        }
        Update: {
          can_delete?: boolean | null
          can_read?: boolean | null
          can_write?: boolean | null
          created_at?: string
          id?: string
          module_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erb_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "erb_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      erb_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          estimated_delivery: string | null
          id: string
          order_date: string | null
          order_total: number | null
          payment_method: string | null
          price: number
          product_id: string | null
          product_name: string
          quantity: number
          shipping_address: string | null
          shipping_address_id: string | null
          shipping_city: string | null
          shipping_cost: number | null
          shipping_governorate: string | null
          shipping_method: string | null
          shipping_postal_code: string | null
          size: string | null
          status: string | null
          tracking_number: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          estimated_delivery?: string | null
          id?: string
          order_date?: string | null
          order_total?: number | null
          payment_method?: string | null
          price: number
          product_id?: string | null
          product_name: string
          quantity: number
          shipping_address?: string | null
          shipping_address_id?: string | null
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_governorate?: string | null
          shipping_method?: string | null
          shipping_postal_code?: string | null
          size?: string | null
          status?: string | null
          tracking_number?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          estimated_delivery?: string | null
          id?: string
          order_date?: string | null
          order_total?: number | null
          payment_method?: string | null
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          shipping_address?: string | null
          shipping_address_id?: string | null
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_governorate?: string | null
          shipping_method?: string | null
          shipping_postal_code?: string | null
          size?: string | null
          status?: string | null
          tracking_number?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses_id"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sizes: {
        Row: {
          additional_price: number | null
          created_at: string | null
          id: string
          product_id: string | null
          size: string
          stock_quantity: number | null
        }
        Insert: {
          additional_price?: number | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          size: string
          stock_quantity?: number | null
        }
        Update: {
          additional_price?: number | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          size?: string
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_sizes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          product_id: string
          sort_order: number
          title: string | null
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          product_id: string
          sort_order?: number
          title?: string | null
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          product_id?: string
          sort_order?: number
          title?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_videos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string
          colors: string[] | null
          created_at: string
          description: string | null
          dimensions: string | null
          features: string[] | null
          id: string
          images: string[] | null
          is_new: boolean | null
          name: string
          original_price: number | null
          price: number
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          shipping_address: string | null
          shipping_time: string | null
          sizes: string[] | null
          stock: number
          store_id: string | null
          subcategory: string | null
          updated_at: string
          vendor_id: string | null
          vendor_name: string | null
          vendor_profile_id: string | null
          weight: number | null
        }
        Insert: {
          brand?: string | null
          category: string
          colors?: string[] | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_new?: boolean | null
          name: string
          original_price?: number | null
          price: number
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          shipping_address?: string | null
          shipping_time?: string | null
          sizes?: string[] | null
          stock?: number
          store_id?: string | null
          subcategory?: string | null
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string | null
          vendor_profile_id?: string | null
          weight?: number | null
        }
        Update: {
          brand?: string | null
          category?: string
          colors?: string[] | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_new?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          shipping_address?: string | null
          shipping_time?: string | null
          sizes?: string[] | null
          stock?: number
          store_id?: string | null
          subcategory?: string | null
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string | null
          vendor_profile_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_addresses_id: {
        Row: {
          address_line_1: string
          address_line_2: string
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          order_id: string
          phone: string
          postal_code: string
          state: string
          user_id: string
        }
        Insert: {
          address_line_1: string
          address_line_2: string
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          order_id: string
          phone: string
          postal_code: string
          state: string
          user_id: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          order_id?: string
          phone?: string
          postal_code?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          admin_user_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string
          store_description: string | null
          store_logo_url: string | null
          vendor_profile_id: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone: string
          store_description?: string | null
          store_logo_url?: string | null
          vendor_profile_id?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string
          store_description?: string | null
          store_logo_url?: string | null
          vendor_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_messages: {
        Row: {
          admin_user_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          parent_message_id: string | null
          sender_type: string
          subject: string
          vendor_profile_id: string
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          parent_message_id?: string | null
          sender_type: string
          subject: string
          vendor_profile_id: string
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          parent_message_id?: string | null
          sender_type?: string
          subject?: string
          vendor_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "vendor_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_messages_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          order_id: string | null
          product_id: string | null
          title: string
          type: string
          vendor_profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          order_id?: string | null
          product_id?: string | null
          title: string
          type: string
          vendor_profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          order_id?: string | null
          product_id?: string | null
          title?: string
          type?: string
          vendor_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_notifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_notifications_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles: {
        Row: {
          business_address: string | null
          business_description: string | null
          business_email: string
          business_phone: string
          commission_rate: number | null
          created_at: string
          id: string
          status: string | null
          updated_at: string
          user_id: string
          vendor_name: string
        }
        Insert: {
          business_address?: string | null
          business_description?: string | null
          business_email: string
          business_phone: string
          commission_rate?: number | null
          created_at?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id: string
          vendor_name: string
        }
        Update: {
          business_address?: string | null
          business_description?: string | null
          business_email?: string
          business_phone?: string
          commission_rate?: number | null
          created_at?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          vendor_name?: string
        }
        Relationships: []
      }
      website_analytics: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          ip_address: unknown | null
          location: string | null
          page_path: string
          phone_number: string | null
          session_id: string | null
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          location?: string | null
          page_path: string
          phone_number?: string | null
          session_id?: string | null
          user_agent?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          location?: string | null
          page_path?: string
          phone_number?: string | null
          session_id?: string | null
          user_agent?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { _role: string; user_uuid: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "vendor"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user", "vendor"],
    },
  },
} as const
