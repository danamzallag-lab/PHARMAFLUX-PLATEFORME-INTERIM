import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Icon, PharmacistIcon, PreparatorIcon, StudentIcon } from './shared/Icons';

interface CreateJobPageProps {
  onNavigate: (page: string) => void;
}

export function CreateJobPage({ onNavigate }: CreateJobPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1 - Informations générales
    jobType: '',
    position: '',
    title: '',
    description: '',
    
    // Étape 2 - Dates et horaires
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isFlexible: false,
    
    // Étape 3 - Rémunération
    hourlyRate: '',
    bonusOffered: false,
    bonusAmount: '',
    
    // Étape 4 - Exigences
    requiredDiploma: '',
    experienceLevel: '',
    specificSkills: [],
    languages: [],
    
    // Étape 5 - Avantages
    benefits: [],
    pharmacy: {
      name: '',
      address: '',
      description: ''
    }
  });

  const steps = [
    { id: 1, title: 'Type de mission', icon: 'Briefcase' },
    { id: 2, title: 'Planning', icon: 'Calendar' },
    { id: 3, title: 'Rémunération', icon: 'DollarSign' },
    { id: 4, title: 'Prérequis', icon: 'GraduationCap' },
    { id: 5, title: 'Finalisation', icon: 'Check' }
  ];

  const jobTypes = [
    { value: 'remplacement', label: 'Remplacement', icon: PharmacistIcon },
    { value: 'renfort', label: 'Renfort', icon: PreparatorIcon },
    { value: 'stage', label: 'Stage étudiant', icon: StudentIcon }
  ];

  const positions = [
    'Pharmacien titulaire',
    'Pharmacien adjoint',
    'Préparateur en pharmacie',
    'Étudiant en pharmacie (6ème année)',
    'Technicien en pharmacie'
  ];

  const experienceLevels = [
    'Débutant accepté',
    '1-2 ans d\'expérience',
    '3-5 ans d\'expérience',
    '5+ ans d\'expérience'
  ];

  const skillsOptions = [
    'Préparations magistrales',
    'Phytothérapie',
    'Homéopathie',
    'Orthopédie',
    'Dermato-cosmétique',
    'Nutrition',
    'Vaccination',
    'Tests rapides'
  ];

  const benefitsOptions = [
    'Transport remboursé',
    'Parking gratuit',
    'Formation continue',
    'Équipe jeune et dynamique',
    'Outils modernes',
    'Horaires flexibles',
    'Prime de performance',
    'Mutuelle d\'entreprise'
  ];

  const calculateEstimatedCost = () => {
    const rate = parseFloat(formData.hourlyRate) || 0;
    const hours = 56; // Exemple: 56h/semaine
    const commission = 0.15; // 15%
    const totalSalary = rate * hours;
    const ourCommission = totalSalary * commission;
    const traditionalCommission = totalSalary * 0.27; // 27% agences classiques
    const savings = traditionalCommission - ourCommission;
    
    return {
      totalSalary,
      ourCommission,
      traditionalCommission,
      savings
    };
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base mb-4 block">Type de mission</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {jobTypes.map((type) => (
                  <Card 
                    key={type.value}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      formData.jobType === type.value 
                        ? 'border-pharma-primary bg-pharma-primary/5' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setFormData({ ...formData, jobType: type.value })}
                  >
                    <div className="text-center">
                      <type.icon className="mx-auto mb-2" />
                      <div className="font-medium">{type.label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="position">Poste recherché</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, position: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un poste" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Titre de l'annonce</Label>
              <Input
                id="title"
                placeholder="Ex: Remplacement pharmacien titulaire - Paris 11ème"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description de la mission</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre pharmacie, l'environnement de travail, les missions spécifiques..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="flexible"
                checked={formData.isFlexible}
                onCheckedChange={(checked) => setFormData({ ...formData, isFlexible: checked as boolean })}
              />
              <Label htmlFor="flexible">Horaires flexibles possibles</Label>
            </div>
          </div>
        );

      case 3:
        const costs = calculateEstimatedCost();
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="hourlyRate">Taux horaire proposé (€)</Label>
              <Input
                id="hourlyRate"
                type="number"
                placeholder="25"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              />
              <p className="text-sm text-gray-600 mt-1">
                Taux recommandé pour votre région: 24-30€/h
              </p>
            </div>

            {formData.hourlyRate && (
              <Card className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50">
                <h3 className="mb-3 text-emerald-600">Estimation des coûts</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Salaire candidat (56h)</div>
                    <div className="font-semibold">{costs.totalSalary.toFixed(0)}€</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Notre commission (15%)</div>
                    <div className="font-semibold text-emerald-600">{costs.ourCommission.toFixed(0)}€</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Agences classiques (27%)</div>
                    <div className="font-semibold text-red-600">{costs.traditionalCommission.toFixed(0)}€</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Vos économies</div>
                    <div className="font-semibold text-pharma-primary">{costs.savings.toFixed(0)}€</div>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bonus"
                checked={formData.bonusOffered}
                onCheckedChange={(checked) => setFormData({ ...formData, bonusOffered: checked as boolean })}
              />
              <Label htmlFor="bonus">Offrir un bonus de performance</Label>
            </div>

            {formData.bonusOffered && (
              <div>
                <Label htmlFor="bonusAmount">Montant du bonus (€)</Label>
                <Input
                  id="bonusAmount"
                  type="number"
                  placeholder="50"
                  value={formData.bonusAmount}
                  onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Niveau d'expérience requis</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le niveau" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base mb-3 block">Compétences souhaitées</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {skillsOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox 
                      id={skill}
                      checked={formData.specificSkills.includes(skill)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ 
                            ...formData, 
                            specificSkills: [...formData.specificSkills, skill] 
                          });
                        } else {
                          setFormData({ 
                            ...formData, 
                            specificSkills: formData.specificSkills.filter(s => s !== skill) 
                          });
                        }
                      }}
                    />
                    <Label htmlFor={skill} className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Avantages proposés</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {benefitsOptions.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Checkbox 
                      id={benefit}
                      checked={formData.benefits.includes(benefit)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ 
                            ...formData, 
                            benefits: [...formData.benefits, benefit] 
                          });
                        } else {
                          setFormData({ 
                            ...formData, 
                            benefits: formData.benefits.filter(b => b !== benefit) 
                          });
                        }
                      }}
                    />
                    <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="pharmacyName">Nom de la pharmacie</Label>
              <Input
                id="pharmacyName"
                placeholder="Pharmacie de la République"
                value={formData.pharmacy.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  pharmacy: { ...formData.pharmacy, name: e.target.value } 
                })}
              />
            </div>

            <div>
              <Label htmlFor="pharmacyAddress">Adresse complète</Label>
              <Input
                id="pharmacyAddress"
                placeholder="15 Avenue de la République, 75011 Paris"
                value={formData.pharmacy.address}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  pharmacy: { ...formData.pharmacy, address: e.target.value } 
                })}
              />
            </div>

            <div>
              <Label htmlFor="pharmacyDescription">Description de la pharmacie</Label>
              <Textarea
                id="pharmacyDescription"
                placeholder="Pharmacie moderne, équipe bienveillante, clientèle fidèle..."
                value={formData.pharmacy.description}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  pharmacy: { ...formData.pharmacy, description: e.target.value } 
                })}
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <motion.header 
        className="bg-white border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('employer-dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Icon name="ArrowLeft" className="mr-2" />
                Retour au dashboard
              </Button>
              <div>
                <h1 className="text-xl">Créer une mission</h1>
                <p className="text-sm text-gray-600">Étape {currentStep} sur {steps.length}</p>
              </div>
            </div>
            <Button variant="outline" className="text-gray-600">
              <Icon name="Bookmark" className="mr-2" />
              Sauvegarder brouillon
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id 
                      ? 'bg-pharma-primary text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Icon name={step.icon as any} className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-16 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-pharma-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl mb-6">{steps[currentStep - 1].title}</h2>
            
            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <Icon name="ArrowLeft" className="mr-2" />
                Précédent
              </Button>

              {currentStep < 5 ? (
                <Button onClick={nextStep} className="bg-pharma-primary hover:bg-pharma-primary/90">
                  Suivant
                  <Icon name="ArrowRight" className="ml-2" />
                </Button>
              ) : (
                <Button className="bg-pharma-primary hover:bg-pharma-primary/90">
                  <Icon name="Send" className="mr-2" />
                  Publier la mission
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Aperçu prix en bas */}
        {formData.hourlyRate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Coût estimé total</div>
                  <div className="text-xl text-pharma-primary">
                    {(calculateEstimatedCost().totalSalary + calculateEstimatedCost().ourCommission).toFixed(0)}€
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-600">
                    -{calculateEstimatedCost().savings.toFixed(0)}€ vs agences
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}