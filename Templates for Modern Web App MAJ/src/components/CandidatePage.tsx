import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Icon, PharmacistIcon, StudentIcon } from './shared/Icons';
import { PointsWallet, MissionCard, ReferralShareModal } from './shared/PharmaComponents';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CandidatePageProps {
  onNavigate: (page: string) => void;
}

export function CandidatePage({ onNavigate }: CandidatePageProps) {
  const [showReferralModal, setShowReferralModal] = useState(false);
  
  const candidateProfile = {
    name: "Dr. Sarah Martin",
    type: "Pharmacien titulaire",
    points: 2450,
    currentTier: 'Argent' as const,
    nextTierPoints: 3000,
    bonusPerHour: 2,
    maxBonus: 4,
    priorityLevel: 2,
    referralCode: "SARAH2024",
    completedMissions: 23,
    totalEarnings: 12450
  };

  const recentMissions = [
    {
      id: "1",
      title: "Pharmacien remplaçant",
      pharmacy: "Pharmacie du Centre",
      location: "Paris 15e",
      date: "15-16 Sept",
      duration: "14h",
      hourlyRate: 28,
      bonus: 2,
      type: 'officine' as const,
      status: "completed"
    },
    {
      id: "2", 
      title: "Préparateur Week-end",
      pharmacy: "Pharmacie Saint-Antoine",
      location: "Paris 11e",
      date: "21-22 Sept",
      duration: "16h",
      hourlyRate: 25,
      type: 'officine' as const,
      status: "upcoming"
    },
    {
      id: "3",
      title: "Pharmacien hospitalier",
      pharmacy: "Hôpital Cochin",
      location: "Paris 14e", 
      date: "25 Sept",
      duration: "8h",
      hourlyRate: 32,
      urgent: true,
      type: 'hospital' as const,
      status: "available"
    }
  ];

  const onboardingSteps = [
    { id: 1, title: "Informations personnelles", completed: true },
    { id: 2, title: "Diplômes et certifications", completed: true },
    { id: 3, title: "Expérience professionnelle", completed: true },
    { id: 4, title: "Préférences de mission", completed: false },
    { id: 5, title: "Informations bancaires", completed: false }
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const totalSteps = onboardingSteps.length;
  const completionRate = (completedSteps / totalSteps) * 100;

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
            <Button 
              className="bg-pharma-primary hover:bg-pharma-primary/90"
              onClick={() => onNavigate('jobs')}
            >
              <Icon name="Search" size="sm" className="mr-2" />
              Voir les missions
            </Button>
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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accédez aux meilleures opportunités de remplacement, gagnez des points de fidélité 
            et bénéficiez d'un bonus salarial progressif plafonné.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progression onboarding */}
            {completionRate < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Icon name="Target" className="text-pharma-primary mr-2" />
                      Complétez votre profil
                    </h3>
                    <Badge className="bg-pharma-primary/20 text-pharma-primary">
                      {completedSteps}/{totalSteps} étapes
                    </Badge>
                  </div>
                  <Progress value={completionRate} className="mb-4" />
                  <div className="grid md:grid-cols-2 gap-4">
                    {onboardingSteps.filter(step => !step.completed).slice(0, 2).map((step) => (
                      <Button 
                        key={step.id} 
                        variant="outline" 
                        size="sm" 
                        className="justify-start h-auto p-3"
                      >
                        <Icon name="Plus" size="sm" className="mr-2 text-pharma-primary" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{step.title}</div>
                          <div className="text-xs text-muted-foreground">Requis pour postuler</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Avantages candidat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl mb-6">Vos avantages PharmaFlux</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 text-center pharma-gradient-card">
                  <div className="w-12 h-12 bg-pharma-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="DollarSign" className="text-pharma-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Mieux rémunéré</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gagnez jusqu'à +4€/h grâce à notre système de fidélité progressif
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                    Bonus plafonné équitable
                  </Badge>
                </Card>

                <Card className="p-6 text-center pharma-gradient-card">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Star" className="text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Missions prioritaires</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Accédez en premier aux nouvelles opportunités selon votre niveau
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    Niveau {candidateProfile.priorityLevel}
                  </Badge>
                </Card>

                <Card className="p-6 text-center pharma-gradient-card">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="MapPin" className="text-orange-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Missions locales</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Trouvez des remplacements près de chez vous rapidement
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                    Rayon personnalisable
                  </Badge>
                </Card>
              </div>
            </motion.div>

            {/* Historique missions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Vos missions</h2>
                <Button variant="outline" size="sm">
                  <Icon name="Calendar" size="sm" className="mr-2" />
                  Voir tout l'historique
                </Button>
              </div>

              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upcoming">À venir</TabsTrigger>
                  <TabsTrigger value="available">Disponibles</TabsTrigger>
                  <TabsTrigger value="completed">Terminées</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="mt-6">
                  <div className="space-y-4">
                    {recentMissions.filter(m => m.status === 'upcoming').map((mission) => (
                      <MissionCard key={mission.id} mission={mission} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="available" className="mt-6">
                  <div className="space-y-4">
                    {recentMissions.filter(m => m.status === 'available').map((mission) => (
                      <MissionCard 
                        key={mission.id} 
                        mission={mission}
                        onApply={(id) => console.log('Apply to', id)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="mt-6">
                  <div className="space-y-4">
                    {recentMissions.filter(m => m.status === 'completed').map((mission) => (
                      <div key={mission.id}>
                        <MissionCard mission={mission} />
                        <div className="mt-2 ml-6">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Icon name="CheckCircle" size="xs" className="mr-1" />
                            Mission terminée • +{mission.hourlyRate * parseInt(mission.duration)}€
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-6">
            {/* Portefeuille de points */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PointsWallet
                points={candidateProfile.points}
                currentTier={candidateProfile.currentTier}
                nextTierPoints={candidateProfile.nextTierPoints}
                bonusPerHour={candidateProfile.bonusPerHour}
                maxBonus={candidateProfile.maxBonus}
              />
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
                  <h3 className="text-lg font-semibold">Parrainage</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Invitez vos collègues et gagnez des points bonus
                </p>
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setShowReferralModal(true)}
                  >
                    <Icon name="Share2" size="sm" className="mr-2" />
                    Partager mon code
                  </Button>
                  <div className="text-center">
                    <div className="text-lg font-bold text-pharma-primary">
                      {candidateProfile.referralCode}
                    </div>
                    <div className="text-xs text-muted-foreground">Votre code de parrainage</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 pharma-gradient-card">
                <h3 className="text-lg font-semibold mb-4">Vos statistiques</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Missions complétées</span>
                    <span className="font-semibold">{candidateProfile.completedMissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Revenus totaux</span>
                    <span className="font-semibold text-pharma-primary">
                      {candidateProfile.totalEarnings.toLocaleString()}€
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Taux de satisfaction</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">4.9</span>
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
              <Button 
                size="lg" 
                className="w-full bg-pharma-primary hover:bg-pharma-primary/90"
                onClick={() => onNavigate('jobs')}
              >
                <Icon name="Search" className="mr-2" />
                Voir les missions disponibles
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de parrainage */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <ReferralShareModal
            referralCode={candidateProfile.referralCode}
            referralLink={`https://pharmaflux.fr/register?ref=${candidateProfile.referralCode}`}
            onClose={() => setShowReferralModal(false)}
          />
        </div>
      )}
    </div>
  );
}