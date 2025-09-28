import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { emailService } from '../services/emailService';
import { toast } from 'sonner';

interface TestEmailPageProps {
  onNavigate: (page: string) => void;
}

export function TestEmailPage({ onNavigate }: TestEmailPageProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  const handleTestEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const result = await emailService.sendTestEmail();
      setResult(result);

      if (result.ok) {
        toast.success('Email de test envoyé avec succès !');
      } else {
        toast.error(`Erreur : ${result.error}`);
      }
    } catch (error: any) {
      const errorResult = { ok: false, error: error.message };
      setResult(errorResult);
      toast.error(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Header */}
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
              <Mail className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-3xl text-white mb-4">Test Email Resend</h1>
              <p className="text-white/70">Testez l'intégration email de PharmaFlux</p>
            </div>

            {/* Configuration */}
            <div className="mb-8 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Configuration actuelle</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">API Key :</span>
                  <span className="text-green-400">
                    {import.meta.env.RESEND_API_KEY ? '✓ Configurée' : '✗ Manquante'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Email From :</span>
                  <span className="text-white">{import.meta.env.EMAIL_FROM}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Email To :</span>
                  <span className="text-white">{import.meta.env.TEST_EMAIL_TO}</span>
                </div>
              </div>
            </div>

            {/* Bouton de test */}
            <div className="text-center mb-8">
              <Button
                onClick={handleTestEmail}
                disabled={loading || !import.meta.env.RESEND_API_KEY}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 px-8 py-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Envoyer email de test
                  </>
                )}
              </Button>
            </div>

            {/* Résultat */}
            {result && (
              <div className={`p-4 rounded-lg ${
                result.ok
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <div className="flex items-center mb-2">
                  {result.ok ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mr-2" />
                  )}
                  <span className={`font-semibold ${result.ok ? 'text-green-400' : 'text-red-400'}`}>
                    {result.ok ? 'Succès !' : 'Erreur'}
                  </span>
                </div>
                {result.ok ? (
                  <p className="text-green-300">
                    Email envoyé avec succès vers {import.meta.env.TEST_EMAIL_TO}
                  </p>
                ) : (
                  <p className="text-red-300">
                    {result.error}
                  </p>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-blue-300 font-semibold mb-2">ℹ️ Note</h4>
              <p className="text-blue-200 text-sm">
                Cette fonctionnalité envoie des emails directement depuis le client.
                En production, il est recommandé d'utiliser des endpoints API côté serveur
                pour sécuriser les clés API.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}