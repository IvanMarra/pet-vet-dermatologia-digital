-- Atualizar o telefone de contato para testar
UPDATE site_settings
SET value = '"(11) 98765-4321"', updated_at = now()
WHERE section = 'contact'
  AND key = 'phone'
  AND id = 'e4b45074-c118-43bc-8c2f-542da4fdbbcd';