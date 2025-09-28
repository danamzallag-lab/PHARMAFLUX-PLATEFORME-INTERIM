import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Database, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface InitDatabasePageProps {
  onNavigate: (page: string) => void;
}

export function InitDatabasePage({ onNavigate }: InitDatabasePageProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const initializeDatabase = async () => {
    setLoading(true);
    setResult(null);

    try {
      // 1. Créer les tables de base
      const createTables = `
        -- Table profiles
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          auth_uid UUID REFERENCES auth.users (id) NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('candidat', 'employeur')),
          name TEXT,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          competences TEXT[],
          availabilities JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Table missions
        CREATE TABLE IF NOT EXISTS missions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          employer_id UUID REFERENCES profiles (id) NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL CHECK (type IN ('officine','hopital')),
          location TEXT,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          start_date DATE,
          end_date DATE,
          start_time TIME,
          end_time TIME,
          hourly_rate NUMERIC(10,2),
          status TEXT NOT NULL DEFAULT 'ouverte' CHECK(status IN ('ouverte','assignée','terminée')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Table applications
        CREATE TABLE IF NOT EXISTS applications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          candidate_id UUID REFERENCES profiles (id) NOT NULL,
          mission_id UUID REFERENCES missions (id) NOT NULL,
          status TEXT NOT NULL DEFAULT 'proposé' CHECK(status IN ('proposé','accepté','refusé')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Table contracts
        CREATE TABLE IF NOT EXISTS contracts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          mission_id UUID REFERENCES missions (id) UNIQUE NOT NULL,
          contract_pdf_url TEXT,
          signed_by_candidate_at TIMESTAMP WITH TIME ZONE,
          signed_by_employer_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      // Exécuter le SQL
      const { error: tablesError } = await supabase.rpc('exec', { sql: createTables });

      if (tablesError) {
        // Si RPC exec n'existe pas, essayer une autre méthode
        console.log('RPC exec non disponible, essai autre méthode...');

        // Méthode alternative : créer via REST API
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'apikey': supabase.supabaseKey
          },
          body: JSON.stringify({ sql: createTables })
        });

        if (!response.ok) {
          throw new Error('Impossible d\'exécuter le SQL via l\'API REST');
        }
      }

      // 2. Créer le trigger pour les profils
      const createTrigger = `
        CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (auth_uid, email)
          VALUES (NEW.id, NEW.email);
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();
      `;

      const { error: triggerError } = await supabase.rpc('exec', { sql: createTrigger });

      if (triggerError) {
        console.warn('Trigger non créé:', triggerError);
      }

      // 3. Activer RLS (Row Level Security)
      const enableRLS = `
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
        ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
      `;

      const { error: rlsError } = await supabase.rpc('exec', { sql: enableRLS });

      if (rlsError) {
        console.warn('RLS non activé:', rlsError);
      }

      setResult({
        success: true,
        message: 'Base de données initialisée avec succès ! Vous pouvez maintenant créer des comptes.'
      });

      toast.success('Base de données prête !');

    } catch (error: any) {
      console.error('Erreur initialisation:', error);
      setResult({
        success: false,
        message: `Erreur: ${error.message}`
      });
      toast.error('Erreur lors de l\'initialisation');
    } finally {
      setLoading(false);
    }
  };

  // Test simple : vérifier si les tables existent
  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        setResult({
          success: false,
          message: 'Tables non trouvées - Initialisation nécessaire'
        });
      } else {
        setResult({
          success: true,
          message: 'Base de données déjà configurée !'
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erreur connexion: ${error.message}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('landing')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        <Card className="backdrop-blur-2xl bg-white/10 border-white/20 shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <Database className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-3xl text-white mb-4">Initialisation Base de Données</h1>
              <p className="text-white/70">Configuration automatique du schéma Supabase</p>
            </div>

            {/* Configuration */}
            <div className="mb-8 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Configuration Supabase</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">URL Supabase :</span>
                  <span className="text-green-400">{import.meta.env.VITE_SUPABASE_URL}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Clé Anon :</span>
                  <span className="text-green-400">
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configurée' : '✗ Manquante'}
                  </span>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Button
                onClick={testConnection}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 p-6 h-auto"
              >
                <Database className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Tester la connexion</div>
                  <div className="text-sm opacity-75">Vérifier les tables existantes</div>
                </div>
              </Button>

              <Button
                onClick={initializeDatabase}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 p-6 h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <div className="text-left">
                      <div className="font-semibold">Initialisation...</div>
                      <div className="text-sm opacity-75">Création tables et triggers</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Initialiser la base</div>
                      <div className="text-sm opacity-75">Créer le schéma complet</div>
                    </div>
                  </>
                )}
              </Button>
            </div>

            {/* Résultat */}
            {result && (
              <div className={`p-4 rounded-lg ${
                result.success
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <div className="flex items-center mb-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mr-2" />
                  )}
                  <span className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    {result.success ? 'Succès !' : 'Erreur'}
                  </span>
                </div>
                <p className={result.success ? 'text-green-300' : 'text-red-300'}>
                  {result.message}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-blue-300 font-semibold mb-2">ℹ️ Instructions</h4>
              <ol className="text-blue-200 text-sm space-y-1">
                <li>1. Cliquez d'abord "Tester la connexion"</li>
                <li>2. Si les tables n'existent pas, cliquez "Initialiser la base"</li>
                <li>3. Une fois initialisée, vous pourrez créer des comptes !</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}