/*
  # Add Missing Booking Fields

  1. Changes
    - Add selected_services JSONB column to store multiple selected services
    - Add payment_completed_at timestamp for tracking payment completion time
    - Make these fields nullable with appropriate defaults

  2. Purpose
    - Support multiple service selection in booking
    - Track when payment was completed
    - Align database with frontend requirements
*/

-- Add selected_services column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'selected_services'
  ) THEN
    ALTER TABLE bookings ADD COLUMN selected_services jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add payment_completed_at column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_completed_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_completed_at timestamptz;
  END IF;
END $$;