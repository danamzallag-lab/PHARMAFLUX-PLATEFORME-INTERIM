import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useRealMissions, useRealApplications } from '../hooks/useRealMissions';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Calendar, Clock, Euro, Heart, Building, ArrowLeft, Search, Filter, Briefcase, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface JobsPageRealProps {
  onNavigate: (page: string) => void;
}

export function JobsPageReal({ onNavigate }: JobsPageRealProps) {
  const { profile } = useAuth();
  const { missions, loading, error } = useRealMissions();
  const { applyToMission, applications } = useRealApplications();

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [minSalary, setMinSalary] = useState('');

  // Calculer les missions filtrées
  const filteredMissions = useMemo(() => {
    if (!missions) return [];

    return missions.filter(mission => {
      // Filtre par terme de recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          mission.title.toLowerCase().includes(searchLower) ||
          mission.description?.toLowerCase().includes(searchLower) ||
          mission.location?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Filtre par type
      if (selectedType && mission.type !== selectedType) {
        return false;
      }

      // Filtre par salaire minimum
      if (minSalary && mission.hourly_rate && mission.hourly_rate < parseFloat(minSalary)) {
        return false;
      }

      return true;
    });
  }, [missions, searchTerm, selectedType, minSalary]);

  // Vérifier si l'utilisateur a déjà candidaté à une mission
  const hasApplied = (missionId: string) => {
    return applications.some(app => app.mission_id === missionId);
  };

  const handleApply = async (missionId: string, missionTitle: string) => {
    if (!profile) {
      toast.error('Vous devez être connecté pour postuler');
      return;
    }

    if (hasApplied(missionId)) {
      toast.info('Vous avez déjà candidaté à cette mission');
      return;
    }

    const result = await applyToMission(missionId);

    if (result.success) {
      toast.success(`Candidature envoyée pour "${missionTitle}" !`);
    } else {
      toast.error('Erreur lors de la candidature: ' + (result.error?.message || 'Erreur inconnue'));
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date non définie';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl text-red-600 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">Impossible de charger les missions</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('candidate-dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">Missions disponibles</h1>
              <Badge className="bg-blue-100 text-blue-800">
                {filteredMissions.length} missions
              </Badge>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-200/50">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une mission, un lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200 focus:border-blue-400"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`${showFilters ? 'bg-blue-50 border-blue-300' : ''}`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>

            {/* Filtres expandables */}
            {showFilters && (
              <motion.div
                className="mt-6 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de mission</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les types</SelectItem>
                        <SelectItem value="officine">Officine</SelectItem>
                        <SelectItem value="hopital">Hôpital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salaire minimum (€/h)</label>
                    <Input
                      type="number"
                      placeholder="Ex: 25"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      className="bg-white/80"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedType('');
                        setMinSalary('');
                      }}
                      className="w-full"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Missions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredMissions.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600 mb-2">Aucune mission trouvée</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedType || minSalary
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Aucune mission n\'est disponible pour le moment'
                }
              </p>
              {(searchTerm || selectedType || minSalary) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setMinSalary('');
                  }}
                >
                  Voir toutes les missions
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredMissions.map((mission) => (
                <Card
                  key={mission.id}
                  className="p-6 hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm border-gray-200/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {mission.title}
                            </h3>
                            <Badge className={`capitalize ${
                              mission.type === 'officine'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {mission.type}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {mission.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            {mission.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {mission.location}
                              </div>
                            )}

                            {mission.start_date && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(mission.start_date)}
                                {mission.end_date && mission.end_date !== mission.start_date && (
                                  <span> - {formatDate(mission.end_date)}</span>
                                )}
                              </div>
                            )}

                            {mission.start_time && mission.end_time && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(mission.start_time)} - {formatTime(mission.end_time)}
                              </div>
                            )}
                          </div>

                          {mission.profiles && (
                            <div className="mt-3 text-sm text-gray-600">
                              <span className="font-medium">Employeur :</span> {mission.profiles.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3 ml-6">
                      {mission.hourly_rate && (
                        <div className="text-right">
                          <div className="flex items-center text-emerald-600 font-bold text-lg">
                            <Euro className="w-5 h-5 mr-1" />
                            {mission.hourly_rate} €/h
                          </div>
                        </div>
                      )}

                      {hasApplied(mission.id) ? (
                        <Button disabled className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Candidature envoyée
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleApply(mission.id, mission.title)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                        >
                          <Briefcase className="w-4 h-4 mr-2" />
                          Postuler
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}