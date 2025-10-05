-- Atualizar o registro da foto para apontar para a imagem que existe no storage
UPDATE site_settings 
SET value = '"https://goopwdwyvhpoqqerrqbg.supabase.co/storage/v1/object/public/veterinarian-photos/1752027232986-4uj6xfb0vrfj.jpeg"'
WHERE section = 'veterinarian' 
  AND key = 'photo' 
  AND id = 'a268ff0d-b3cb-4723-a179-362ece004b66';