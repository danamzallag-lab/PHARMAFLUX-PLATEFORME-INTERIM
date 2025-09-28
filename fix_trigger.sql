-- Corriger le trigger de création de profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user();

-- Fonction corrigée pour gérer les cas d'erreur
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que l'email existe
  IF NEW.email IS NULL THEN
    RETURN NEW;
  END IF;

  -- Insérer le profil avec gestion d'erreur
  INSERT INTO public.profiles (auth_uid, email, type, name)
  VALUES (
    NEW.id,
    NEW.email,
    'candidat',
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  )
  ON CONFLICT (auth_uid) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, log et continuer sans faire planter l'inscription
    RAISE NOTICE 'Erreur création profil pour %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();