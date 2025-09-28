import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Plus,
  Bell,
  Settings,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Search,
  UserCheck,
  Clock,
  Star,
  MapPin,
  Briefcase,
  ArrowLeft,
  BarChart3,
  Target,
  Zap,
  Euro,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useMissions, useMissionStats } from '../hooks/useMissions';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmployerDashboardRealProps {
  onNavigate: (page: string) => void;
}

export function EmployerDashboardReal({ onNavigate }: EmployerDashboardRealProps) {
  const { profile, signOut } = useAuth();
  const { missions, loading: missionsLoading, refetch } = useMissions();
  const { stats, loading: statsLoading } = useMissionStats();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ouverte':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'assignée':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'terminée':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'ouverte': 'bg-orange-500/20 text-orange-400',
      'assignée': 'bg-green-500/20 text-green-400',
      'terminée': 'bg-blue-500/20 text-blue-400'
    };

    return variants[status as keyof typeof variants] || 'bg-gray-500/20 text-gray-400';
  };

  if (missionsLoading) {
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
                  className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Briefcase className="text-white w-5 h-5" />
                </motion.div>
                <div>
                  <h1 className="text-xl text-white font-bold">PharmaFlux Employeur</h1>
                  <p className="text-white/60 text-sm">{profile?.name || 'Mon entreprise'}</p>
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
                <p className="text-white/70 text-sm">Missions actives</p>
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats?.activeMissions || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total missions</p>
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats?.totalMissions || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Candidats matchés</p>
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats?.totalCandidatesMatched || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Temps de réponse</p>
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats?.avgResponseTime || '0h'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
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
              onClick={() => onNavigate('create-mission')}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 p-6 h-auto justify-start"
            >
              <Plus className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Nouvelle mission</div>
                <div className="text-sm opacity-90">Publier une offre d'intérim</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => refetch()}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 p-6 h-auto justify-start"
            >
              <Search className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Rechercher candidats</div>
                <div className="text-sm opacity-90">Base de talents</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 p-6 h-auto justify-start"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Rapports</div>
                <div className="text-sm opacity-90">Analytics détaillées</div>
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Liste des missions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-white font-semibold">Mes missions</h2>
            <div className="flex items-center space-x-2">
              <Badge className="bg-white/10 text-white">
                {missions.length} missions
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {missions.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 text-center">
                <Briefcase className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">Aucune mission</h3>
                <p className="text-white/70 mb-4">
                  Créez votre première mission pour commencer à recruter
                </p>
                <Button
                  onClick={() => onNavigate('create-mission')}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une mission
                </Button>
              </Card>
            ) : (
              missions.map((mission) => (
                <Card
                  key={mission.id}
                  className="bg-white/10 backdrop-blur-xl border-white/20 p-6 hover:bg-white/15 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl text-white font-semibold">{mission.title}</h3>
                        <Badge className={`${getStatusBadge(mission.status)} capitalize`}>
                          {getStatusIcon(mission.status)}
                          <span className="ml-1">{mission.status}</span>
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300 capitalize">
                          {mission.type}
                        </Badge>
                      </div>

                      <p className="text-white/70 mb-4 line-clamp-2">
                        {mission.description}
                      </p>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center text-white/70">
                          <MapPin className="w-4 h-4 mr-2" />
                          {mission.location}
                        </div>
                        <div className="flex items-center text-white/70">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(new Date(mission.start_date), 'dd MMMM yyyy', { locale: fr })}
                        </div>
                        <div className="flex items-center text-white/70">
                          <Clock className="w-4 h-4 mr-2" />
                          {mission.start_time} - {mission.end_time}
                        </div>
                        <div className="flex items-center text-emerald-400 font-semibold">
                          <Euro className="w-4 h-4 mr-1" />
                          {mission.hourly_rate} €/h
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Candidats
                      </Button>
                    </div>
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