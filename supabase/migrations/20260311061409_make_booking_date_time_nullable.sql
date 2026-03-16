/*
  # Make preferred_date and preferred_time nullable in bookings table

  1. Changes
    - Alter preferred_date column to allow NULL values
    - Alter preferred_time column to allow NULL values
    
  2. Reason
    - Users should be able to submit bookings without specifying exact date/time
    - Admin can confirm the date/time later
*/

-- Make preferred_date nullable
ALTER TABLE bookings 
  ALTER COLUMN preferred_date DROP NOT NULL;

-- Make preferred_time nullable  
ALTER TABLE bookings 
  ALTER COLUMN preferred_time DROP NOT NULL;
