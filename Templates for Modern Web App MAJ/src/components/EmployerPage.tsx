import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Icon } from './shared/Icons';
import { SavingsCalculator, ProgressRing } from './shared/PharmaComponents';

interface EmployerPageProps {
  onNavigate: (page: string) => void;
}

export function EmployerPage({ onNavigate }: EmployerPageProps) {
  const [showQuickPublish, setShowQuickPublish] = useState(false);
  
  const employerProfile = {
    name: "Pharmacie du Centre",
    hoursUsed: 67,
    totalHours: 100,
    freeHoursEarned: 0,
    savingsThisMonth: 1250,
    averageFillTime: "4.2h",
    candidateRating: 4.8
  };

  const quickPublishForm = {
    position: '',
    date: '',
    duration: '',
    hourlyRate: 25,
    description: '',
    urgent: false
  };

  const loyaltyBenefits = [
    {
      title: "Mission offerte",
      description: "20h gratuites après 100h commandées",
      progress: employerProfile.hoursUsed,
      max: 100,
      unlocked: false,
      icon: "Gift"
    },
    {
      title: "Remise PharmaConsult",
      description: "15% de réduction sur l'abonnement",
      progress: 100,
      max: 100,
      unlocked: true,
      icon: "Calculator"
    },
    {
      title: "Support prioritaire",
      description: "Assistance dédiée 7j/7",
      progress: 100,
      max: 100,
      unlocked: true,
      icon: "MessageCircle"
    }
  ];

  const upcomingFeatures = [
    {
      title: "Dashboard statistiques avancé",
      description: "Analytics détaillées de vos recrutements",
      comingSoon: "Q1 2024",
      icon: "BarChart3"
    },
    {
      title: "Intégration PharmaConsult",
      description: "Synchronisation avec votre logiciel",
      comingSoon: "Q2 2024", 
      icon: "Zap"
    },
    {
      title: "Pool de candidats premium",
      description: "Accès exclusif aux meilleurs profils",
      comingSoon: "Q2 2024",
      icon: "Users"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon name="Building" className="text-white" />
                </div>
                <h1 className="text-xl font-semibold">PharmaFlux Employeur</h1>
              </div>
            </div>
            <Button 
              className="bg-pharma-primary hover:bg-pharma-primary/90"
              onClick={() => setShowQuickPublish(true)}
            >
              <Icon name="Plus" size="sm" className="mr-2" />
              Publier une mission
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero employeur */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Icon name="Building" size="lg" className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl mb-4">
            Trouvez des talents
            <span className="text-pharma-primary"> moins cher</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Profils vérifiés, tarifs transparents, publication en 60 secondes. 
            Économisez jusqu'à 40% par rapport aux agences traditionnelles.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Calculateur d'économies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl mb-6">Calculez vos économies</h2>
              <SavingsCalculator 
                onCalculate={(hourlyRate, hours, savings) => {
                  console.log('Savings calculated:', { hourlyRate, hours, savings });
                  setShowQuickPublish(true);
                }}
              />
            </motion.div>

            {/* Avantages employeur */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl mb-6">Pourquoi choisir PharmaFlux ?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 text-center pharma-gradient-card">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="TrendingUp" className="text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">40% moins cher</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Commission réduite et transparente sans frais cachés
                  </p>
                  <div className="text-lg font-bold text-green-600">15% vs 27%</div>
                </Card>

                <Card className="p-6 text-center pharma-gradient-card">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Shield" className="text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Profils vérifiés</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Diplômes, inscriptions Ordre et expériences contrôlés
                  </p>
                  <div className="text-lg font-bold text-blue-600">100% vérifiés</div>
                </Card>

                <Card className="p-6 text-center pharma-gradient-card">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Zap" className="text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Publication rapide</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Créez votre annonce en moins de 60 secondes
                  </p>
                  <div className="text-lg font-bold text-purple-600">&lt; 60s</div>
                </Card>
              </div>
            </motion.div>

            {/* Statistiques performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl mb-6">Vos performances</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 pharma-gradient-card">
                  <h3 className="font-semibold mb-4">Délai de pourvoi moyen</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pharma-primary mb-2">
                      {employerProfile.averageFillTime}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      65% plus rapide que la moyenne du secteur
                    </p>
                  </div>
                </Card>

                <Card className="p-6 pharma-gradient-card">
                  <h3 className="font-semibold mb-4">Satisfaction candidats</h3>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-pharma-primary">
                        {employerProfile.candidateRating}
                      </span>
                      <Icon name="Star" className="text-yellow-500 fill-current" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Basé sur {23} évaluations
                    </p>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Avantages à venir */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl mb-6">Fonctionnalités à venir</h2>
              <div className="space-y-4">
                {upcomingFeatures.map((feature, index) => (
                  <Card key={index} className="p-6 pharma-gradient-card">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={feature.icon as any} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{feature.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {feature.comingSoon}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-6">
            {/* Programme fidélité employeur */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 pharma-gradient-card">
                <div className="flex items-center mb-4">
                  <Icon name="Award" className="text-pharma-primary mr-2" />
                  <h3 className="text-lg font-semibold">Fidélité Employeur</h3>
                </div>
                
                <div className="text-center mb-6">
                  <ProgressRing 
                    value={employerProfile.hoursUsed} 
                    max={employerProfile.totalHours}
                    size="lg"
                    color="primary"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{employerProfile.hoursUsed}h</div>
                      <div className="text-xs text-muted-foreground">sur {employerProfile.totalHours}h</div>
                    </div>
                  </ProgressRing>
                  <p className="text-sm text-muted-foreground mt-2">
                    {employerProfile.totalHours - employerProfile.hoursUsed}h restantes pour une mission offerte
                  </p>
                </div>

                <div className="space-y-3">
                  {loyaltyBenefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${
                        benefit.unlocked 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        benefit.unlocked ? 'bg-green-500/20' : 'bg-gray-300/50'
                      }`}>
                        <Icon 
                          name={benefit.icon as any} 
                          size="sm" 
                          className={benefit.unlocked ? 'text-green-600' : 'text-gray-500'} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{benefit.title}</h4>
                          {benefit.unlocked ? (
                            <Icon name="Check" size="sm" className="text-green-600" />
                          ) : (
                            <Icon name="Lock" size="sm" className="text-gray-400" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Économies du mois */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
                <div className="flex items-center mb-4">
                  <Icon name="TrendingUp" className="text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">Économies ce mois</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {employerProfile.savingsThisMonth.toLocaleString()}€
                  </div>
                  <p className="text-sm text-muted-foreground">
                    vs agences traditionnelles
                  </p>
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-xs text-green-800 text-center">
                    <Icon name="Info" size="xs" className="inline mr-1" />
                    Sur une année : {(employerProfile.savingsThisMonth * 12).toLocaleString()}€ d'économies
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 pharma-gradient-card">
                <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowQuickPublish(true)}
                  >
                    <Icon name="Plus" size="sm" className="mr-2" />
                    Publier une mission
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => onNavigate('employer-dashboard')}
                  >
                    <Icon name="BarChart3" size="sm" className="mr-2" />
                    Voir le dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => onNavigate('jobs')}
                  >
                    <Icon name="Users" size="sm" className="mr-2" />
                    Chercher des candidats
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal publication rapide */}
      {showQuickPublish && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto pharma-gradient-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Publier une mission</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowQuickPublish(false)}
                >
                  <Icon name="X" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Poste</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un poste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pharmacien">Pharmacien remplaçant</SelectItem>
                        <SelectItem value="preparateur">Préparateur en pharmacie</SelectItem>
                        <SelectItem value="etudiant">Étudiant en pharmacie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Durée</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 heures</SelectItem>
                        <SelectItem value="8">8 heures (journée)</SelectItem>
                        <SelectItem value="12">12 heures</SelectItem>
                        <SelectItem value="custom">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Taux horaire (€)</label>
                    <Input type="number" placeholder="25" min="15" max="50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description (optionnelle)</label>
                  <Textarea 
                    placeholder="Détails sur la mission, compétences requises..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <input type="checkbox" id="urgent" className="rounded" />
                  <label htmlFor="urgent" className="text-sm">
                    <span className="font-medium text-red-600">Mission urgente</span>
                    <span className="text-red-600"> (+2€/h bonus)</span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Coût estimé : <span className="font-semibold">200€</span> (TTC, commission incluse)
                  </div>
                  <Button className="bg-pharma-primary hover:bg-pharma-primary/90">
                    <Icon name="Send" size="sm" className="mr-2" />
                    Publier maintenant
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}