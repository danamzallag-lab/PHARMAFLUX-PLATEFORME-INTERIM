import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { supabase, employerDocuments } from '../lib/supabase';
import { 
  Upload, 
  Check, 
  X, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Building2,
  FileCheck,
  Info,
  User,
  Mail,
  Phone,
  MapPin,
  Cross,
  AlertCircle,
  CheckCircle,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';

interface EmployerOnboardingProps {
  onNavigate: (page: string) => void;
  employerName?: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface FormData {
  companyName: string;
  legalName: string;
  siret: string;
  street: string;
  city: string;
  postalCode: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
}

interface FormErrors {
  [key: string]: string;
}

export function EmployerOnboarding({ onNavigate, employerName = 'Employeur' }: EmployerOnboardingProps) {
  const { profile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    legalName: '',
    siret: '',
    street: '',
    city: '',
    postalCode: '',
    hrName: '',
    hrEmail: '',
    hrPhone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleFileUpload = (fileKey: string, files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [fileKey]: 'Format non accepté. Utilisez PDF, JPG ou PNG.' }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [fileKey]: 'Fichier trop volumineux. Maximum 5MB.' }));
        return;
      }

      setUploadedFiles(prev => ({
        ...prev,
        [fileKey]: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));
      
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fileKey];
        return newErrors;
      });
    }
  };

  const removeFile = (fileKey: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fileKey];
      return newFiles;
    });
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Nom de l\'entreprise requis';
      if (!formData.legalName.trim()) newErrors.legalName = 'Raison sociale requise';
      if (!formData.siret.trim()) {
        newErrors.siret = 'Numéro SIRET requis';
      } else if (!/^\d{14}$/.test(formData.siret.replace(/\s/g, ''))) {
        newErrors.siret = 'SIRET invalide (14 chiffres requis)';
      }
      if (!formData.street.trim()) newErrors.street = 'Adresse requise';
      if (!formData.city.trim()) newErrors.city = 'Ville requise';
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = 'Code postal requis';
      } else if (!/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = 'Code postal invalide';
      }
    }

    if (step === 2) {
      if (!formData.hrName.trim()) newErrors.hrName = 'Nom du responsable requis';
      if (!formData.hrEmail.trim()) {
        newErrors.hrEmail = 'Email requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.hrEmail)) {
        newErrors.hrEmail = 'Email invalide';
      }
      if (!formData.hrPhone.trim()) {
        newErrors.hrPhone = 'Téléphone requis';
      } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.hrPhone)) {
        newErrors.hrPhone = 'Téléphone invalide';
      }
    }

    if (step === 3) {
      if (!uploadedFiles['kbis']) newErrors.kbis = 'Extrait Kbis requis';
      if (!uploadedFiles['ars']) newErrors.ars = 'Licence ARS requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finaliser l'onboarding : sauvegarder dans la DB
      await saveOnboardingData();
    }
  };

  const saveOnboardingData = async () => {
    if (!profile) {
      setErrors({ general: 'Profil non trouvé' });
      return;
    }

    setIsSaving(true);

    try {
      // 1. Mettre à jour le profil avec les informations entreprise
      const { error: profileError } = await updateProfile({
        company_name: formData.companyName,
        legal_name: formData.legalName,
        siret: formData.siret,
        address_street: formData.street,
        address_city: formData.city,
        address_postal_code: formData.postalCode,
        hr_contact_name: formData.hrName,
        hr_contact_email: formData.hrEmail,
        hr_contact_phone: formData.hrPhone,
        onboarding_completed: true
      });

      if (profileError) {
        console.error('Erreur mise à jour profil:', profileError);
        setErrors({ general: 'Erreur lors de la sauvegarde du profil' });
        setIsSaving(false);
        return;
      }

      // 2. Uploader les documents (simulation pour l'instant)
      // TODO: Implémenter l'upload vers Supabase Storage
      // Pour l'instant, on enregistre juste les métadonnées
      const documentsToSave = Object.entries(uploadedFiles).map(([fileKey, file]) => ({
        employer_id: profile.id,
        document_type: fileKey as 'kbis' | 'ars' | 'insurance' | 'other',
        file_name: file.name,
        file_url: `placeholder_${file.name}`, // TODO: remplacer par l'URL réelle après upload
        file_size: file.size
      }));

      if (documentsToSave.length > 0) {
        for (const doc of documentsToSave) {
          const { error: docError } = await employerDocuments.create(doc);
          if (docError) {
            console.error('Erreur sauvegarde document:', docError);
          }
        }
      }

      // Succès : afficher l'écran de confirmation
      setIsCompleted(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ general: 'Erreur inattendue lors de la sauvegarde' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ? Vos données ne seront pas sauvegardées.')) {
      onNavigate('landing');
    }
  };

  const handleAccessDashboard = () => {
    onNavigate('employer-dashboard');
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#EFF6FF] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="border-2 border-pharma-primary/20 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pharma-primary to-pharma-secondary rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="mb-4">Votre compte employeur est maintenant actif !</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                  Félicitations {employerName}, vous pouvez maintenant publier vos offres et gérer vos recrutements.
                </p>
                
                <div className="bg-pharma-primary/5 border border-pharma-primary/20 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3 text-left">
                    <Sparkles className="w-5 h-5 text-pharma-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="text-pharma-primary mb-2">Prochaines étapes</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Publier votre première offre de remplacement</li>
                        <li>• Configurer vos préférences de notification</li>
                        <li>• Découvrir les profils de candidats qualifiés</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAccessDashboard}
                  size="lg"
                  className="bg-gradient-to-r from-pharma-primary to-pharma-secondary hover:opacity-90 text-lg px-8"
                >
                  Accéder à mon tableau de bord
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#EFF6FF]">
      {/* En-tête */}
      <header className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-pharma-primary to-pharma-secondary rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Cross className="w-5 h-5 text-white" />
            </motion.div>
            <span className="bg-gradient-to-r from-pharma-primary to-pharma-secondary bg-clip-text text-transparent">PharmaFlux</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Message de bienvenue */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-2">
            Bienvenue 👋 Configurez votre espace employeur
          </h1>
          <p className="text-muted-foreground text-lg">
            Veuillez renseigner vos informations pour activer votre compte.
          </p>
        </motion.div>

        {/* Indicateur de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Étape {currentStep} sur {totalSteps}</span>
            <span className="text-pharma-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2.5" />
          
          {/* Steps visuel */}
          <div className="flex items-center justify-between mt-8">
            {[
              { num: 1, label: 'Informations entreprise', icon: Building2 },
              { num: 2, label: 'Contact RH', icon: User },
              { num: 3, label: 'Documents', icon: FileCheck }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentStep === step.num ? 1.1 : 1,
                    }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                      currentStep >= step.num 
                        ? 'bg-gradient-to-br from-pharma-primary to-pharma-secondary text-white' 
                        : 'bg-white border-2 border-border text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.num ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span className={`text-xs mt-3 text-center max-w-[120px] ${
                    currentStep >= step.num ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`h-0.5 flex-1 mx-2 transition-colors ${
                    currentStep > step.num ? 'bg-gradient-to-r from-pharma-primary to-pharma-secondary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu des étapes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <CompanyInfoStep
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />
            )}
            {currentStep === 2 && (
              <HRContactStep
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />
            )}
            {currentStep === 3 && (
              <DocumentsStep
                uploadedFiles={uploadedFiles}
                errors={errors}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Boutons de navigation */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex-1"
            size="lg"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-pharma-primary to-pharma-secondary hover:opacity-90"
            size="lg"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sauvegarde en cours...
              </>
            ) : (
              <>
                {currentStep === totalSteps ? 'Valider mon inscription' : 'Enregistrer et continuer'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Étape 1 : Informations entreprise
interface StepProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (field: keyof FormData, value: string) => void;
}

function CompanyInfoStep({ formData, errors, onInputChange }: StepProps) {
  return (
    <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle>Informations entreprise</CardTitle>
            <CardDescription>Identité légale de votre pharmacie</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Nom de l'entreprise <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              placeholder="Ex: Pharmacie du Centre"
              value={formData.companyName}
              onChange={(e) => onInputChange('companyName', e.target.value)}
              className={`bg-input-background border-border ${errors.companyName ? 'border-destructive' : ''}`}
            />
            {errors.companyName && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.companyName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalName">
              Raison sociale <span className="text-destructive">*</span>
            </Label>
            <Input
              id="legalName"
              placeholder="Ex: SARL Pharmacie Santé"
              value={formData.legalName}
              onChange={(e) => onInputChange('legalName', e.target.value)}
              className={`bg-input-background border-border ${errors.legalName ? 'border-destructive' : ''}`}
            />
            {errors.legalName && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.legalName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="siret">
            Numéro SIRET <span className="text-destructive">*</span>
          </Label>
          <Input
            id="siret"
            placeholder="Ex: 123 456 789 00012"
            value={formData.siret}
            onChange={(e) => onInputChange('siret', e.target.value)}
            className={`bg-input-background border-border ${errors.siret ? 'border-destructive' : ''}`}
            maxLength={17}
          />
          {errors.siret && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.siret}
            </p>
          )}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" />
            14 chiffres sans espaces
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-pharma-primary" />
            Adresse de la pharmacie
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor="street">
              Rue <span className="text-destructive">*</span>
            </Label>
            <Input
              id="street"
              placeholder="123 Rue de la Santé"
              value={formData.street}
              onChange={(e) => onInputChange('street', e.target.value)}
              className={`bg-input-background border-border ${errors.street ? 'border-destructive' : ''}`}
            />
            {errors.street && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.street}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">
                Code postal <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postalCode"
                placeholder="75001"
                value={formData.postalCode}
                onChange={(e) => onInputChange('postalCode', e.target.value)}
                className={`bg-input-background border-border ${errors.postalCode ? 'border-destructive' : ''}`}
                maxLength={5}
              />
              {errors.postalCode && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.postalCode}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                Ville <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Paris"
                value={formData.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                className={`bg-input-background border-border ${errors.city ? 'border-destructive' : ''}`}
              />
              {errors.city && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.city}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Étape 2 : Contact RH
function HRContactStep({ formData, errors, onInputChange }: StepProps) {
  return (
    <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center shadow-lg">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle>Contact RH</CardTitle>
            <CardDescription>Coordonnées du responsable des ressources humaines</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-pharma-primary/5 border-pharma-primary/20">
          <Info className="w-4 h-4 text-pharma-primary" />
          <AlertDescription className="text-sm">
            Ces informations serviront de contact principal pour les candidats et les communications administratives.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="hrName">
            Nom du responsable RH <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="hrName"
              placeholder="Ex: Marie Dupont"
              value={formData.hrName}
              onChange={(e) => onInputChange('hrName', e.target.value)}
              className={`bg-input-background border-border pl-10 ${errors.hrName ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.hrName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.hrName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hrEmail">
            Email professionnel <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="hrEmail"
              type="email"
              placeholder="contact@pharmacie.fr"
              value={formData.hrEmail}
              onChange={(e) => onInputChange('hrEmail', e.target.value)}
              className={`bg-input-background border-border pl-10 ${errors.hrEmail ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.hrEmail && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.hrEmail}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hrPhone">
            Téléphone <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="hrPhone"
              type="tel"
              placeholder="Ex: 01 23 45 67 89"
              value={formData.hrPhone}
              onChange={(e) => onInputChange('hrPhone', e.target.value)}
              className={`bg-input-background border-border pl-10 ${errors.hrPhone ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.hrPhone && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.hrPhone}
            </p>
          )}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" />
            Format: 01 23 45 67 89 ou +33 1 23 45 67 89
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Étape 3 : Documents
interface DocumentsStepProps {
  uploadedFiles: Record<string, UploadedFile>;
  errors: FormErrors;
  onFileUpload: (key: string, files: FileList | null) => void;
  onRemoveFile: (key: string) => void;
}

function DocumentsStep({ uploadedFiles, errors, onFileUpload, onRemoveFile }: DocumentsStepProps) {
  return (
    <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center shadow-lg">
            <FileCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle>Documents obligatoires</CardTitle>
            <CardDescription>Justificatifs pour activer votre compte</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-pharma-primary/5 border-pharma-primary/20">
          <Info className="w-4 h-4 text-pharma-primary" />
          <AlertDescription className="text-sm">
            Tous les documents doivent être au format PDF, JPG ou PNG (maximum 5MB par fichier).
          </AlertDescription>
        </Alert>

        <FileUploadZone
          label="Extrait Kbis ou équivalent"
          description="Document datant de moins de 3 mois"
          required
          fileKey="kbis"
          uploadedFile={uploadedFiles['kbis']}
          error={errors['kbis']}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
          icon={<FileCheck className="w-8 h-8" />}
        />

        <FileUploadZone
          label="Licence ARS / Justificatif d'ouverture de pharmacie"
          description="Autorisation d'exploitation de votre officine"
          required
          fileKey="ars"
          uploadedFile={uploadedFiles['ars']}
          error={errors['ars']}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
          icon={<FileText className="w-8 h-8" />}
        />

        <Separator />

        <div className="space-y-4">
          <h4 className="text-muted-foreground">Documents complémentaires (optionnels)</h4>
          
          <FileUploadZone
            label="Attestation d'assurance professionnelle"
            description="Assurance responsabilité civile professionnelle"
            fileKey="insurance"
            uploadedFile={uploadedFiles['insurance']}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            icon={<FileText className="w-8 h-8" />}
          />

          <FileUploadZone
            label="Autres documents administratifs"
            description="Tout autre document pertinent"
            fileKey="other"
            uploadedFile={uploadedFiles['other']}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            icon={<FileText className="w-8 h-8" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Composant de zone d'upload de fichier
interface FileUploadZoneProps {
  label: string;
  description: string;
  required?: boolean;
  fileKey: string;
  uploadedFile?: UploadedFile;
  error?: string;
  onFileUpload: (key: string, files: FileList | null) => void;
  onRemoveFile: (key: string) => void;
  icon: React.ReactNode;
}

function FileUploadZone({
  label,
  description,
  required = false,
  fileKey,
  uploadedFile,
  error,
  onFileUpload,
  onRemoveFile,
  icon
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onFileUpload(fileKey, e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      {!uploadedFile ? (
        <>
          <motion.div
            whileHover={{ scale: 1.01 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${isDragging 
                ? 'border-pharma-primary bg-pharma-primary/5 scale-[1.02]' 
                : error
                ? 'border-destructive bg-destructive/5'
                : 'border-border hover:border-pharma-primary/50 hover:bg-muted/30'
              }
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full transition-colors ${
                isDragging 
                  ? 'bg-pharma-primary/20 text-pharma-primary' 
                  : error
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {error ? <AlertCircle className="w-8 h-8" /> : icon}
              </div>
              <div>
                <p className={isDragging ? 'text-pharma-primary' : error ? 'text-destructive' : 'text-foreground'}>
                  {isDragging ? 'Déposez le fichier ici' : '📎 Cliquez ou glissez-déposez'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => onFileUpload(fileKey, e.target.files)}
            />
          </motion.div>
          {error && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-pharma-primary/30 bg-pharma-primary/5 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-pharma-primary/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-pharma-primary" />
              </div>
              <div>
                <p className="text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-pharma-success/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-pharma-success" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveFile(fileKey)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}