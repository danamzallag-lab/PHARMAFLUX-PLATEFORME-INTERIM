import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Mail, Lock, User, Building, Eye, EyeOff, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (page: string) => void;
  defaultTab?: string;
}

export function AuthPage({ onNavigate, defaultTab = 'login' }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleLogin = () => {
    if (userType === 'candidate') {
      // Pour une démo, considérons que c'est un nouvel utilisateur si on est sur l'onglet "register"
      if (defaultTab === 'register' || isNewUser) {
        onNavigate('profile-setup');
      } else {
        onNavigate('candidate-dashboard');
      }
    } else {
      onNavigate('employer-dashboard');
    }
  };

  const handleRegister = () => {
    setIsNewUser(true);
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden flex items-center justify-center p-4">
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

      {/* Back Button */}
      <motion.button
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 flex items-center space-x-2 group"
        onClick={() => onNavigate('landing')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Retour</span>
      </motion.button>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="backdrop-blur-xl bg-white/90 border-white/20 shadow-2xl">
          <div className="p-8">
            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl text-gray-800 mb-2">Bienvenue sur PharmaFlux</h1>
              <p className="text-gray-600">Connectez-vous pour accéder à votre espace</p>
            </motion.div>

            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-emerald-50 border border-emerald-200">
                <TabsTrigger value="login" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 text-gray-700">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 text-gray-700">
                  Inscription
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* User Type Selection */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <motion.button
                      className={`p-3 rounded-lg border transition-all ${
                        userType === 'candidate'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setUserType('candidate')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm">Candidat</div>
                    </motion.button>
                    <motion.button
                      className={`p-3 rounded-lg border transition-all ${
                        userType === 'employer'
                          ? 'bg-blue-100 border-blue-400 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setUserType('employer')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Building className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm">Employeur</div>
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-gray-700 mb-2 block">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" className="border-gray-300" />
                        <Label htmlFor="remember" className="text-gray-600 text-sm">Se souvenir</Label>
                      </div>
                      <button className="text-emerald-600 hover:text-emerald-700 text-sm">
                        Mot de passe oublié ?
                      </button>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 py-3"
                      onClick={handleLogin}
                    >
                      Se connecter
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="register" className="space-y-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* User Type Selection */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <motion.button
                      className={`p-3 rounded-lg border transition-all ${
                        userType === 'candidate'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setUserType('candidate')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm">Candidat</div>
                    </motion.button>
                    <motion.button
                      className={`p-3 rounded-lg border transition-all ${
                        userType === 'employer'
                          ? 'bg-blue-100 border-blue-400 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setUserType('employer')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Building className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm">Employeur</div>
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-700 mb-2 block">Prénom</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-700 mb-2 block">Nom</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="registerEmail" className="text-gray-700 mb-2 block">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="registerEmail"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="registerPassword" className="text-gray-700 mb-2 block">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="registerPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" className="border-gray-300" />
                      <Label htmlFor="terms" className="text-gray-600 text-sm">
                        J'accepte les <span className="text-emerald-600">conditions d'utilisation</span>
                      </Label>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 py-3"
                      onClick={handleRegister}
                    >
                      Créer mon compte
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                En vous connectant, vous acceptez nos conditions d'utilisation
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}