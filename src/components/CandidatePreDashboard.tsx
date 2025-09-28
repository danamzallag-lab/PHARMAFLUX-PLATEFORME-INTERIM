import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Icon, PharmacistIcon, StudentIcon } from './shared/Icons';
import { PointsWallet, MissionCard, ReferralShareModal } from './shared/PharmaComponents';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CandidatePreDashboardProps {
  onNavigate: (page: string) => void;
}

export function CandidatePreDashboard({ onNavigate }: CandidatePreDashboardProps) {
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  
  const demoMissions = [
    {
      id: "1",
      title: "Préparateur Week-end",
      pharmacy: "Pharmacie Saint-Antoine",
      location: "Paris 11e",
      date: "21-22 Sept",
      duration: "16h",
      hourlyRate: 25,
      bonus: 2,
      type: 'officine' as const,
      status: "available",
      urgent: false
    },
    {
      id: "2",
      title: "Pharmacien remplaçant",
      pharmacy: "Pharmacie du Centre",
      location: "Paris 15e",
      date: "23 Sept",
      duration: "8h",
      hourlyRate: 28,
      bonus: 2,
      type: 'officine' as const,
      status: "available",
      urgent: false
    },
    {
      id: "3",
      title: "Pharmacien hospitalier",
      pharmacy: "Hôpital Cochin",
      location: "Paris 14e",
      date: "25 Sept",
      duration: "8h",
      hourlyRate: 32,
      bonus: 3,
      urgent: true,
      type: 'hospital' as const,
      status: "available"
    },
    {
      id: "4",
      title: "Préparateur de nuit",
      pharmacy: "Pharmacie des Champs",
      location: "Paris 8e",
      date: "26-27 Sept",
      duration: "10h",
      hourlyRate: 30,
      bonus: 4,
      type: 'officine' as const,
      status: "available",
      urgent: true
    }
  ];

  const features = [
    {
      icon: "DollarSign",
      title: "Mieux rémunéré",
      description: "Gagnez jusqu'à +4€/h grâce à notre système de fidélité progressif",
      highlight: "Bonus plafonné équitable"
    },
    {
      icon: "Star",
      title: "Missions prioritaires",
      description: "Accédez en premier aux nouvelles opportunités selon votre niveau",
      highlight: "Notification instantanée"
    },
    {
      icon: "MapPin",
      title: "Missions locales",
      description: "Trouvez des remplacements près de chez vous rapidement",
      highlight: "Rayon personnalisable"
    },
    {
      icon: "Shield",
      title: "100% sécurisé",
      description: "Paiements garantis, assurances incluses, contrats vérifiés",
      highlight: "Confiance totale"
    }
  ];

  const handleApplyToMission = () => {
    // Rediriger vers l'inscription avec un paramètre pour indiquer l'intention de postuler
    onNavigate('auth-register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('landing')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Icon name="ArrowLeft" size="sm" className="mr-2" />
                Retour
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="Cross" className="text-white" />
                </div>
                <h1 className="text-xl font-semibold">PharmaFlux Candidat</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => onNavigate('auth')}>
                Se connecter
              </Button>
              <Button 
                className="bg-pharma-primary hover:bg-pharma-primary/90"
                onClick={() => onNavigate('auth-register')}
              >
                <Icon name="UserPlus" size="sm" className="mr-2" />
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero candidat */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <PharmacistIcon />
            <div className="ml-4">
              <StudentIcon />
            </div>
          </div>
          <h1 className="text-4xl mb-4">
            Trouvez votre prochaine mission
            <span className="text-pharma-primary"> mieux rémunérée</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Accédez aux meilleures opportunités de remplacement, gagnez des points de fidélité 
            et bénéficiez d'un bonus salarial progressif plafonné.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-pharma-primary hover:bg-pharma-primary/90"
              onClick={() => onNavigate('auth-register')}
            >
              <Icon name="UserPlus" className="mr-2" />
              Commencer maintenant
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('jobs')}
            >
              <Icon name="Search" className="mr-2" />
              Voir les missions
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Avantages candidat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl mb-6">Vos avantages PharmaFlux</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="p-6 pharma-gradient-card hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-pharma-primary/20 rounded-full flex items-center justify-center mb-4">
                      <Icon name={feature.icon as any} className="text-pharma-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {feature.description}
                    </p>
                    <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                      {feature.highlight}
                    </Badge>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Missions disponibles - Aperçu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Missions disponibles</h2>
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('jobs')}
                >
                  <Icon name="ArrowRight" size="sm" className="mr-2" />
                  Voir toutes les missions
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="available">Disponibles ({demoMissions.length})</TabsTrigger>
                  <TabsTrigger value="urgent">Urgentes ({demoMissions.filter(m => m.urgent).length})</TabsTrigger>
                  <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
                </TabsList>
                
                <TabsContent value="available" className="mt-6">
                  <div className="space-y-4">
                    {demoMissions.slice(0, 3).map((mission) => (
                      <Card key={mission.id} className="p-6 pharma-gradient-card hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-pharma-primary/20 rounded-lg flex items-center justify-center">
                              <Icon name={mission.type === 'hospital' ? 'Building2' : 'Cross'} className="text-pharma-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">{mission.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{mission.pharmacy}</p>
                              <div className="flex items-center text-sm text-muted-foreground space-x-4">
                                <div className="flex items-center">
                                  <Icon name="MapPin" size="sm" className="mr-1" />
                                  {mission.location}
                                </div>
                                <div className="flex items-center">
                                  <Icon name="Calendar" size="sm" className="mr-1" />
                                  {mission.date}
                                </div>
                                <div className="flex items-center">
                                  <Icon name="Clock" size="sm" className="mr-1" />
                                  {mission.duration}
                                </div>
                              </div>
                            </div>
                          </div>
                          {mission.urgent && (
                            <Badge className="bg-red-100 text-red-800">
                              <Icon name="AlertCircle" size="xs" className="mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-lg font-bold text-pharma-primary">
                              {mission.hourlyRate}€/h
                            </div>
                            {mission.bonus && (
                              <Badge className="bg-emerald-100 text-emerald-800">
                                +{mission.bonus}€/h bonus
                              </Badge>
                            )}
                          </div>
                          <Button 
                            className="bg-pharma-primary hover:bg-pharma-primary/90"
                            onClick={handleApplyToMission}
                          >
                            <Icon name="Send" size="sm" className="mr-2" />
                            Postuler
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => onNavigate('jobs')}
                      className="px-8"
                    >
                      Voir {demoMissions.length - 3} autres missions
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="urgent" className="mt-6">
                  <div className="space-y-4">
                    {demoMissions.filter(m => m.urgent).map((mission) => (
                      <Card key={mission.id} className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <Icon name={mission.type === 'hospital' ? 'Building2' : 'Cross'} className="text-red-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold">{mission.title}</h3>
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  <Icon name="AlertCircle" size="xs" className="mr-1" />
                                  URGENT
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{mission.pharmacy}</p>
                              <div className="flex items-center text-sm text-muted-foreground space-x-4">
                                <div className="flex items-center">
                                  <Icon name="MapPin" size="sm" className="mr-1" />
                                  {mission.location}
                                </div>
                                <div className="flex items-center">
                                  <Icon name="Calendar" size="sm" className="mr-1" />
                                  {mission.date}
                                </div>
                                <div className="flex items-center">
                                  <Icon name="Clock" size="sm" className="mr-1" />
                                  {mission.duration}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-lg font-bold text-red-600">
                              {mission.hourlyRate}€/h
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-800">
                              +{mission.bonus}€/h bonus urgent
                            </Badge>
                          </div>
                          <Button 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleApplyToMission}
                          >
                            <Icon name="Send" size="sm" className="mr-2" />
                            Postuler maintenant
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="today" className="mt-6">
                  <div className="text-center py-12">
                    <Icon name="Calendar" className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune mission aujourd'hui</h3>
                    <p className="text-muted-foreground mb-4">
                      Les missions pour aujourd'hui sont déjà pourvues. Consultez les missions à venir.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('available')}
                    >
                      Voir les missions disponibles
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-6">
            {/* Démonstration du portefeuille de points */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Système de points</h3>
                  <Badge className="bg-emerald-100 text-emerald-800">DEMO</Badge>
                </div>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-pharma-primary mb-1">2,450</div>
                  <div className="text-sm text-muted-foreground">Points disponibles</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Niveau actuel</span>
                    <Badge className="bg-gray-100 text-gray-800">Argent</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bonus actuel</span>
                    <span className="font-semibold text-pharma-primary">+2€/h</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="text-xs text-muted-foreground text-center">
                    550 points pour le niveau Or (+3€/h)
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-pharma-primary hover:bg-pharma-primary/90"
                  onClick={() => onNavigate('auth-register')}
                >
                  Débloquer maintenant
                </Button>
              </Card>
            </motion.div>

            {/* Parrainage */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 pharma-gradient-card">
                <div className="flex items-center mb-4">
                  <Icon name="Gift" className="text-pharma-primary mr-2" />
                  <h3 className="text-lg font-semibold">Programme de parrainage</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Invitez vos collègues et gagnez 500 points bonus par parrainage validé
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Exemple de code</div>
                    <div className="text-lg font-bold text-pharma-primary">SARAH2024</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-center">
                    <div className="p-2 bg-emerald-50 rounded">
                      <div className="font-semibold text-emerald-800">+500pts</div>
                      <div className="text-emerald-600">Par parrain</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-800">+250pts</div>
                      <div className="text-blue-600">Par filleul</div>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => onNavigate('auth-register')}
                >
                  <Icon name="Share2" size="sm" className="mr-2" />
                  Obtenir mon code
                </Button>
              </Card>
            </motion.div>

            {/* Statistiques d'exemple */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 pharma-gradient-card">
                <h3 className="text-lg font-semibold mb-4">Statistiques PharmaFlux</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Missions publiées</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Candidats actifs</span>
                    <span className="font-semibold">893</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Temps de réponse moyen</span>
                    <span className="font-semibold text-pharma-primary">2.3h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Satisfaction moyenne</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">4.8</span>
                      <Icon name="Star" size="sm" className="text-yellow-500 fill-current" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* CTA sticky */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="sticky top-24"
            >
              <Card className="p-6 bg-gradient-to-br from-pharma-primary to-pharma-secondary text-white">
                <h3 className="font-semibold mb-2">Prêt à commencer ?</h3>
                <p className="text-sm text-white/90 mb-4">
                  Créez votre compte en 2 minutes et accédez immédiatement aux missions
                </p>
                <Button 
                  size="lg" 
                  className="w-full bg-white text-pharma-primary hover:bg-white/90"
                  onClick={() => onNavigate('auth-register')}
                >
                  <Icon name="UserPlus" className="mr-2" />
                  Créer mon compte
                </Button>
                <div className="text-center mt-3">
                  <Button 
                    variant="link" 
                    size="sm"
                    className="text-white/80 hover:text-white underline"
                    onClick={() => onNavigate('auth')}
                  >
                    Déjà inscrit ? Se connecter
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}