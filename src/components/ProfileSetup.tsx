import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { 
  User, 
  Upload, 
  FileText, 
  Shield, 
  Star, 
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  ChevronRight,
  Check
} from 'lucide-react';
import { Icon } from './shared/Icons';

interface ProfileSetupProps {
  onNavigate: (page: string) => void;
}

export function ProfileSetup({ onNavigate }: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    // Étape 1: Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    
    // Étape 2: Informations professionnelles
    profession: '',
    experience: '',
    orderNumber: '',
    university: '',
    graduationYear: '',
    
    // Étape 3: Documents et certifications
    diploma: null as File | null,
    orderCertificate: null as File | null,
    cv: null as File | null,
    
    // Étape 4: Spécialisations et préférences
    specializations: [] as string[],
    workTypes: [] as string[],
    availability: [] as string[],
    preferredLocations: [] as string[],
    
    // Étape 5: Disponibilités
    schedule: {
      monday: { available: false, hours: { start: '08:00', end: '18:00' } },
      tuesday: { available: false, hours: { start: '08:00', end: '18:00' } },
      wednesday: { available: false, hours: { start: '08:00', end: '18:00' } },
      thursday: { available: false, hours: { start: '08:00', end: '18:00' } },
      friday: { available: false, hours: { start: '08:00', end: '18:00' } },
      saturday: { available: false, hours: { start: '08:00', end: '18:00' } },
      sunday: { available: false, hours: { start: '08:00', end: '18:00' } }
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const professions = [
    'Pharmacien titulaire',
    'Pharmacien adjoint', 
    'Préparateur en pharmacie',
    'Étudiant en pharmacie (6ème année)',
    'Étudiant en pharmacie (5ème année)',
    'Pharmacien hospitalier'
  ];

  const specializationOptions = [
    'Orthopédie', 'Homéopathie', 'Phytothérapie', 'Aromathérapie',
    'Dermatologie', 'Pédiatrie', 'Gériatrie', 'Oncologie',
    'Diabétologie', 'Cardiologie', 'Nutrition', 'Vétérinaire'
  ];

  const workTypeOptions = [
    'Remplacement', 'CDD', 'CDI', 'Garde', 'Weekend', 'Vacances été'
  ];

  const availabilityOptions = [
    'Temps plein', 'Temps partiel', 'Garde uniquement', 'Weekend uniquement',
    'Vacances scolaires', 'Missions courtes', 'Missions longues'
  ];

  const handleFileUpload = (field: string, file: File | null) => {
    setProfileData(prev => ({
      ...prev,
      [field]: file
    }));
    if (file) {
      toast('Fichier uploadé !', { description: `${file.name} a été ajouté` });
    }
  };

  const toggleSpecialization = (spec: string) => {
    setProfileData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const toggleWorkType = (type: string) => {
    setProfileData(prev => ({
      ...prev,
      workTypes: prev.workTypes.includes(type)
        ? prev.workTypes.filter(t => t !== type)
        : [...prev.workTypes, type]
    }));
  };

  const toggleAvailability = (availability: string) => {
    setProfileData(prev => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter(a => a !== availability)
        : [...prev.availability, availability]
    }));
  };

  const toggleDayAvailability = (day: string) => {
    setProfileData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          available: !prev.schedule[day as keyof typeof prev.schedule].available
        }
      }
    }));
  };

  const updateDayHours = (day: string, type: 'start' | 'end', value: string) => {
    setProfileData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          hours: {
            ...prev.schedule[day as keyof typeof prev.schedule].hours,
            [type]: value
          }
        }
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSetup = () => {
    toast('Profil créé !', { description: 'Votre profil pharmacie est maintenant complet' });
    onNavigate('candidate-dashboard');
  };

  const renderFileUpload = (field: string, label: string, accept: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-emerald-200 rounded-lg p-4 text-center hover:border-emerald-300 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null)}
          className="hidden"
          id={field}
        />
        <label htmlFor={field} className="cursor-pointer">
          <Upload className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
          <p className="text-sm text-gray-600">
            {profileData[field as keyof typeof profileData] 
              ? `✓ ${(profileData[field as keyof typeof profileData] as File)?.name}`
              : `Cliquez pour ajouter ${label.toLowerCase()}`
            }
          </p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 5MB)</p>
        </label>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <User className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-2xl mb-2">Informations personnelles</h2>
              <p className="text-gray-600">Commençons par vos coordonnées</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Prénom *</Label>
                  <Input 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Marie"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="marie@example.com"
                  />
                </div>
                <div>
                  <Label>Adresse</Label>
                  <Input 
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Rue de la Pharmacie"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Nom *</Label>
                  <Input 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Dupont"
                  />
                </div>
                <div>
                  <Label>Téléphone *</Label>
                  <Input 
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ville</Label>
                    <Input 
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <Label>Code postal</Label>
                    <Input 
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="75001"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Briefcase className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-2xl mb-2">Informations professionnelles</h2>
              <p className="text-gray-600">Parlez-nous de votre parcours pharmacie</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Profession *</Label>
                  <Select value={profileData.profession} onValueChange={(value) => setProfileData(prev => ({ ...prev, profession: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map(prof => (
                        <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Numéro Ordre Pharmacien</Label>
                  <Input 
                    value={profileData.orderNumber}
                    onChange={(e) => setProfileData(prev => ({ ...prev, orderNumber: e.target.value }))}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label>Université de formation</Label>
                  <Input 
                    value={profileData.university}
                    onChange={(e) => setProfileData(prev => ({ ...prev, university: e.target.value }))}
                    placeholder="Université Paris Descartes"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Années d'expérience</Label>
                  <Select value={profileData.experience} onValueChange={(value) => setProfileData(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Étudiant">Étudiant</SelectItem>
                      <SelectItem value="0-1 an">0-1 an</SelectItem>
                      <SelectItem value="1-3 ans">1-3 ans</SelectItem>
                      <SelectItem value="3-5 ans">3-5 ans</SelectItem>
                      <SelectItem value="5-10 ans">5-10 ans</SelectItem>
                      <SelectItem value="10+ ans">10+ ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Année d'obtention du diplôme</Label>
                  <Input 
                    type="number"
                    value={profileData.graduationYear}
                    onChange={(e) => setProfileData(prev => ({ ...prev, graduationYear: e.target.value }))}
                    placeholder="2020"
                    min="1980"
                    max="2024"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-2xl mb-2">Documents et certifications</h2>
              <p className="text-gray-600">Ajoutez vos documents professionnels</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {renderFileUpload('diploma', 'Diplôme de pharmacie', '.pdf,.jpg,.jpeg,.png')}
                {renderFileUpload('orderCertificate', 'Certificat Ordre des Pharmaciens', '.pdf,.jpg,.jpeg,.png')}
              </div>
              <div className="space-y-6">
                {renderFileUpload('cv', 'CV actualisé', '.pdf,.doc,.docx')}
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h4 className="flex items-center mb-2">
                    <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                    Sécurité des données
                  </h4>
                  <p className="text-sm text-gray-600">
                    Vos documents sont stockés de manière sécurisée et ne sont accessibles 
                    qu'aux employeurs lors de vos candidatures.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Star className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-2xl mb-2">Spécialisations et préférences</h2>
              <p className="text-gray-600">Personnalisez votre profil selon vos compétences</p>
            </div>

            <div className="space-y-8">
              <div>
                <Label className="text-lg mb-4 block">Spécialisations pharmaceutiques</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specializationOptions.map(spec => (
                    <Button
                      key={spec}
                      variant={profileData.specializations.includes(spec) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSpecialization(spec)}
                      className={`justify-start ${profileData.specializations.includes(spec) ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-200 hover:bg-emerald-50'}`}
                    >
                      {profileData.specializations.includes(spec) && <Check className="w-4 h-4 mr-2" />}
                      {spec}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg mb-4 block">Types de missions préférées</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {workTypeOptions.map(type => (
                    <Button
                      key={type}
                      variant={profileData.workTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleWorkType(type)}
                      className={`justify-start ${profileData.workTypes.includes(type) ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-200 hover:bg-emerald-50'}`}
                    >
                      {profileData.workTypes.includes(type) && <Check className="w-4 h-4 mr-2" />}
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg mb-4 block">Disponibilités générales</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availabilityOptions.map(availability => (
                    <Button
                      key={availability}
                      variant={profileData.availability.includes(availability) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAvailability(availability)}
                      className={`justify-start ${profileData.availability.includes(availability) ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-200 hover:bg-emerald-50'}`}
                    >
                      {profileData.availability.includes(availability) && <Check className="w-4 h-4 mr-2" />}
                      {availability}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Calendar className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-2xl mb-2">Planning de disponibilités</h2>
              <p className="text-gray-600">Définissez vos créneaux de travail</p>
            </div>

            <div className="space-y-4">
              {Object.entries(profileData.schedule).map(([day, schedule]) => {
                const dayLabels: Record<string, string> = {
                  monday: 'Lundi',
                  tuesday: 'Mardi', 
                  wednesday: 'Mercredi',
                  thursday: 'Jeudi',
                  friday: 'Vendredi',
                  saturday: 'Samedi',
                  sunday: 'Dimanche'
                };

                return (
                  <div key={day} className="flex items-center space-x-4 p-4 border border-emerald-200 rounded-lg">
                    <div className="flex items-center space-x-2 w-32">
                      <Checkbox 
                        checked={schedule.available}
                        onCheckedChange={() => toggleDayAvailability(day)}
                      />
                      <Label className="text-sm">{dayLabels[day]}</Label>
                    </div>
                    
                    {schedule.available && (
                      <div className="flex items-center space-x-2 flex-1">
                        <Label className="text-sm">De</Label>
                        <Input
                          type="time"
                          value={schedule.hours.start}
                          onChange={(e) => updateDayHours(day, 'start', e.target.value)}
                          className="w-32"
                        />
                        <Label className="text-sm">à</Label>
                        <Input
                          type="time"
                          value={schedule.hours.end}
                          onChange={(e) => updateDayHours(day, 'end', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Astuce :</strong> Vous pourrez modifier ces disponibilités à tout moment 
                depuis votre dashboard. Ces créneaux servent de base pour le matching automatique.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Icon name="Cross" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl">PharmaFlux - Configuration du profil</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-emerald-100 text-emerald-800">
                Étape {currentStep}/{totalSteps}
              </Badge>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl">Configuration de votre profil pharmacie</h1>
            <span className="text-sm text-gray-600">{Math.round(progress)}% complété</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-emerald-200/50">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-emerald-200">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-emerald-200"
              >
                Précédent
              </Button>

              {currentStep === totalSteps ? (
                <Button 
                  onClick={completeSetup}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white border-0"
                >
                  Finaliser mon profil
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={nextStep}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white border-0"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}