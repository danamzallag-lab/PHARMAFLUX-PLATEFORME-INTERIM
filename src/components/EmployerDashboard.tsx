import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Plus, 
  Bell, 
  Settings, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  UserCheck,
  Clock,
  Star,
  Briefcase,
  ArrowLeft,
  BarChart3,
  Target,
  Zap,
  Calculator,
  Gift,
  Shield,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Icon } from './shared/Icons';

interface EmployerDashboardProps {
  onNavigate: (page: string) => void;
}

export function EmployerDashboard({ onNavigate }: EmployerDashboardProps) {
  const activeJobs = [
    {
      id: 1,
      title: "Pharmacien remplaçant - Urgence weekend",
      department: "Officine",
      applications: 12,
      views: 45,
      status: "Actif",
      posted: "2h",
      salary: "30€/h",
      location: "Paris 15e",
      urgency: "Urgent",
      duration: "48h"
    },
    {
      id: 2,
      title: "Préparateur expérimenté - Garde de nuit",
      department: "Officine",
      applications: 8,
      views: 28,
      status: "Actif", 
      posted: "5h",
      salary: "25€/h",
      location: "Lyon 3e",
      urgency: "",
      duration: "8h"
    },
    {
      id: 3,
      title: "Pharmacien adjoint - CDD 3 mois",
      department: "Officine",
      applications: 23,
      views: 89,
      status: "Fermé",
      posted: "1sem",
      salary: "4200€/mois",
      location: "Marseille",
      urgency: "",
      duration: "3 mois"
    }
  ];

  const recentCandidates = [
    {
      name: "Dr. Sarah Martin",
      position: "Pharmacien titulaire",
      specialization: "Oncologie",
      match: 96,
      experience: "8 ans",
      location: "Paris",
      status: "Nouveau",
      verified: true,
      orderNumber: "75003145",
      avatar: "https://github.com/shadcn.png"
    },
    {
      name: "Thomas Durand",
      position: "Préparateur principal",
      specialization: "Pédiatrie",
      match: 91,
      experience: "5 ans", 
      location: "Lyon",
      status: "Présélectionné",
      verified: true,
      orderNumber: "69002789",
      avatar: "https://github.com/shadcn.png"
    },
    {
      name: "Julie Lefevre",
      position: "Étudiante 6ème année",
      specialization: "Cosmétologie",
      match: 85,
      experience: "2 ans stages",
      location: "Marseille",
      status: "Candidat",
      verified: true,
      orderNumber: "En cours",
      avatar: "https://github.com/shadcn.png"
    }
  ];

  const stats = [
    { label: "Missions actives", value: "5", change: "+2", icon: Briefcase },
    { label: "Candidatures", value: "43", change: "+8", icon: Users },
    { label: "Heures comblées", value: "234h", change: "+45h", icon: Clock },
    { label: "Économies réalisées", value: "2,450€", change: "+380€", icon: DollarSign }
  ];

  const savingsData = {
    monthlySpent: 8450,
    traditionalCost: 10900,
    savings: 2450,
    savingsPercentage: 22.5,
    loyaltyProgress: 67,
    hoursToReward: 33
  };

  const analyticsData = [
    { name: 'Lun', applications: 12, views: 45 },
    { name: 'Mar', applications: 19, views: 52 },
    { name: 'Mer', applications: 15, views: 48 },
    { name: 'Jeu', applications: 25, views: 67 },
    { name: 'Ven', applications: 22, views: 58 },
    { name: 'Sam', applications: 8, views: 23 },
    { name: 'Dim', applications: 6, views: 19 }
  ];

  const departmentData = [
    { name: 'Tech', value: 45, color: '#8B5CF6' },
    { name: 'Marketing', value: 25, color: '#06B6D4' },
    { name: 'Sales', value: 20, color: '#10B981' },
    { name: 'Design', value: 10, color: '#F59E0B' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
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
                <h1 className="text-xl">PharmaFlux Pro</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white border-0"
                onClick={() => onNavigate('create-job')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle mission
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('employer-page')}>
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>TC</AvatarFallback>
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
          <h1 className="text-3xl mb-2">Bonjour Pharmacie du Centre 👋</h1>
          <p className="text-gray-600">Gérez vos remplacements et trouvez les meilleurs professionnels pharma</p>
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
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl mb-1 text-emerald-700">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Calculateur d'économies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.27 }}
            >
              <Card className="p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border-emerald-200/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl flex items-center">
                    <Calculator className="w-6 h-6 mr-2 text-emerald-600" />
                    Économies ce mois
                  </h2>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    -{savingsData.savingsPercentage}% vs agences
                  </Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">{savingsData.savings}€</div>
                    <div className="text-sm text-gray-600">Économisé ce mois</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-600 mb-1">{savingsData.monthlySpent}€</div>
                    <div className="text-sm text-gray-600">Dépensé avec PharmaFlux</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-500 mb-1">{savingsData.traditionalCost}€</div>
                    <div className="text-sm text-gray-600">Coût agences classiques</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Programme fidélité employeur */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-emerald-200/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl flex items-center">
                    <Gift className="w-6 h-6 mr-2 text-yellow-500" />
                    Programme fidélité
                  </h2>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progression vers mission gratuite</span>
                    <span className="text-sm font-medium text-emerald-600">{savingsData.loyaltyProgress}/100h</span>
                  </div>
                  <Progress value={savingsData.loyaltyProgress} className="mb-2" />
                  <p className="text-xs text-gray-500">Plus que {savingsData.hoursToReward}h pour débloquer une mission gratuite de 20h !</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center text-sm text-yellow-800">
                    <Gift className="w-4 h-4 mr-2" />
                    Prochaine récompense : Mission gratuite de 20h maximum
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Analytics Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.33 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-emerald-200/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl">Activité de la semaine</h2>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Rapport complet
                  </Button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="applications" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="views" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Active Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h2 className="text-2xl mr-3">Missions actives</h2>
                  <Badge className="bg-red-100 text-red-700 flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    1 urgente
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </Button>
                  <Button variant="outline" size="sm">
                    Voir toutes
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {activeJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <Card className={`p-6 bg-white/80 backdrop-blur-sm border-emerald-200/50 hover:shadow-lg transition-all ${job.urgency === 'Urgent' ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
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
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{job.department}</span>
                                <div className="flex items-center">
                                  <Icon name="MapPin" className="w-4 h-4 mr-1" />
                                  {job.location}
                                </div>
                                <span>{job.salary}</span>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {job.duration}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={job.status === 'Actif' ? 'default' : 'secondary'}
                                className={job.status === 'Actif' ? 'bg-emerald-100 text-emerald-800' : ''}
                              >
                                {job.status}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl text-blue-600 mb-1">{job.applications}</div>
                              <div className="text-xs text-gray-600">Candidatures</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-2xl text-purple-600 mb-1">{job.views}</div>
                              <div className="text-xs text-gray-600">Vues</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl text-green-600 mb-1">{Math.round((job.applications / job.views) * 100)}%</div>
                              <div className="text-xs text-gray-600">Conversion</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Publié il y a {job.posted}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Voir les candidats
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
                                Gérer
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
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 bg-white/70 backdrop-blur-sm border-gray-200/50">
                <h3 className="mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => onNavigate('create-job')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une offre
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('jobs')}>
                    <Search className="w-4 h-4 mr-2" />
                    Chercher talents
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('create-job')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Planifier entretien
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Top Candidates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-white/70 backdrop-blur-sm border-gray-200/50">
                <h3 className="mb-4">Candidats recommandés</h3>
                <div className="space-y-4">
                  {recentCandidates.map((candidate, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm truncate">{candidate.name}</p>
                          <Badge 
                            className={`text-xs ${
                              candidate.match >= 90 ? 'bg-green-100 text-green-800' :
                              candidate.match >= 80 ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {candidate.match}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{candidate.position}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{candidate.experience}</span>
                          <Badge 
                            variant={
                              candidate.status === 'Nouveau' ? 'default' :
                              candidate.status === 'Finaliste' ? 'default' : 
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {candidate.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  size="sm"
                  onClick={() => toast('Candidats', { description: 'Redirection vers la liste des candidats' })}
                >
                  Voir tous les candidats
                </Button>
              </Card>
            </motion.div>

            {/* Department Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6 bg-white/70 backdrop-blur-sm border-gray-200/50">
                <h3 className="mb-4">Répartition par département</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: dept.color }}
                        ></div>
                        {dept.name}
                      </div>
                      <span className="text-gray-500">{dept.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50">
                <h3 className="mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Performance ce mois
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Objectif candidatures</span>
                    <span className="text-sm">167/200</span>
                  </div>
                  <Progress value={83.5} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">83.5% de l'objectif</span>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15% vs mois dernier
                    </div>
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