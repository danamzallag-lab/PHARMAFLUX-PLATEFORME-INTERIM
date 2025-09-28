import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  Search, 
  Bell, 
  Settings, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  Eye,
  Heart,
  Star,
  Filter,
  ChevronRight,
  Calendar,
  DollarSign,
  Target,
  BookOpen,
  Award,
  ArrowLeft,
  Gift,
  Zap,
  Shield,
  QrCode,
  Copy,
  Share2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Icon, PharmacistIcon, PreparatorIcon } from './shared/Icons';

interface CandidateDashboardProps {
  onNavigate: (page: string) => void;
}

export function CandidateDashboard({ onNavigate }: CandidateDashboardProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState({
    diploma: false,
    orderNumber: false,
    specializations: false
  });

  const handleProfileAction = (action: string) => {
    switch (action) {
      case 'diploma':
        setProfileCompletion(prev => ({ ...prev, diploma: !prev.diploma }));
        toast(profileCompletion.diploma ? 'Diplôme retiré' : 'Diplôme ajouté !');
        break;
      case 'order':
        setProfileCompletion(prev => ({ ...prev, orderNumber: !prev.orderNumber }));
        toast(profileCompletion.orderNumber ? 'N° Ordre retiré' : 'N° Ordre validé !');
        break;
      case 'specializations':
        setProfileCompletion(prev => ({ ...prev, specializations: !prev.specializations }));
        toast(profileCompletion.specializations ? 'Spécialisations retirées' : 'Spécialisations ajoutées !');
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'profile':
        setShowProfileDialog(true);
        break;
      case 'schedule':
        setShowScheduleDialog(true);
        break;
      case 'referral':
        setShowReferralDialog(true);
        break;
      case 'qr':
        setShowQrDialog(true);
        break;
      default:
        toast(`Action ${action} sélectionnée`, {
          description: 'Fonctionnalité en cours d\'implémentation'
        });
    }
  };

  const generateReferralCode = () => {
    return 'PHARMA-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast('Copié !', { description: 'Code copié dans le presse-papier' });
  };

  const referralCode = generateReferralCode();

  const completionPercentage = () => {
    const completed = Object.values(profileCompletion).filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  };

  const recentJobs = [
    {
      id: 1,
      title: "Pharmacien titulaire remplaçant",
      company: "Pharmacie du Centre",
      location: "Paris 15e, France",
      salary: "28€/h + 2€ fidélité",
      type: "Remplacement",
      urgency: "Urgent",
      match: 95,
      posted: "30min",
      saved: false,
      duration: "3 jours"
    },
    {
      id: 2,
      title: "Préparateur en pharmacie - Garde weekend",
      company: "Pharmacie des Lilas",
      location: "Lyon 3e, France", 
      salary: "22€/h + 1€ fidélité",
      type: "Garde",
      urgency: "",
      match: 92,
      posted: "1h",
      saved: true,
      duration: "48h"
    },
    {
      id: 3,
      title: "Étudiant en pharmacie - Mission été",
      company: "Pharmacie Moderne",
      location: "Marseille, France",
      salary: "15€/h",
      type: "CDD été",
      urgency: "",
      match: 88,
      posted: "2h",
      saved: false,
      duration: "2 mois"
    }
  ];

  const applications = [
    { company: "Pharmacie du Centre", position: "Pharmacien", status: "Confirmé", date: "15 Sept" },
    { company: "Pharmacie des Lilas", position: "Préparateur", status: "En cours", date: "12 Sept" },
    { company: "Pharmacie Moderne", position: "Étudiant", status: "Refusé", date: "10 Sept" }
  ];

  const stats = [
    { label: "Missions réalisées", value: "47", change: "+5", icon: "check" },
    { label: "Heures travaillées", value: "234h", change: "+12h", icon: "clock" },
    { label: "Palier actuel", value: "Gold", change: "Argent→Gold", icon: "star" },
    { label: "Bonus gagné", value: "+142€", change: "+25€", icon: "dollar" }
  ];

  const loyaltyStats = {
    currentLevel: "Gold",
    points: 2150,
    nextLevel: "Platine", 
    pointsToNext: 350,
    bonusPerHour: 3,
    totalEarned: 142
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('landing')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Icon name="Cross" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl">PharmaFlux</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('candidate-page')}>
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-3xl mb-2">Bonjour Marie 👋</h1>
          <p className="text-gray-600">Vos missions pharmacie personnalisées vous attendent</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border-emerald-200/50">
                    <div className="text-2xl mb-1 text-emerald-700">{stat.value}</div>
                    <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                    <div className="text-xs text-emerald-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Loyalty Program Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <Card className="p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border-emerald-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />
                    Programme de fidélité
                  </h3>
                  <Badge className="bg-yellow-100 text-yellow-800">{loyaltyStats.currentLevel}</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progression vers {loyaltyStats.nextLevel}</span>
                      <span className="text-sm font-medium text-emerald-600">{loyaltyStats.points}/{loyaltyStats.points + loyaltyStats.pointsToNext}</span>
                    </div>
                    <Progress value={(loyaltyStats.points / (loyaltyStats.points + loyaltyStats.pointsToNext)) * 100} className="mb-2" />
                    <p className="text-xs text-gray-500">Plus que {loyaltyStats.pointsToNext} points pour Platine !</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">+{loyaltyStats.bonusPerHour}€/h</div>
                      <div className="text-xs text-gray-600">Bonus actuel</div>
                    </div>
                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                      <div className="text-lg font-bold text-cyan-600">{loyaltyStats.totalEarned}€</div>
                      <div className="text-xs text-gray-600">Total gagné</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Missions urgentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h2 className="text-2xl mr-3">Missions recommandées</h2>
                  <Badge className="bg-red-100 text-red-700 flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    2 urgentes
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate('jobs')}
                  >
                    Voir tout
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {recentJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <Card className={`p-6 bg-white/80 backdrop-blur-sm border-emerald-200/50 hover:shadow-lg transition-all cursor-pointer ${job.urgency === 'Urgent' ? 'ring-2 ring-red-200 border-red-300' : ''}`}
                          onClick={() => onNavigate('job-detail')}>
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4 flex-1">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-emerald-100 flex items-center justify-center">
                            <Icon name="Cross" className="w-6 h-6 text-emerald-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center mb-1">
                                  <h3 className="mr-2">{job.title}</h3>
                                  {job.urgency === 'Urgent' && (
                                    <Badge className="bg-red-100 text-red-700">
                                      <Zap className="w-3 h-3 mr-1" />
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm">{job.company}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  className={`${
                                    job.match >= 90 ? 'bg-emerald-100 text-emerald-800' :
                                    job.match >= 80 ? 'bg-cyan-100 text-cyan-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {job.match}% match
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Heart className={`w-4 h-4 ${job.saved ? 'fill-red-500 text-red-500' : ''}`} />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Icon name="MapPin" className="w-4 h-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {job.salary}
                              </div>
                              <Badge variant="outline">{job.type}</Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {job.duration}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                Publié il y a {job.posted}
                              </div>
                              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white border-0">
                                {job.urgency === 'Urgent' ? 'Postuler urgent' : 'Postuler'}
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Profile Completion Pharma */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-emerald-600" />
                    Optimisez votre profil pharmacie
                  </h3>
                  <Badge className="bg-emerald-100 text-emerald-800">{completionPercentage()}%</Badge>
                </div>
                <Progress value={completionPercentage()} className="mb-4" />
                <div className="grid md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`justify-start border-emerald-200 hover:bg-emerald-50 ${profileCompletion.diploma ? 'bg-emerald-50 border-emerald-300' : ''}`}
                    onClick={() => handleProfileAction('diploma')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Diplôme pharma
                    {profileCompletion.diploma && <Icon name="Check" className="w-4 h-4 ml-auto text-emerald-600" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`justify-start border-emerald-200 hover:bg-emerald-50 ${profileCompletion.orderNumber ? 'bg-emerald-50 border-emerald-300' : ''}`}
                    onClick={() => handleProfileAction('order')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    N° Ordre
                    {profileCompletion.orderNumber && <Icon name="Check" className="w-4 h-4 ml-auto text-emerald-600" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`justify-start border-emerald-200 hover:bg-emerald-50 ${profileCompletion.specializations ? 'bg-emerald-50 border-emerald-300' : ''}`}
                    onClick={() => handleProfileAction('specializations')}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Spécialisations
                    {profileCompletion.specializations && <Icon name="Check" className="w-4 h-4 ml-auto text-emerald-600" />}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-emerald-200/50">
                <h3 className="mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-emerald-200 hover:bg-emerald-50"
                    onClick={() => onNavigate('jobs')}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Missions urgentes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-emerald-200 hover:bg-emerald-50"
                    onClick={() => handleQuickAction('profile')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Mon profil pharmacie
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-emerald-200 hover:bg-emerald-50"
                    onClick={() => handleQuickAction('schedule')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Planning gardes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-emerald-200 hover:bg-emerald-50"
                    onClick={() => handleQuickAction('referral')}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Programme parrainage
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-emerald-200/50">
                <h3 className="mb-4">Missions récentes</h3>
                <div className="space-y-3">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-emerald-100 last:border-0">
                      <div>
                        <div className="text-sm">{app.company}</div>
                        <div className="text-xs text-gray-500">{app.position}</div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            app.status === 'Confirmé' ? 'default' :
                            app.status === 'Refusé' ? 'destructive' : 
                            'secondary'
                          }
                          className={`text-xs ${
                            app.status === 'Confirmé' ? 'bg-emerald-100 text-emerald-800' : ''
                          }`}
                        >
                          {app.status}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{app.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Profile Strength */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200/50">
                <h3 className="mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  Réputation pharmacie
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fiabilité</span>
                    <span className="text-sm font-medium text-emerald-600">Excellente</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="text-center p-2 bg-emerald-50 rounded">
                      <div className="text-sm font-bold text-emerald-600">4.9/5</div>
                      <div className="text-xs text-gray-600">Note employeurs</div>
                    </div>
                    <div className="text-center p-2 bg-cyan-50 rounded">
                      <div className="text-sm font-bold text-cyan-600">97%</div>
                      <div className="text-xs text-gray-600">Ponctualité</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-emerald-600" />
              Mon profil pharmacie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Nom complet</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">Marie Dupont</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Profession</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">Pharmacien titulaire</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Expérience</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">5 ans</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">N° Ordre</label>
                  <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-700">12345</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Spécialisations</label>
                  <div className="mt-1 p-3 bg-emerald-50 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-emerald-100 text-emerald-800">Orthopédie</Badge>
                      <Badge className="bg-emerald-100 text-emerald-800">Homéopathie</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Disponibilité</label>
                  <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-700">Disponible</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
                Fermer
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Modifier profil
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
              Planning gardes et disponibilités
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="p-2 bg-gray-100 rounded">{day}</div>
              ))}
              {Array.from({length: 28}, (_, i) => (
                <div key={i} className={`p-2 rounded cursor-pointer ${
                  i % 7 === 5 || i % 7 === 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-3">Prochaines gardes</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-sm">Garde weekend</div>
                    <div className="text-xs text-gray-600">15-16 Janvier</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm">Garde nuit</div>
                    <div className="text-xs text-gray-600">20 Janvier</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3">Disponibilités préférées</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Weekends</span>
                    <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Gardes de nuit</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Parfois</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Jours fériés</span>
                    <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Fermer
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Referral Dialog */}
      <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Gift className="w-5 h-5 mr-2 text-emerald-600" />
              Programme de parrainage
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg">
              <h3 className="text-lg mb-2">Gagnez des bonus !</h3>
              <p className="text-sm text-gray-600 mb-4">
                Parrainez un collègue pharmacien et recevez chacun 50€ de bonus
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-xs text-gray-500 mb-1">Votre code de parrainage</div>
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono text-emerald-600">{referralCode}</code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(referralCode)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleQuickAction('qr')}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Générer QR Code
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm">Vos parrainages</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Dr. Martin</span>
                  <Badge className="bg-emerald-100 text-emerald-800">+50€</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Sophie L.</span>
                  <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReferralDialog(false)}>
                Fermer
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-emerald-600" />
              QR Code de parrainage
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                    <div className="text-xs text-gray-500">QR Code généré</div>
                    <div className="text-xs text-gray-400 mt-1">{referralCode}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Faites scanner ce QR code pour partager votre code de parrainage
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => copyToClipboard(`https://pharmaflux.app/ref/${referralCode}`)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier lien
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowQrDialog(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}