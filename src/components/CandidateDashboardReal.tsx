import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Bell,
  Settings,
  Calendar,
  MapPin,
  Clock,
  Euro,
  ArrowLeft,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Award,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useApplications, useMissionStats } from '../hooks/useMissions';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface CandidateDashboardRealProps {
  onNavigate: (page: string) => void;
}

export function CandidateDashboardReal({ onNavigate }: CandidateDashboardRealProps) {
  const { profile, signOut } = useAuth();
  const { applications, loading, updateApplicationStatus } = useApplications();
  const { stats, loading: statsLoading } = useMissionStats();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  const handleApplicationAction = async (applicationId: string, status: 'accepté' | 'refusé', missionTitle: string) => {
    const result = await updateApplicationStatus(applicationId, status);

    if (result.success) {
      toast.success(
        status === 'accepté'
          ? `Mission "${missionTitle}" acceptée ! Le contrat va être généré.`
          : `Mission "${missionTitle}" refusée.`
      );
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'proposé':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'accepté':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'refusé':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'proposé': 'bg-orange-500/20 text-orange-400',
      'accepté': 'bg-green-500/20 text-green-400',
      'refusé': 'bg-red-500/20 text-red-400'
    };

    return variants[status as keyof typeof variants] || 'bg-gray-500/20 text-gray-400';
  };

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'text-orange-400';
      case 'Argent': return 'text-gray-300';
      case 'Or': return 'text-yellow-400';
      case 'Platine': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        className="border-b border-white/10 bg-black/20 backdrop-blur-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('landing')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Button>

              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <User className="text-white w-5 h-5" />
                </motion.div>
                <div>
                  <h1 className="text-xl text-white font-bold">PharmaFlux Candidat</h1>
                  <p className="text-white/60 text-sm">{profile?.name || 'Mon profil'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Candidatures</p>
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats?.totalApplications || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Acceptées</p>
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats?.acceptedApplications || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Points fidélité</p>
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats?.loyaltyPoints || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Niveau</p>
                <p className={`text-2xl font-bold ${getLoyaltyColor(stats?.currentLevel || 'Bronze')}`}>
                  {statsLoading ? '...' : stats?.currentLevel || 'Bronze'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-white font-semibold">Actions rapides</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => onNavigate('candidate-page')}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 p-6 h-auto justify-start"
            >
              <User className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Profil candidat</div>
                <div className="text-sm opacity-90">Mettre à jour mes infos</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigate('jobs')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 p-6 h-auto justify-start"
            >
              <Briefcase className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Missions disponibles</div>
                <div className="text-sm opacity-90">Parcourir les offres</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 p-6 h-auto justify-start"
            >
              <TrendingUp className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Statistiques</div>
                <div className="text-sm opacity-90">Mes performances</div>
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Candidatures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-white font-semibold">Mes candidatures</h2>
            <div className="flex items-center space-x-2">
              <Badge className="bg-white/10 text-white">
                {applications.length} candidatures
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 text-center">
                <Briefcase className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">Aucune candidature</h3>
                <p className="text-white/70 mb-4">
                  Les missions correspondant à votre profil apparaîtront ici automatiquement
                </p>
                <Button
                  onClick={() => onNavigate('jobs')}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Voir les missions
                </Button>
              </Card>
            ) : (
              applications.map((application) => (
                <Card
                  key={application.id}
                  className="bg-white/10 backdrop-blur-xl border-white/20 p-6 hover:bg-white/15 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl text-white font-semibold">
                          {application.missions?.title}
                        </h3>
                        <Badge className={`${getStatusBadge(application.status)} capitalize`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1">{application.status}</span>
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300 capitalize">
                          {application.missions?.type}
                        </Badge>
                      </div>

                      <p className="text-white/70 mb-4 line-clamp-2">
                        {application.missions?.description}
                      </p>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center text-white/70">
                          <MapPin className="w-4 h-4 mr-2" />
                          {application.missions?.location}
                        </div>
                        <div className="flex items-center text-white/70">
                          <Calendar className="w-4 h-4 mr-2" />
                          {application.missions?.start_date &&
                            format(new Date(application.missions.start_date), 'dd MMMM yyyy', { locale: fr })}
                        </div>
                        <div className="flex items-center text-white/70">
                          <Clock className="w-4 h-4 mr-2" />
                          {application.missions?.start_time} - {application.missions?.end_time}
                        </div>
                        <div className="flex items-center text-emerald-400 font-semibold">
                          <Euro className="w-4 h-4 mr-1" />
                          {application.missions?.hourly_rate} €/h
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-white/60">
                        <span>Employeur : {application.profiles?.name}</span>
                        <span className="mx-2">•</span>
                        <span>Candidature reçue le {format(new Date(application.created_at), 'dd MMMM yyyy', { locale: fr })}</span>
                      </div>
                    </div>

                    {application.status === 'proposé' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleApplicationAction(application.id, 'refusé', application.missions?.title)}
                          variant="outline"
                          size="sm"
                          className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Refuser
                        </Button>
                        <Button
                          onClick={() => handleApplicationAction(application.id, 'accepté', application.missions?.title)}
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accepter
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}