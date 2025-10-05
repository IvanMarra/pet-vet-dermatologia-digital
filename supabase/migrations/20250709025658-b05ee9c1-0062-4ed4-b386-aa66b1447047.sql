-- Corrigir a URL da foto do veterinário
UPDATE site_settings
SET value = '"https://goopwdwyvhpoqqerrqbg.supabase.co/storage/v1/object/public/veterinarian-photos/1752027232986-4uj6xfb0vrf.jpeg"'
WHERE section = 'veterinarian'
  AND key = 'photo'
  AND id = 'a268ff0d-b3cb-4723-a179-362ece004b66';