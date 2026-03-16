/*
  # Add missing columns to bookings table

  1. Changes
    - Add `consultation_fee` (numeric) - Stores the consultation fee amount
    - Add `selected_services` (jsonb) - Stores array of selected additional services
    - Add `payment_completed_at` (timestamptz) - Timestamp when payment was completed

  2. Notes
    - These columns are optional (nullable) to maintain backwards compatibility
    - consultation_fee defaults to 500
    - selected_services stores JSON array of service objects
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'consultation_fee'
  ) THEN
    ALTER TABLE bookings ADD COLUMN consultation_fee numeric DEFAULT 500;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'selected_services'
  ) THEN
    ALTER TABLE bookings ADD COLUMN selected_services jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'payment_completed_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_completed_at timestamptz;
  END IF;
END $$;
