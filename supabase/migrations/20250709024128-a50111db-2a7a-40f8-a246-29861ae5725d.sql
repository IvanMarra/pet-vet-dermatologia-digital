-- Remover o registro da foto inválida (sem aspas duplas na condição)
DELETE FROM site_settings 
WHERE section = 'veterinarian' 
  AND key = 'photo' 
  AND value = 'https://goopwdwyvhpoqqerrqbg.supabase.co/storage/v1/object/public/veterinarian-photos/1751336736810-7g5hjycx6f2.jpeg';

-- Confirmar se ainda existem registros de foto para veterinarian
SELECT * FROM site_settings WHERE section = 'veterinarian' AND key = 'photo';