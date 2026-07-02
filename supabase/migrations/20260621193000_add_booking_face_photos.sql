-- Add private face photo uploads for booking flow.

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS face_photo_urls jsonb DEFAULT '[]'::jsonb;

INSERT INTO storage.buckets (id, name, public)
VALUES ('booking-face-photos', 'booking-face-photos', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload booking face photos" ON storage.objects;
CREATE POLICY "Users can upload booking face photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'booking-face-photos');

DROP POLICY IF EXISTS "Users can view own booking face photos" ON storage.objects;
CREATE POLICY "Users can view own booking face photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'booking-face-photos'
  AND (
    is_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM bookings
      WHERE bookings.id::text = split_part(storage.objects.name, '/', 1)
      AND (
        bookings.user_id = auth.uid()
        OR bookings.email = (
          SELECT email
          FROM auth.users
          WHERE id = auth.uid()
        )
      )
    )
  )
);

DROP POLICY IF EXISTS "Users can update own booking face photos" ON storage.objects;
CREATE POLICY "Users can update own booking face photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'booking-face-photos'
  AND (
    is_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM bookings
      WHERE bookings.id::text = split_part(storage.objects.name, '/', 1)
      AND bookings.user_id = auth.uid()
    )
  )
)
WITH CHECK (bucket_id = 'booking-face-photos');
