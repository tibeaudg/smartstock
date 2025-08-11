-- Zorg dat user_id uniek is per gebruiker in beide tabellen
ALTER TABLE company_types ADD CONSTRAINT company_types_user_id_unique UNIQUE(user_id);
ALTER TABLE onboarding_answers ADD CONSTRAINT onboarding_answers_user_id_unique UNIQUE(user_id);
