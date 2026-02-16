export type AppRole = 'admin' | 'guard' | 'tenant'

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'arrived' | 'left' | 'completed'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type TableDef<Row, Insert, Update> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      zones: TableDef<
        {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        },
        {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        },
        {
          name?: string
          description?: string | null
          updated_at?: string
        }
      >
      profiles: TableDef<
        {
          id: string
          role: AppRole
          email: string | null
          username: string | null
          full_name: string | null
          phone: string | null
          zone_id: string | null
          tenant_code: string | null
          created_at: string
          updated_at: string
        },
        {
          id: string
          role?: AppRole
          email?: string | null
          username?: string | null
          full_name?: string | null
          phone?: string | null
          zone_id?: string | null
          tenant_code?: string | null
          created_at?: string
          updated_at?: string
        },
        {
          role?: AppRole
          email?: string | null
          username?: string | null
          full_name?: string | null
          phone?: string | null
          zone_id?: string | null
          tenant_code?: string | null
          updated_at?: string
        }
      >
      settings: TableDef<
        {
          id: number
          free_start: string
          free_end: string
          work_start: string
          work_end: string
          break_start: string | null
          break_end: string | null
          hourly_penalty: number
          debt_block_hours: number
          updated_at: string
        },
        {
          id?: number
          free_start?: string
          free_end?: string
          work_start?: string
          work_end?: string
          break_start?: string | null
          break_end?: string | null
          hourly_penalty?: number
          debt_block_hours?: number
          updated_at?: string
        },
        {
          free_start?: string
          free_end?: string
          work_start?: string
          work_end?: string
          break_start?: string | null
          break_end?: string | null
          hourly_penalty?: number
          debt_block_hours?: number
          updated_at?: string
        }
      >
      closures: TableDef<
        {
          id: string
          zone_id: string | null
          starts_at: string
          ends_at: string
          reason: string
          is_active: boolean
          created_at: string
          updated_at: string
        },
        {
          id?: string
          zone_id?: string | null
          starts_at: string
          ends_at: string
          reason: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        },
        {
          zone_id?: string | null
          starts_at?: string
          ends_at?: string
          reason?: string
          is_active?: boolean
          updated_at?: string
        }
      >
      bookings: TableDef<
        {
          id: string
          tenant_id: string
          zone_id: string
          driver_name: string
          driver_passport_front: string
          driver_passport_back: string
          car_plate_photo: string
          car_plate_text: string
          requested_datetime: string
          slot_start: string
          slot_end: string
          is_express: boolean
          express_fee: number
          status: BookingStatus
          admin_note: string | null
          arrived_at: string | null
          left_at: string | null
          completed_at: string | null
          logged_in: string | null
          logged_out: string | null
          overtime_minutes: number
          penalty_amount: number
          created_at: string
          updated_at: string
        },
        {
          id?: string
          tenant_id?: string
          zone_id?: string
          driver_name: string
          driver_passport_front: string
          driver_passport_back: string
          car_plate_photo: string
          car_plate_text: string
          requested_datetime: string
          is_express?: boolean
          status?: BookingStatus
          admin_note?: string | null
          arrived_at?: string | null
          left_at?: string | null
          completed_at?: string | null
          logged_in?: string | null
          logged_out?: string | null
          overtime_minutes?: number
          penalty_amount?: number
        },
        {
          zone_id?: string
          status?: BookingStatus
          admin_note?: string | null
          arrived_at?: string | null
          left_at?: string | null
          completed_at?: string | null
          logged_in?: string | null
          logged_out?: string | null
          updated_at?: string
        }
      >
      payments: TableDef<
        {
          id: string
          tenant_id: string
          amount: number
          note: string | null
          created_at: string
        },
        {
          id?: string
          tenant_id: string
          amount: number
          note?: string | null
          created_at?: string
        },
        {
          amount?: number
          note?: string | null
        }
      >
      notifications: TableDef<
        {
          id: string
          title: string
          body: string
          recipient_id: string | null
          created_by: string | null
          created_at: string
        },
        {
          id?: string
          title: string
          body: string
          recipient_id?: string | null
          created_by?: string | null
          created_at?: string
        },
        {
          title?: string
          body?: string
          recipient_id?: string | null
        }
      >
      notification_reads: TableDef<
        {
          notification_id: string
          user_id: string
          read_at: string
        },
        {
          notification_id: string
          user_id?: string
          read_at?: string
        },
        {
          read_at?: string
        }
      >
      audit_logs: TableDef<
        {
          id: string
          table_name: string
          record_id: string | null
          action: string
          old_data: Json | null
          new_data: Json | null
          actor_id: string | null
          created_at: string
        },
        {
          id?: string
          table_name: string
          record_id?: string | null
          action: string
          old_data?: Json | null
          new_data?: Json | null
          actor_id?: string | null
          created_at?: string
        },
        {
          table_name?: string
          record_id?: string | null
          action?: string
          old_data?: Json | null
          new_data?: Json | null
          actor_id?: string | null
        }
      >
    }
    Views: Record<string, never>
    Functions: {
      tenant_debt: {
        Args: { p_tenant_id: string }
        Returns: number
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
