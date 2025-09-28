import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, MapPin, Calendar, Clock, Euro, Loader2, Building, Cross } from 'lucide-react';
import { missionService, CreateMissionData } from '../services/missionService';
import { toast } from 'sonner';

interface CreateMissionPageProps {
  onNavigate: (page: string) => void;
}

export function CreateMissionPage({ onNavigate }: CreateMissionPageProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMissionData>({
    title: '',
    description: '',
    type: 'officine',
    location: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    hourly_rate: 0
  });

  const handleInputChange = (field: keyof CreateMissionData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { mission, error } = await missionService.createMission(formData);

      if (error) {
        toast.error(`Erreur lors de la création: ${error.message}`);
        return;
      }

      if (mission) {
        toast.success('Mission créée avec succès! Les candidats correspondants sont en cours de recherche.');
        onNavigate('employer-dashboard');
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la création de la mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 flex justify-between items-center p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('employer-dashboard')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="flex items-center space-x-2">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center"
            >
              <Cross className="text-white w-5 h-5" />
            </motion.div>
            <div>
              <h1 className="text-xl text-white font-bold">PharmaFlux</h1>
              <p className="text-white/60 text-sm">Créer une mission</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="backdrop-blur-2xl bg-white/10 border-white/20 shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl text-white mb-4">Publier une nouvelle mission</h2>
                <p className="text-white/70">Trouvez le professionnel pharmaceutique parfait pour votre établissement</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title & Type */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-white mb-2 block">
                      Titre de la mission *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ex: Remplacement pharmacien adjoint"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-white mb-2 block">
                      Type d'établissement *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'officine' | 'hopital') => handleInputChange('type', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="officine">Officine</SelectItem>
                        <SelectItem value="hopital">Hôpital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-white mb-2 block">
                    Description de la mission
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez les responsabilités, qualifications requises, spécificités..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                    rows={5}
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-white mb-2 block">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Adresse *
                  </Label>
                  <Input
                    id="location"
                    placeholder="123 Rue de la Pharmacie, 75001 Paris"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="start_date" className="text-white mb-2 block">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date de début *
                    </Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_date" className="text-white mb-2 block">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date de fin (optionnelle)
                    </Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                {/* Times */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="start_time" className="text-white mb-2 block">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Heure de début *
                    </Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_time" className="text-white mb-2 block">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Heure de fin *
                    </Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <Label htmlFor="hourly_rate" className="text-white mb-2 block">
                    <Euro className="w-4 h-4 inline mr-2" />
                    Taux horaire (€) *
                  </Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    value={formData.hourly_rate || ''}
                    onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 py-4 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Publication en cours...
                      </>
                    ) : (
                      <>
                        <Building className="w-5 h-5 mr-2" />
                        Publier la mission
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-emerald-300 text-sm">
                  <span className="font-semibold">✨ Matching automatique :</span> Dès la publication, nous recherchons automatiquement les candidats correspondant à vos critères et leur proposons votre mission.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}