import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Icon } from './shared/Icons';
import { supabase } from '../lib/supabase';

interface DebugEnvPageProps {
  onNavigate: (page: string) => void;
}

export function DebugEnvPage({ onNavigate }: DebugEnvPageProps) {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    VITE_DEV_MODE: import.meta.env.VITE_DEV_MODE,
    VITE_DEBUG_ENV: import.meta.env.VITE_DEBUG_ENV,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      if (error) {
        console.error('Supabase connection error:', error);
        return { success: false, error: error.message };
      }
      return { success: true, count: data };
    } catch (error) {
      console.error('Supabase test failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const [connectionTest, setConnectionTest] = React.useState<{ success: boolean; error?: string; count?: any } | null>(null);

  const handleTestConnection = async () => {
    const result = await testSupabaseConnection();
    setConnectionTest(result);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getVariableStatus = (key: string, value: any) => {
    if (key.includes('SUPABASE_URL')) {
      return value && value.startsWith('https://') ? 'success' : 'error';
    }
    if (key.includes('SUPABASE_ANON_KEY')) {
      return value && value.startsWith('eyJ') ? 'success' : 'error';
    }
    return value ? 'success' : 'warning';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🔧 Debug Environment Variables</h1>
            <p className="text-gray-600 mt-2">Vérification des variables d'environnement et connexion Supabase</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('landing')}>
            <Icon name="ArrowLeft" className="mr-2" />
            Retour
          </Button>
        </div>

        {/* Status général */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Status Général</h2>
            <div className="flex space-x-2">
              <Badge className={getStatusColor('success')}>
                Mode: {import.meta.env.MODE}
              </Badge>
              <Badge className={getStatusColor('success')}>
                {import.meta.env.DEV ? 'Development' : 'Production'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(envVars).filter(key => envVars[key as keyof typeof envVars]).length}
              </div>
              <div className="text-sm text-blue-600">Variables définies</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {envVars.VITE_SUPABASE_URL && envVars.VITE_SUPABASE_ANON_KEY ? '✓' : '✗'}
              </div>
              <div className="text-sm text-green-600">Supabase configuré</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {envVars.VITE_APP_ENV || 'N/A'}
              </div>
              <div className="text-sm text-purple-600">Environnement</div>
            </div>
          </div>
        </Card>

        {/* Variables d'environnement */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Variables d'environnement</h2>
          <div className="space-y-3">
            {Object.entries(envVars).map(([key, value]) => {
              const status = getVariableStatus(key, value);
              const isSecret = key.includes('KEY') || key.includes('SECRET');
              const displayValue = value ? (isSecret ? `${String(value).substring(0, 10)}...` : String(value)) : 'undefined';

              return (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(status)}>
                      {status === 'success' ? '✓' : status === 'error' ? '✗' : '⚠'}
                    </Badge>
                    <code className="font-mono text-sm">{key}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 max-w-xs truncate">
                      {displayValue}
                    </span>
                    {value && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(String(value))}
                        title="Copier la valeur complète"
                      >
                        <Icon name="Copy" size="sm" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Test de connexion Supabase */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test de connexion Supabase</h2>
            <Button onClick={handleTestConnection} disabled={!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY}>
              <Icon name="Zap" className="mr-2" />
              Tester la connexion
            </Button>
          </div>

          {connectionTest && (
            <div className={`p-4 rounded-lg ${connectionTest.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={connectionTest.success ? "CheckCircle" : "XCircle"}
                      className={connectionTest.success ? "text-green-600" : "text-red-600"} />
                <span className={`font-semibold ${connectionTest.success ? 'text-green-800' : 'text-red-800'}`}>
                  {connectionTest.success ? 'Connexion réussie !' : 'Échec de la connexion'}
                </span>
              </div>
              {connectionTest.error && (
                <p className="text-red-600 text-sm mt-2">Erreur: {connectionTest.error}</p>
              )}
              {connectionTest.success && (
                <p className="text-green-600 text-sm mt-2">
                  La base de données est accessible et les credentials sont valides.
                </p>
              )}
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Configuration actuelle:</h3>
            <div className="text-sm space-y-1">
              <div>URL: <code className="bg-white px-1 rounded">{envVars.VITE_SUPABASE_URL || 'Non définie'}</code></div>
              <div>Anon Key: <code className="bg-white px-1 rounded">
                {envVars.VITE_SUPABASE_ANON_KEY ? `${String(envVars.VITE_SUPABASE_ANON_KEY).substring(0, 20)}...` : 'Non définie'}
              </code></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}