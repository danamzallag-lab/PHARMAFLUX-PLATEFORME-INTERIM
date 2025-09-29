import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Check, 
  X, 
  FileText, 
  ChevronRight, 
  User, 
  FileCheck, 
  Info,
  Building2,
  UserCircle,
  Award,
  Briefcase,
  Clock,
  Plus,
  Cross
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface OnboardingProps {
  onNavigate: (page: string) => void;
  userType?: 'candidate' | 'employer';
  userName?: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export function Onboarding({ onNavigate, userType = 'candidate', userName = 'Utilisateur' }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    // Candidat
    rppsNumber: '',
    experience: '',
    // Employeur
    siret: '',
    companyName: '',
    address: '',
    hrContact: '',
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleFileUpload = (fileKey: string, files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setUploadedFiles(prev => ({
        ...prev,
        [fileKey]: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));
    }
  };

  const removeFile = (fileKey: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fileKey];
      return newFiles;
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (userType === 'candidate') {
      if (currentStep === 1) return uploadedFiles['cv'];
      if (currentStep === 2) return uploadedFiles['diploma'] && formData.rppsNumber;
      if (currentStep === 3) return uploadedFiles['socialSecurity'];
    } else {
      if (currentStep === 1) return formData.siret && formData.companyName;
      if (currentStep === 2) return formData.address && formData.hrContact;
      if (currentStep === 3) return uploadedFiles['justificatif'];
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Redirection vers le dashboard approprié
      onNavigate(userType === 'candidate' ? 'candidate-dashboard' : 'employer-dashboard');
    }
  };

  const handleSkipForLater = () => {
    onNavigate(userType === 'candidate' ? 'candidate-dashboard' : 'employer-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#EFF6FF]">
      {/* En-tête */}
      <header className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
            onClick={handleSkipForLater}
            className="text-muted-foreground hover:text-foreground"
          >
            Passer pour plus tard
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Message de bienvenue */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-2">
            Bienvenue {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            {userType === 'candidate' 
              ? 'Complétez votre profil pour accéder à vos missions.'
              : 'Complétez votre profil pour publier vos offres.'}
          </p>
        </motion.div>

        {/* Indicateur de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Étape {currentStep} sur {totalSteps}</span>
            <span className="text-pharma-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Steps visuel */}
          <div className="flex items-center justify-between mt-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentStep === step ? 1.1 : 1,
                      backgroundColor: currentStep >= step ? 'var(--pharma-primary)' : '#E2E8F0'
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step ? 'text-white' : 'text-muted-foreground'
                    }`}
                  >
                    {currentStep > step ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step}</span>
                    )}
                  </motion.div>
                  <span className="text-xs mt-2 text-center text-muted-foreground">
                    {userType === 'candidate' 
                      ? ['Identité', 'Documents', 'Compléments'][step - 1]
                      : ['Entreprise', 'Contact', 'Documents'][step - 1]
                    }
                  </span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > step ? 'bg-pharma-primary' : 'bg-border'}`} />
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
            {userType === 'candidate' ? (
              <CandidateSteps
                currentStep={currentStep}
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
                formData={formData}
                onInputChange={handleInputChange}
                skills={skills}
                newSkill={newSkill}
                onNewSkillChange={setNewSkill}
                onAddSkill={addSkill}
                onRemoveSkill={removeSkill}
              />
            ) : (
              <EmployerSteps
                currentStep={currentStep}
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
                formData={formData}
                onInputChange={handleInputChange}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Boutons de navigation */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex-1"
          >
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-pharma-primary to-pharma-secondary hover:opacity-90"
          >
            {currentStep === totalSteps ? 'Accéder à mon espace' : 'Suivant'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Composant pour les étapes Candidat
interface StepProps {
  currentStep: number;
  uploadedFiles: Record<string, UploadedFile>;
  onFileUpload: (key: string, files: FileList | null) => void;
  onRemoveFile: (key: string) => void;
  formData: any;
  onInputChange: (field: string, value: string) => void;
  skills?: string[];
  newSkill?: string;
  onNewSkillChange?: (value: string) => void;
  onAddSkill?: () => void;
  onRemoveSkill?: (skill: string) => void;
}

function CandidateSteps({ 
  currentStep, 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile,
  formData,
  onInputChange,
  skills = [],
  newSkill = '',
  onNewSkillChange,
  onAddSkill,
  onRemoveSkill
}: StepProps) {
  if (currentStep === 1) {
    return (
      <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Identité professionnelle</CardTitle>
              <CardDescription>Commencez par votre CV</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploadZone
            label="Curriculum Vitae (CV) *"
            description="Formats acceptés : PDF, DOC, DOCX (max 5MB)"
            fileKey="cv"
            uploadedFile={uploadedFiles['cv']}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            icon={<FileText className="w-8 h-8" />}
          />
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 2) {
    return (
      <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Documents obligatoires</CardTitle>
              <CardDescription>Diplôme et numéro RPPS</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploadZone
            label="Diplôme de Pharmacie *"
            description="Formats acceptés : PDF, JPG, PNG (max 5MB)"
            fileKey="diploma"
            uploadedFile={uploadedFiles['diploma']}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            icon={<Award className="w-8 h-8" />}
          />

          <div className="space-y-2">
            <Label htmlFor="rpps">Numéro RPPS / Ordre *</Label>
            <Input
              id="rpps"
              placeholder="Ex: 10001234567"
              value={formData.rppsNumber}
              onChange={(e) => onInputChange('rppsNumber', e.target.value)}
              className="bg-input-background border-border"
            />
            <p className="text-xs text-muted-foreground">
              <Info className="w-3 h-3 inline mr-1" />
              Votre numéro d'inscription au Répertoire Partagé des Professionnels de Santé
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 3) {
    return (
      <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Informations complémentaires</CardTitle>
              <CardDescription>Finalisez votre profil</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploadZone
            label="Carte Vitale ou Attestation de Sécurité Sociale *"
            description="Formats acceptés : PDF, JPG, PNG (max 5MB)"
            fileKey="socialSecurity"
            uploadedFile={uploadedFiles['socialSecurity']}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            icon={<FileCheck className="w-8 h-8" />}
          />

          <div className="space-y-2">
            <Label htmlFor="experience">Expérience professionnelle</Label>
            <Textarea
              id="experience"
              placeholder="Décrivez brièvement votre parcours professionnel..."
              rows={4}
              value={formData.experience}
              onChange={(e) => onInputChange('experience', e.target.value)}
              className="bg-input-background border-border resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Compétences clés</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Officine, Préparation, Conseil..."
                value={newSkill}
                onChange={(e) => onNewSkillChange?.(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddSkill?.())}
                className="bg-input-background border-border"
              />
              <Button
                type="button"
                onClick={onAddSkill}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 bg-pharma-primary/10 text-pharma-primary hover:bg-pharma-primary/20"
                  >
                    {skill}
                    <button
                      onClick={() => onRemoveSkill?.(skill)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

// Composant pour les étapes Employeur
function EmployerSteps({ 
  currentStep, 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile,
  formData,
  onInputChange
}: StepProps) {
  if (currentStep === 1) {
    return (
      <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Informations entreprise</CardTitle>
              <CardDescription>Identité de votre pharmacie</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siret">Numéro SIRET *</Label>
            <Input
              id="siret"
              placeholder="Ex: 123 456 789 00012"
              value={formData.siret}
              onChange={(e) => onInputChange('siret', e.target.value)}
              className="bg-input-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Raison sociale *</Label>
            <Input
              id="companyName"
              placeholder="Ex: Pharmacie du Centre"
              value={formData.companyName}
              onChange={(e) => onInputChange('companyName', e.target.value)}
              className="bg-input-background border-border"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 2) {
    return (
      <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Contact et localisation</CardTitle>
              <CardDescription>Coordonnées de votre établissement</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète de la pharmacie *</Label>
            <Textarea
              id="address"
              placeholder="123 Rue de la Santé, 75001 Paris"
              rows={3}
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              className="bg-input-background border-border resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hrContact">Contact RH / Responsable *</Label>
            <Input
              id="hrContact"
              placeholder="Email ou téléphone"
              value={formData.hrContact}
              onChange={(e) => onInputChange('hrContact', e.target.value)}
              className="bg-input-background border-border"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 3) {
    return (
      <Card className="border-2 border-pharma-primary/20 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pharma-primary to-pharma-secondary flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Documents justificatifs</CardTitle>
              <CardDescription>Finalisez votre inscription</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploadZone
            label="Kbis ou document justificatif *"
            description="Formats acceptés : PDF, JPG, PNG (max 5MB)"
            fileKey="justificatif"
            uploadedFile={uploadedFiles['justificatif']}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            icon={<FileCheck className="w-8 h-8" />}
          />

          <FileUploadZone
            label="Attestation d'assurance professionnelle (optionnel)"
            description="Formats acceptés : PDF, JPG, PNG (max 5MB)"
            fileKey="insurance"
            uploadedFile={uploadedFiles['insurance']}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            icon={<FileText className="w-8 h-8" />}
          />
        </CardContent>
      </Card>
    );
  }

  return null;
}

// Composant de zone d'upload de fichier
interface FileUploadZoneProps {
  label: string;
  description: string;
  fileKey: string;
  uploadedFile?: UploadedFile;
  onFileUpload: (key: string, files: FileList | null) => void;
  onRemoveFile: (key: string) => void;
  icon: React.ReactNode;
}

function FileUploadZone({
  label,
  description,
  fileKey,
  uploadedFile,
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
      <Label>{label}</Label>
      
      {!uploadedFile ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragging 
              ? 'border-pharma-primary bg-pharma-primary/5 scale-[1.02]' 
              : 'border-border hover:border-pharma-primary/50 hover:bg-muted/30'
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-full transition-colors ${
              isDragging ? 'bg-pharma-primary/20 text-pharma-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {icon}
            </div>
            <div>
              <p className={isDragging ? 'text-pharma-primary' : 'text-foreground'}>
                {isDragging ? 'Déposez le fichier ici' : 'Cliquez ou glissez-déposez'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => onFileUpload(fileKey, e.target.files)}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-pharma-primary/30 bg-pharma-primary/5 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pharma-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-pharma-primary" />
              </div>
              <div>
                <p className="text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pharma-success/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-pharma-success" />
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