// Collection d'icônes spécifiques à la pharmacie
import { 
  Cross, 
  Pill, 
  Stethoscope, 
  Shield, 
  ShieldCheck,
  Clock, 
  MapPin, 
  Map,
  Navigation,
  Car,
  Star,
  TrendingUp,
  Users,
  Award,
  Heart,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  Search,
  Filter,
  Settings,
  Bell,
  User,
  Building,
  Briefcase,
  GraduationCap,
  Calculator,
  Gift,
  Share2,
  QrCode,
  Copy,
  Download,
  Upload,
  Mail,
  Phone,
  Lock,
  Unlock,
  Home,
  FileText,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  MessageCircle,
  Send,
  Edit,
  Trash2,
  MoreHorizontal,
  MoreVertical,
  X,
  Check,
  Info,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Loader2,
  SunIcon,
  MoonIcon
} from 'lucide-react';

// Icônes personnalisées pour la pharmacie
export const PharmaIcons = {
  // Métier
  Cross,
  Pill,
  Stethoscope,
  
  // Confiance & Sécurité
  Shield,
  ShieldCheck,
  CheckCircle,
  Award,
  
  // Navigation
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Home,
  
  // Interface
  Search,
  Filter,
  Settings,
  Bell,
  Eye,
  EyeOff,
  MoreHorizontal,
  MoreVertical,
  X,
  Check,
  Plus,
  Minus,
  
  // Utilisateurs
  User,
  Users,
  Building,
  GraduationCap,
  
  // Business
  Briefcase,
  DollarSign,
  Calculator,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  
  // Temps & Planning
  Clock,
  Calendar,
  
  // Localisation
  MapPin,
  Map,
  Navigation,
  Car,
  
  // Fidélité & Gamification
  Star,
  Gift,
  Sparkles,
  Heart,
  ThumbsUp,
  
  // Partage & Communication
  Share2,
  QrCode,
  Copy,
  Mail,
  Phone,
  MessageCircle,
  Send,
  
  // Actions
  Download,
  Upload,
  Edit,
  Trash2,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  
  // Sécurité
  Lock,
  Unlock,
  
  // Informations
  Info,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  
  // États
  Loader2,
  Zap,
  
  // Mode sombre/clair
  Sun: SunIcon,
  Moon: MoonIcon
};

// Composant d'icône générique avec props standardisées
interface IconProps {
  name: keyof typeof PharmaIcons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
};

export function Icon({ name, size = 'md', className = '' }: IconProps) {
  const IconComponent = PharmaIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <IconComponent 
      className={`${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    />
  );
}

// Icônes métier spécifiques avec couleurs
export function PharmaIcon() {
  return (
    <div className="relative">
      <Cross className="w-6 h-6 text-pharma-primary" />
    </div>
  );
}

export function PharmacistIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 bg-pharma-primary/10 rounded-full">
      <Stethoscope className="w-5 h-5 text-pharma-primary" />
    </div>
  );
}

export function PreparatorIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 bg-pharma-secondary/10 rounded-full">
      <Pill className="w-5 h-5 text-pharma-secondary" />
    </div>
  );
}

export function StudentIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 bg-pharma-accent/10 rounded-full">
      <GraduationCap className="w-5 h-5 text-pharma-accent" />
    </div>
  );
}