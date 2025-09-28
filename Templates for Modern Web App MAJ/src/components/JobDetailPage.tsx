import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Icon, PharmacistIcon, PharmaIcon } from './shared/Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface JobDetailPageProps {
  onNavigate: (page: string) => void;
}

export function JobDetailPage({ onNavigate }: JobDetailPageProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast(isSaved ? 'Mission retirée des favoris' : 'Mission sauvegardée !', {
      description: isSaved ? 'Vous pouvez la retrouver dans vos missions sauvegardées' : 'Retrouvez-la dans votre dashboard',
    });
  };

  const handleShare = (method: string) => {
    toast(`Mission partagée via ${method}`, {
      description: 'Le lien a été copié ou envoyé avec succès',
    });
    setShowShareDialog(false);
  };

  const handleApply = () => {
    toast('Candidature envoyée !', {
      description: 'Vous recevrez une réponse sous 24h',
    });
  };

  // Données d'exemple pour la mission
  const jobData = {
    id: "PHARM-2024-001",
    title: "Pharmacien titulaire - Remplacement",
    pharmacy: {
      name: "Pharmacie de la République",
      address: "15 Avenue de la République, 75011 Paris",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=120&h=120&fit=crop&crop=center"
    },
    type: "Remplacement",
    duration: "7 jours",
    startDate: "15 janvier 2024",
    endDate: "22 janvier 2024",
    hourlyRate: 28,
    bonusRate: 2,
    totalRate: 30,
    schedule: "9h00 - 19h00",
    weeklyHours: 56,
    totalEarnings: 1680,
    description: "Recherche pharmacien titulaire pour remplacement suite à congés. Pharmacie moderne située en centre-ville avec une clientèle fidèle et une équipe stable.",
    requirements: [
      "Diplôme de Docteur en Pharmacie",
      "Inscription à l'Ordre des Pharmaciens",
      "Expérience de 2 ans minimum",
      "Maîtrise des logiciels de gestion"
    ],
    benefits: [
      "Transport remboursé",
      "Parking gratuit",
      "Équipe bienveillante",
      "Formation logiciels"
    ],
    urgency: "normal", // normal, urgent, très urgent
    postedDate: "2 janvier 2024",
    applicants: 12,
    employer: {
      name: "Dr. Sophie Martin",
      role: "Pharmacien titulaire",
      experience: "15 ans d'expérience",
      rating: 4.8,
      verified: true
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-orange-600 bg-orange-100';
      case 'très urgent': return 'text-red-600 bg-red-100';
      default: return 'text-emerald-600 bg-emerald-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <motion.header 
        className="bg-white border-b border-gray-200 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('jobs')}
              className="text-gray-600 hover:text-gray-900"
            >
              <Icon name="ArrowLeft" className="mr-2" />
              Retour aux missions
            </Button>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className={`transition-all ${isSaved ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-600'}`}
                onClick={handleSave}
              >
                <Icon name="Heart" className={`mr-2 ${isSaved ? 'fill-red-500' : ''}`} />
                {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </Button>
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-gray-600">
                    <Icon name="Share2" className="mr-2" />
                    Partager
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Partager cette mission</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleShare('email')}
                      className="justify-start"
                    >
                      <Icon name="Mail" className="mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleShare('SMS')}
                      className="justify-start"
                    >
                      <Icon name="MessageSquare" className="mr-2" />
                      SMS
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleShare('WhatsApp')}
                      className="justify-start"
                    >
                      <Icon name="MessageCircle" className="mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleShare('copie du lien')}
                      className="justify-start"
                    >
                      <Icon name="Copy" className="mr-2" />
                      Copier le lien
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* En-tête de la mission */}
              <Card className="p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={`${getUrgencyColor(jobData.urgency)}`}>
                        {jobData.urgency}
                      </Badge>
                      <Badge variant="outline" className="text-pharma-primary border-pharma-primary">
                        <PharmacistIcon className="mr-1" />
                        {jobData.type}
                      </Badge>
                    </div>
                    <h1 className="text-3xl mb-2">{jobData.title}</h1>
                    <div className="flex items-center text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <Icon name="MapPin" className="mr-1" />
                        {jobData.pharmacy.address}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Calendar" className="mr-1" />
                        {jobData.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rémunération mise en avant */}
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 border border-emerald-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl text-emerald-600 mb-1">{jobData.hourlyRate}€/h</div>
                      <div className="text-sm text-gray-600">Taux de base</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-blue-600 mb-1">+{jobData.bonusRate}€/h</div>
                      <div className="text-sm text-gray-600">Bonus fidélité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-pharma-primary mb-1">{jobData.totalRate}€/h</div>
                      <div className="text-sm text-gray-600">Total/heure</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl text-pharma-primary mb-1">{jobData.totalEarnings}€</div>
                      <div className="text-sm text-gray-600">Total mission</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl mb-4 flex items-center">
                  <Icon name="FileText" className="mr-2 text-pharma-primary" />
                  Description de la mission
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">{jobData.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="mb-3 text-emerald-600">Prérequis</h3>
                    <ul className="space-y-2">
                      {jobData.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <Icon name="Check" className="mr-2 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="mb-3 text-blue-600">Avantages</h3>
                    <ul className="space-y-2">
                      {jobData.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Icon name="Star" className="mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Planning */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl mb-4 flex items-center">
                  <Icon name="Clock" className="mr-2 text-pharma-primary" />
                  Planning et horaires
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Début de mission</div>
                    <div className="text-pharma-primary">{jobData.startDate}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Fin de mission</div>
                    <div className="text-pharma-primary">{jobData.endDate}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Horaires quotidiens</div>
                    <div className="text-pharma-primary">{jobData.schedule}</div>
                  </div>
                </div>
              </Card>

              {/* À propos de la pharmacie */}
              <Card className="p-6">
                <h2 className="text-xl mb-4 flex items-center">
                  <Icon name="Building" className="mr-2 text-pharma-primary" />
                  À propos de la pharmacie
                </h2>
                <div className="flex items-start space-x-4">
                  <ImageWithFallback
                    src={jobData.pharmacy.logo}
                    alt={jobData.pharmacy.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg mb-2">{jobData.pharmacy.name}</h3>
                    <p className="text-gray-600 mb-2">{jobData.pharmacy.address}</p>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                        Pharmacie moderne
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Centre-ville
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              {/* Candidature */}
              <Card className="p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-2xl text-pharma-primary mb-2">{jobData.totalRate}€/h</div>
                  <div className="text-sm text-gray-600">incluant bonus fidélité</div>
                </div>
                
                <Button 
                  className="w-full mb-4 bg-pharma-primary hover:bg-pharma-primary/90"
                  size="lg"
                  onClick={handleApply}
                >
                  <Icon name="Send" className="mr-2" />
                  Postuler maintenant
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  <Icon name="Users" className="inline mr-1" />
                  {jobData.applicants} candidats intéressés
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>Publié le:</span>
                    <span>{jobData.postedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID Mission:</span>
                    <span className="text-pharma-primary">{jobData.id}</span>
                  </div>
                </div>
              </Card>

              {/* Employeur */}
              <Card className="p-6 mb-6">
                <h3 className="mb-4 flex items-center">
                  <Icon name="User" className="mr-2 text-pharma-primary" />
                  Employeur
                </h3>
                
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 bg-pharma-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" className="text-pharma-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4>{jobData.employer.name}</h4>
                      {jobData.employer.verified && (
                        <Icon name="ShieldCheck" className="text-emerald-500 w-4 h-4" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{jobData.employer.role}</p>
                    <p className="text-sm text-gray-600">{jobData.employer.experience}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="Star" className="text-yellow-400 w-4 h-4 mr-1" />
                    <span className="text-sm">{jobData.employer.rating}/5</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir profil
                  </Button>
                </div>
              </Card>

              {/* Localisation */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center">
                  <Icon name="MapPin" className="mr-2 text-pharma-primary" />
                  Localisation
                </h3>
                
                <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center mb-4">
                  <Icon name="Map" className="text-gray-400" />
                  <span className="text-gray-500 ml-2">Carte interactive</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Icon name="Navigation" className="mr-2 w-4 h-4" />
                    5 min à pied du métro
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Icon name="Car" className="mr-2 w-4 h-4" />
                    Parking disponible
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}