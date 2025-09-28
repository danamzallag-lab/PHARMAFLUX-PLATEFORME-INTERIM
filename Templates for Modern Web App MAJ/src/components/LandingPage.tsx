import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { PharmaIcons, Icon, PharmaIcon, PharmacistIcon, PreparatorIcon, StudentIcon } from './shared/Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const candidateFeatures = [
    {
      icon: 'DollarSign',
      title: "Mieux rémunéré",
      description: "Gagnez +€/h grâce à notre système de fidélité"
    },
    {
      icon: 'Zap',
      title: "Missions prioritaires",
      description: "Accédez aux meilleures opportunités en premier"
    },
    {
      icon: 'MapPin',
      title: "Missions locales",
      description: "Trouvez des remplacements près de chez vous"
    }
  ];

  const employerFeatures = [
    {
      icon: 'Calculator',
      title: "Moins cher",
      description: "Économisez jusqu'à 40% vs agences classiques"
    },
    {
      icon: 'Shield',
      title: "Profils vérifiés",
      description: "Diplômes et expériences contrôlés"
    },
    {
      icon: 'Clock',
      title: "Publication rapide",
      description: "Publiez une mission en moins de 60 secondes"
    }
  ];

  const stats = [
    { number: "5K+", label: "Pharmaciens actifs" },
    { number: "800+", label: "Pharmacies partenaires" },
    { number: "98%", label: "Taux de satisfaction" },
    { number: "24h", label: "Temps moyen de placement" }
  ];

  const pricingComparison = [
    { feature: "Commission", us: "15%", others: "25-30%" },
    { feature: "Frais cachés", us: "0€", others: "Multiples" },
    { feature: "Rémunération candidat", us: "+€/h", others: "Standard" }
  ];

  const testimonials = [
    {
      name: "Dr. Marie Dubois",
      role: "Pharmacien titulaire",
      content: "Enfin une plateforme qui comprend nos besoins. Les candidats sont qualifiés et les tarifs transparents.",
      rating: 5
    },
    {
      name: "Thomas Martin",
      role: "Préparateur en pharmacie",
      content: "Grâce au système de fidélité, je gagne maintenant 2€/h de plus qu'avec les autres agences.",
      rating: 5
    },
    {
      name: "Sophie Leroy", 
      role: "Étudiante en pharmacie",
      content: "Interface super intuitive, j'ai trouvé mon premier remplacement en 2 clics !",
      rating: 5
    }
  ];

  const faqItems = [
    {
      question: "Comment fonctionne le système de fidélité ?",
      answer: "Plus vous réalisez de missions, plus vous montez de palier et gagnez d'euros supplémentaires par heure. Le bonus est plafonné pour rester équitable."
    },
    {
      question: "Les profils sont-ils vraiment vérifiés ?",
      answer: "Oui, nous vérifions tous les diplômes, inscriptions à l'Ordre et expériences avant validation du profil."
    },
    {
      question: "Quels sont vos tarifs ?",
      answer: "15% de commission seulement, sans frais cachés. Transparent et moins cher que les agences traditionnelles."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310B981%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-emerald-500/20 rounded-full blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-r from-emerald-300/15 to-blue-300/15 rounded-full blur-xl"
        animate={{
          x: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Header */}
      <motion.header 
        className="relative z-10 flex justify-between items-center p-6 bg-white/80 backdrop-blur-xl border-b border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Icon name="Cross" className="text-white" />
          </motion.div>
          <h1 className="text-2xl text-gray-800 font-bold">PharmaFlux</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:bg-gray-100"
            onClick={() => onNavigate('auth')}
          >
            Connexion
          </Button>
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-lg"
            onClick={() => onNavigate('auth-register')}
          >
            Commencer
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200">
              <Icon name="Sparkles" size="sm" className="mr-2" />
              Technologie pharmaceutique avancée
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl text-gray-800 mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            L'Intérim
            <br />
            Pharmacie
            <br />
            Réinventé
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-emerald-600 font-semibold">Moins cher pour l'employeur. Mieux payé pour le candidat.</span>
            <br />
            La première plateforme d'intérim dédiée aux métiers de la pharmacie. 
            Trouvez des remplacements qualifiés ou décrochez votre prochaine mission en 60 secondes.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl border-0 group shadow-lg"
              onClick={() => onNavigate('candidate-pre-dashboard')}
            >
              Je cherche un emploi
              <Icon name="ArrowRight" className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/80 text-gray-700 border-gray-200 hover:bg-white hover:shadow-lg px-8 py-4 rounded-xl backdrop-blur-sm"
              onClick={() => onNavigate('employer-page')}
            >
              Je recrute des talents
              <Icon name="Briefcase" className="ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl md:text-5xl text-gray-800 mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pourquoi nous - Candidats/Employeurs */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2 className="text-4xl text-gray-800 text-center mb-12">Pourquoi PharmaFlux ?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Candidats */}
            <Card className="p-8 bg-white/80 backdrop-blur-xl border-emerald-200 shadow-lg">
              <div className="text-center mb-6">
                <PharmacistIcon />
                <h3 className="text-2xl mt-4 mb-2 text-gray-800">Pour les Candidats</h3>
                <p className="text-emerald-600 font-semibold">Mieux rémunéré, priorisé, missions locales</p>
              </div>
              <div className="space-y-4">
                {candidateFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name={feature.icon as keyof typeof PharmaIcons} size="sm" className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-800">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Employeurs */}
            <Card className="p-8 bg-white/80 backdrop-blur-xl border-blue-200 shadow-lg">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto">
                  <Icon name="Building" className="text-blue-600" />
                </div>
                <h3 className="text-2xl mt-4 mb-2 text-gray-800">Pour les Employeurs</h3>
                <p className="text-blue-600 font-semibold">Moins cher, profils vérifiés, publication rapide</p>
              </div>
              <div className="space-y-4">
                {employerFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name={feature.icon as keyof typeof PharmaIcons} size="sm" className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-800">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Tarifs transparents */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-800 mb-4">Tarifs ultra transparents</h2>
            <p className="text-gray-600 text-xl">Pourquoi payer plus cher pour le même service ?</p>
          </div>
          
          <Card className="max-w-4xl mx-auto p-8 bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 text-gray-800 font-semibold">Critère</th>
                    <th className="text-center py-4 text-emerald-600 font-semibold">PharmaFlux</th>
                    <th className="text-center py-4 text-red-600 font-semibold">Agences classiques</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingComparison.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 text-gray-700">{item.feature}</td>
                      <td className="py-4 text-center text-emerald-600 font-semibold">{item.us}</td>
                      <td className="py-4 text-center text-red-600">{item.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-emerald-700 text-center">
                <Icon name="Info" size="sm" className="inline mr-2" />
                Notre modèle permet de mieux rémunérer les candidats tout en réduisant les coûts pour les employeurs
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Programme de fidélité */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-800 mb-4">Programme de fidélité</h2>
            <p className="text-gray-600 text-xl">Plus vous nous faites confiance, plus vous gagnez</p>
          </div>
          
          <Tabs defaultValue="candidats" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-white/90 border-gray-200">
              <TabsTrigger value="candidats" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 text-gray-700">
                <PharmacistIcon />
                <span className="ml-2">Candidats</span>
              </TabsTrigger>
              <TabsTrigger value="employeurs" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-gray-700">
                <Icon name="Building" className="mr-2" />
                Employeurs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="candidats" className="mt-6">
              <Card className="p-8 bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl mb-4 text-emerald-600">Gagnez des points à chaque mission</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <span className="text-gray-700">Palier Bronze</span>
                        <span className="text-emerald-600 font-semibold">+1€/h</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <span className="text-gray-700">Palier Argent</span>
                        <span className="text-emerald-600 font-semibold">+2€/h</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <span className="text-gray-700">Palier Or</span>
                        <span className="text-emerald-600 font-semibold">+3€/h</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <span className="text-gray-700">Palier Platine</span>
                        <span className="text-yellow-600 font-semibold">+4€/h (max)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-4 text-blue-600">Avantages additionnels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Icon name="Star" className="text-yellow-500" />
                        <span className="text-gray-700">Priorité sur les missions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="Gift" className="text-purple-500" />
                        <span className="text-gray-700">Bonus parrainage doublé</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="Shield" className="text-emerald-500" />
                        <span className="text-gray-700">Support prioritaire</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="Award" className="text-blue-500" />
                        <span className="text-gray-700">Badge de reconnaissance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="employeurs" className="mt-6">
              <Card className="p-8 bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl mb-4 text-blue-600">Mission offerte</h3>
                    <p className="text-gray-600 mb-4">Après 100 heures commandées, obtenez une mission gratuite de 20h maximum.</p>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Progression</span>
                        <span className="text-blue-600 font-semibold">67/100h</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-4 text-purple-600">Avantages à venir</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Icon name="Calculator" className="text-emerald-500" />
                        <span className="text-gray-700">Remises outils PharmaConsult</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="BarChart3" className="text-blue-500" />
                        <span className="text-gray-700">Dashboard statistiques avancé</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="Users" className="text-purple-500" />
                        <span className="text-gray-700">Accès candidats premium</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="Zap" className="text-yellow-500" />
                        <span className="text-gray-700">Publication prioritaire</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Comment ça marche */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-800 mb-4">Comment ça marche ?</h2>
            <p className="text-gray-600 text-xl">Simple, rapide, efficace</p>
          </div>
          
          <Tabs defaultValue="candidat" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-white/90 border-gray-200 max-w-md mx-auto">
              <TabsTrigger value="candidat" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 text-gray-700">
                Candidat
              </TabsTrigger>
              <TabsTrigger value="employeur" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-gray-700">
                Employeur
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="candidat" className="mt-8">
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Inscription", desc: "Créez votre profil et uploadez vos diplômes", icon: "User" },
                  { step: "2", title: "Vérification", desc: "Validation de vos qualifications par notre équipe", icon: "Shield" },
                  { step: "3", title: "Recherche", desc: "Parcourez les missions près de chez vous", icon: "Search" },
                  { step: "4", title: "Mission", desc: "Postulez et commencez votre mission rapidement", icon: "Briefcase" }
                ].map((item, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name={item.icon as keyof typeof PharmaIcons} className="text-emerald-600" />
                    </div>
                    <div className="text-emerald-600 font-bold text-lg mb-2">Étape {item.step}</div>
                    <h3 className="mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="employeur" className="mt-8">
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Inscription", desc: "Créez votre compte employeur en 2 minutes", icon: "Building" },
                  { step: "2", title: "Publication", desc: "Publiez votre mission en moins de 60 secondes", icon: "Plus" },
                  { step: "3", title: "Sélection", desc: "Recevez des candidatures de profils vérifiés", icon: "Users" },
                  { step: "4", title: "Confirmation", desc: "Validez votre candidat et c'est parti !", icon: "Check" }
                ].map((item, index) => (
                  <Card key={index} className="p-6 bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name={item.icon as keyof typeof PharmaIcons} className="text-blue-600" />
                    </div>
                    <div className="text-blue-600 font-bold text-lg mb-2">Étape {item.step}</div>
                    <h3 className="mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Témoignages */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-800 mb-4">Ils nous font confiance</h2>
            <p className="text-gray-600 text-xl">Des milliers de professionnels satisfaits</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="Star" className="text-yellow-500 w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-800 mb-4">Questions fréquentes</h2>
          </div>
          
          <Card className="max-w-4xl mx-auto p-8 bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg">
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-gray-800 mb-3 flex items-center">
                    <Icon name="HelpCircle" className="text-emerald-600 mr-3" />
                    {item.question}
                  </h3>
                  <p className="text-gray-600 pl-8">{item.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1684483165545-baaa4d88f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwb2ZmaWNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTg3OTI0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Future of work"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div 
        className="relative z-10 text-center py-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.4 }}
      >
        <h2 className="text-4xl text-gray-800 mb-6">Prêt à révolutionner votre activité ?</h2>
        <p className="text-gray-600 mb-8 text-lg max-w-3xl mx-auto">
          Rejoignez la communauté PharmaFlux et découvrez une nouvelle façon de gérer vos remplacements
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl border-0 group shadow-lg"
            onClick={() => onNavigate('employer-page')}
          >
            <Icon name="Building" className="mr-2" />
            <span>Publier une mission</span>
            <Icon name="ArrowRight" className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/90 text-gray-700 border-gray-200 hover:bg-white hover:shadow-lg px-8 py-4 rounded-xl backdrop-blur-sm"
            onClick={() => onNavigate('candidate-page')}
          >
            <PharmacistIcon />
            <span className="ml-2">Devenir candidat</span>
          </Button>
        </div>
        
        {/* Meta-bar confiance */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <Icon name="Shield" className="text-emerald-600" />
                <span className="text-gray-700">Paiements sécurisés</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Icon name="Award" className="text-blue-600" />
                <span className="text-gray-700">Profils vérifiés</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Icon name="MessageCircle" className="text-purple-600" />
                <span className="text-gray-700">Support réactif</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}