-- Atualizar para uma string vazia JSON válida
UPDATE site_settings 
SET value = '""'
WHERE section = 'veterinarian' 
  AND key = 'photo' 
  AND id = 'a268ff0d-b3cb-4723-a179-362ece004b66';