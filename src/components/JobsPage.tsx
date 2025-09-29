import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Icon } from './shared/Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRealMissions, useRealApplications } from '../hooks/useRealMissions';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Calendar, Clock, Euro, Heart, Building, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface JobsPageProps {
  onNavigate: (page: string) => void;
}

export function JobsPage({ onNavigate }: JobsPageProps) {
  const { profile } = useAuth();
  const { missions, loading, error } = useRealMissions();
  const { applyToMission, applications } = useRealApplications();

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryRange, setSalaryRange] = useState([10, 50]); // Ajusté pour les tarifs horaires
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const jobs = [
    {
      id: 1,
      title: "Développeur Full Stack Senior",
      company: "TechCorp",
      location: "Paris, France",
      salary: "65k - 85k €",
      type: "CDI",
      match: 95,
      description: "Rejoignez notre équipe dynamique pour développer des applications web innovantes avec React, Node.js et TypeScript.",
      logo: "https://images.unsplash.com/photo-1758518729685-f88df7890776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwbWVldGluZ3xlbnwxfHx8fDE3NTg3NDQwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      posted: "2h",
      saved: false,
      tags: ["React", "Node.js", "TypeScript", "AWS"],
      companySize: "100-500",
      featured: true
    },
    {
      id: 2,
      title: "Product Manager Senior",
      company: "StartupX",
      location: "Lyon, France",
      salary: "55k - 70k €",
      type: "CDI",
      match: 88,
      description: "Pilotez le développement produit d'une startup en hyper-croissance dans le domaine de la fintech.",
      logo: "https://images.unsplash.com/photo-1758630737900-a28682c5aa69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTg3MjU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      posted: "4h",
      saved: true,
      tags: ["Product", "Strategy", "Analytics", "Agile"],
      companySize: "50-100",
      featured: false
    },
    {
      id: 3,
      title: "UX Designer",
      company: "DesignStudio",
      location: "Remote",
      salary: "45k - 60k €",
      type: "Freelance",
      match: 82,
      description: "Créez des expériences utilisateur exceptionnelles pour des clients prestigieux dans le luxury retail.",
      logo: "https://images.unsplash.com/photo-1758523670550-223a01cd7764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU4NzkxNjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      posted: "1j",
      saved: false,
      tags: ["Figma", "Prototyping", "User Research", "Design System"],
      companySize: "10-50",
      featured: false
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "DataFlow",
      location: "Toulouse, France",
      salary: "70k - 90k €",
      type: "CDI",
      match: 91,
      description: "Exploitez le potentiel des données pour résoudre des défis business complexes avec Python et ML.",
      logo: "https://images.unsplash.com/photo-1684483165545-baaa4d88f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwb2ZmaWNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTg3OTI0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      posted: "3j",
      saved: false,
      tags: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      companySize: "200-1000",
      featured: true
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Nantes, France",
      salary: "60k - 75k €",
      type: "CDI",
      match: 86,
      description: "Automatisez et optimisez les infrastructures cloud pour des applications critiques.",
      logo: "https://images.unsplash.com/photo-1758630737900-a28682c5aa69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTg3MjU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      posted: "5j",
      saved: true,
      tags: ["Docker", "Kubernetes", "AWS", "Terraform"],
      companySize: "100-500",
      featured: false
    },
    {
      id: 6,
      title: "Marketing Manager",
      company: "GrowthCo",
      location: "Bordeaux, France",
      salary: "50k - 65k €",
      type: "CDI",
      match: 79,
      description: "Développez des stratégies marketing innovantes pour accélérer la croissance de nos produits SaaS.",
      logo: "https://images.unsplash.com/photo-1758523670550-223a01cd7764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU4NzkxNjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      posted: "1sem",
      saved: false,
      tags: ["Growth Hacking", "SEO", "Content", "Analytics"],
      companySize: "50-100",
      featured: false
    }
  ];

  const featuredJobs = jobs.filter(job => job.featured);
  const allJobs = jobs;

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
              <Icon name="ArrowLeft" size="sm" className="mr-2" />
              Retour au dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="Search" className="text-white" />
              </div>
              <h1 className="text-xl">Recherche d'emplois</h1>
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
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un poste, une entreprise..."
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
                  <Icon name="Filter" size="sm" className="mr-2" />
                  Filtres {showFilters && <Icon name="X" size="sm" className="ml-2" />}
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div 
                className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label className="block text-sm mb-2">Localisation</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paris">Paris</SelectItem>
                      <SelectItem value="lyon">Lyon</SelectItem>
                      <SelectItem value="toulouse">Toulouse</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Type de contrat</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cdi">CDI</SelectItem>
                      <SelectItem value="cdd">CDD</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">
                    Salaire: {salaryRange[0]}k - {salaryRange[1]}k € / an
                  </label>
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={120}
                    min={20}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Jobs */}
            {featuredJobs.length > 0 && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl mb-4 flex items-center">
                  <Icon name="Star" className="w-6 h-6 mr-2 text-yellow-500" />
                  Offres mises en avant
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {featuredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                            onClick={() => onNavigate('job-detail')}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-bl-full flex items-start justify-end p-2">
                          <Icon name="Star" className="w-4 h-4 text-white" />
                        </div>
                        
                        <div className="flex space-x-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
                            <ImageWithFallback
                              src={job.logo}
                              alt={job.company}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="mb-1">{job.title}</h3>
                                <p className="text-gray-600 text-sm">{job.company}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                {job.match}% match
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Icon name="MapPin" size="sm" className="mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <Icon name="DollarSign" size="sm" className="mr-1" />
                                {job.salary}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <Icon name="Clock" size="sm" className="mr-1" />
                                {job.posted}
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate('auth-register');
                                }}
                              >
                                Postuler
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Toutes les offres ({allJobs.length})</h2>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Plus pertinentes</SelectItem>
                    <SelectItem value="recent">Plus récentes</SelectItem>
                    <SelectItem value="salary-high">Salaire décroissant</SelectItem>
                    <SelectItem value="salary-low">Salaire croissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {allJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <Card className="p-6 bg-white/70 backdrop-blur-sm border-gray-200/50 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => onNavigate('job-detail')}>
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={job.logo}
                            alt={job.company}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="mb-1">{job.title}</h3>
                              <p className="text-gray-600 text-sm">{job.company}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                className={`${
                                  job.match >= 90 ? 'bg-green-100 text-green-800' :
                                  job.match >= 80 ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {job.match}% match
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Icon name="Heart" className={`w-4 h-4 ${job.saved ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Icon name="MapPin" size="sm" className="mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Icon name="DollarSign" size="sm" className="mr-1" />
                              {job.salary}
                            </div>
                            <div className="flex items-center">
                              <Icon name="Building" size="sm" className="mr-1" />
                              {job.companySize} employés
                            </div>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Icon name="Clock" size="sm" className="mr-1" />
                              Publié il y a {job.posted}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Logique de sauvegarde ici
                                }}
                              >
                                <Icon name="Bookmark" size="sm" className="mr-2" />
                                Sauvegarder
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate('auth-register');
                                }}
                              >
                                Postuler
                                <Icon name="ChevronRight" size="sm" className="ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" className="px-8">
                  Charger plus d'offres
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 bg-white/70 backdrop-blur-sm border-gray-200/50">
                <h3 className="mb-4">Statistiques de recherche</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Offres vues</span>
                    <span className="text-2xl">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Candidatures</span>
                    <span className="text-2xl">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sauvegardées</span>
                    <span className="text-2xl">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux de match moyen</span>
                    <span className="text-2xl text-blue-600">87%</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Trending Jobs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-white/70 backdrop-blur-sm border-gray-200/50">
                <h3 className="mb-4 flex items-center">
                  <Icon name="TrendingUp" className="mr-2 text-green-600" />
                  Métiers en tendance
                </h3>
                <div className="space-y-3">
                  {[
                    "Développeur Full Stack",
                    "Data Scientist",
                    "Product Manager",
                    "DevOps Engineer",
                    "UX Designer"
                  ].map((job, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm">{job}</span>
                      <Badge variant="outline" className="text-xs">
                        +{Math.floor(Math.random() * 30 + 10)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Salary Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/50">
                <h3 className="mb-4 flex items-center">
                  <Icon name="DollarSign" className="w-5 h-5 mr-2 text-blue-600" />
                  Insights salaires
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Salaire médian</span>
                      <span className="text-xl text-blue-600">62k €</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      +5% par rapport à l'année dernière
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Votre position</span>
                      <span className="text-sm text-green-600">Top 25%</span>
                    </div>
                    <Progress value={75} className="h-2" />
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