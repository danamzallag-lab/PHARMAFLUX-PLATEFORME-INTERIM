import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Icon, PharmaIcons } from './Icons';
import { useState } from 'react';

// Composant Portefeuille de points
interface PointsWalletProps {
  points: number;
  currentTier: 'Bronze' | 'Argent' | 'Or' | 'Platine';
  nextTierPoints: number;
  bonusPerHour: number;
  maxBonus: number;
}

export function PointsWallet({ points, currentTier, nextTierPoints, bonusPerHour, maxBonus }: PointsWalletProps) {
  const progress = (points / nextTierPoints) * 100;
  
  const tierColors = {
    Bronze: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Argent: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    Or: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Platine: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  return (
    <Card className="p-6 pharma-gradient-card pharma-shadow-elevated">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">Portefeuille de points</h3>
        <Badge className={`${tierColors[currentTier]} font-semibold`}>
          {currentTier}
        </Badge>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-pharma-primary mb-2">{points.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">points disponibles</div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progression vers {currentTier === 'Platine' ? 'maximum' : 'palier suivant'}</span>
            <span className="font-medium">{points}/{nextTierPoints}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" className="text-pharma-primary" />
            <span className="font-medium">Bonus actuel</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-pharma-primary">+{bonusPerHour}€/h</div>
            <div className="text-xs text-muted-foreground">Max: +{maxBonus}€/h</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Composant Calculateur d'économies
interface SavingsCalculatorProps {
  onCalculate?: (hourlyRate: number, hours: number, savings: number) => void;
}

export function SavingsCalculator({ onCalculate }: SavingsCalculatorProps) {
  const [hourlyRate, setHourlyRate] = useState(25);
  const [hours, setHours] = useState(40);
  
  const ourCommission = 0.15; // 15%
  const agencyCommission = 0.275; // 27.5% moyenne
  
  const totalCost = hourlyRate * hours;
  const ourCost = totalCost * (1 + ourCommission);
  const agencyCost = totalCost * (1 + agencyCommission);
  const savings = agencyCost - ourCost;
  const savingsPercent = ((savings / agencyCost) * 100).toFixed(1);

  return (
    <Card className="p-6 pharma-gradient-card pharma-shadow-elevated">
      <div className="flex items-center mb-4">
        <Icon name="Calculator" className="text-pharma-primary mr-2" />
        <h3 className="text-lg">Calculateur d'économies</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Taux horaire (€)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg bg-input-background"
            min="15"
            max="50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nombre d'heures</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg bg-input-background"
            min="1"
            max="200"
          />
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
          <span className="text-sm">Coût agence classique</span>
          <span className="font-bold text-red-600">{agencyCost.toFixed(0)}€</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
          <span className="text-sm">Coût PharmaFlux</span>
          <span className="font-bold text-green-600">{ourCost.toFixed(0)}€</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-pharma-primary/10 rounded-lg border border-pharma-primary/20">
          <span className="font-medium">Économies réalisées</span>
          <div className="text-right">
            <div className="font-bold text-pharma-primary">{savings.toFixed(0)}€</div>
            <div className="text-xs text-pharma-primary">(-{savingsPercent}%)</div>
          </div>
        </div>
      </div>
      
      {onCalculate && (
        <Button 
          className="w-full" 
          onClick={() => onCalculate(hourlyRate, hours, savings)}
        >
          Commencer maintenant
        </Button>
      )}
    </Card>
  );
}

// Composant de progression ring
interface ProgressRingProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning';
  children?: React.ReactNode;
}

export function ProgressRing({ value, max, size = 'md', color = 'primary', children }: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  const colors = {
    primary: 'stroke-pharma-primary',
    success: 'stroke-pharma-success',
    warning: 'stroke-pharma-warning'
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-muted"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={colors[color]}
          style={{
            transition: 'stroke-dasharray 0.5s ease-in-out',
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// Composant Mission Card
interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    pharmacy: string;
    location: string;
    date: string;
    duration: string;
    hourlyRate: number;
    bonus?: number;
    urgent?: boolean;
    type: 'officine' | 'hospital';
  };
  onApply?: (missionId: string) => void;
  onSave?: (missionId: string) => void;
  saved?: boolean;
}

export function MissionCard({ mission, onApply, onSave, saved = false }: MissionCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(mission.id);
  };

  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }}>
      <Card className="p-6 pharma-gradient-card pharma-shadow-card hover:pharma-shadow-elevated transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold">{mission.title}</h3>
              {mission.urgent && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
              {mission.bonus && (
                <Badge className="bg-pharma-accent/20 text-pharma-accent text-xs">
                  +{mission.bonus}€/h
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-1">{mission.pharmacy}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Icon name="MapPin" size="sm" className="mr-1" />
                {mission.location}
              </div>
              <div className="flex items-center">
                <Icon name="Calendar" size="sm" className="mr-1" />
                {mission.date}
              </div>
              <div className="flex items-center">
                <Icon name="Clock" size="sm" className="mr-1" />
                {mission.duration}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Icon 
              name={isSaved ? "BookmarkCheck" : "Bookmark"} 
              className={isSaved ? "text-pharma-primary" : "text-muted-foreground"} 
            />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-lg font-bold text-pharma-primary">
              {mission.hourlyRate}€/h
            </div>
            <Badge variant="outline" className="capitalize">
              {mission.type}
            </Badge>
          </div>
          <Button 
            size="sm" 
            className="bg-pharma-primary hover:bg-pharma-primary/90"
            onClick={() => onApply?.(mission.id)}
          >
            Postuler
            <Icon name="ArrowRight" size="sm" className="ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Composant de partage de parrainage
interface ReferralShareModalProps {
  referralCode: string;
  referralLink: string;
  onClose: () => void;
}

export function ReferralShareModal({ referralCode, referralLink, onClose }: ReferralShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="max-w-md mx-auto p-6 pharma-gradient-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Partagez votre code</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Icon name="X" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Code de parrainage</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-1 px-3 py-2 border rounded-lg bg-input-background"
            />
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => copyToClipboard(referralCode)}
            >
              {copied ? <Icon name="Check" /> : <Icon name="Copy" />}
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Lien de parrainage</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 border rounded-lg bg-input-background text-xs"
            />
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => copyToClipboard(referralLink)}
            >
              {copied ? <Icon name="Check" /> : <Icon name="Copy" />}
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg">
            {/* QR Code placeholder - dans une vraie app, utiliser une lib comme qrcode.js */}
            <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
              <Icon name="QrCode" size="xl" className="text-gray-500" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Icon name="Share2" size="sm" className="mr-2" />
            Partager
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Download" size="sm" className="mr-2" />
            Télécharger QR
          </Button>
        </div>
      </div>
    </Card>
  );
}