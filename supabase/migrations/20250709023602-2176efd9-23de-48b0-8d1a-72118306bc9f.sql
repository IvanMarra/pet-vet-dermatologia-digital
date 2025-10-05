-- Limpar a URL da foto inválida que não existe mais no storage
UPDATE site_settings 
SET value = '""'
WHERE section = 'veterinarian' 
  AND key = 'photo' 
  AND value = '"https://goopwdwyvhpoqqerrqbg.supabase.co/storage/v1/object/public/veterinarian-photos/1751336736810-7g5hjycx6f2.jpeg"';