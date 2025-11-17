// Tipos de planos disponíveis
export type PlanType = 'free' | 'basico' | 'premium' | 'elite';

// Status da assinatura
export type SubscriptionStatus = 'ativo' | 'inativo' | 'trial';

// Interface do usuário com dados de assinatura
export interface User {
  id: string;
  email: string;
  name: string;
  tipo_plano: PlanType;
  status_assinatura: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Configuração de recursos por plano
export interface PlanFeatures {
  maxPhotosPerDay: number | 'unlimited';
  foodDatabase: 'basic' | 'advanced' | 'complete';
  aiRecognition: 'basic' | 'advanced' | 'premium';
  personalizedPlans: boolean;
  macroAnalysis: boolean;
  detailedReports: boolean;
  prioritySupport: boolean;
  noAds: boolean;
  aiConsulting: boolean;
  wearableIntegration: boolean;
  advancedGoals: boolean;
  customRecipes: boolean;
  exclusiveCommunity: boolean;
  earlyAccess: boolean;
  apiAccess: boolean;
}

// Mapeamento de recursos por tipo de plano
export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    maxPhotosPerDay: 10,
    foodDatabase: 'basic',
    aiRecognition: 'basic',
    personalizedPlans: false,
    macroAnalysis: false,
    detailedReports: false,
    prioritySupport: false,
    noAds: false,
    aiConsulting: false,
    wearableIntegration: false,
    advancedGoals: false,
    customRecipes: false,
    exclusiveCommunity: false,
    earlyAccess: false,
    apiAccess: false,
  },
  basico: {
    maxPhotosPerDay: 'unlimited',
    foodDatabase: 'advanced',
    aiRecognition: 'advanced',
    personalizedPlans: false,
    macroAnalysis: true,
    detailedReports: false,
    prioritySupport: true,
    noAds: true,
    aiConsulting: false,
    wearableIntegration: false,
    advancedGoals: false,
    customRecipes: false,
    exclusiveCommunity: false,
    earlyAccess: false,
    apiAccess: false,
  },
  premium: {
    maxPhotosPerDay: 'unlimited',
    foodDatabase: 'complete',
    aiRecognition: 'premium',
    personalizedPlans: true,
    macroAnalysis: true,
    detailedReports: true,
    prioritySupport: true,
    noAds: true,
    aiConsulting: false,
    wearableIntegration: false,
    advancedGoals: false,
    customRecipes: true,
    exclusiveCommunity: false,
    earlyAccess: false,
    apiAccess: false,
  },
  elite: {
    maxPhotosPerDay: 'unlimited',
    foodDatabase: 'complete',
    aiRecognition: 'premium',
    personalizedPlans: true,
    macroAnalysis: true,
    detailedReports: true,
    prioritySupport: true,
    noAds: true,
    aiConsulting: true,
    wearableIntegration: true,
    advancedGoals: true,
    customRecipes: true,
    exclusiveCommunity: true,
    earlyAccess: true,
    apiAccess: true,
  },
};

// Informações dos planos para exibição
export interface PlanInfo {
  type: PlanType;
  name: string;
  price: string;
  period: string;
  description: string;
  stripeLink: string;
}

export const PLANS_INFO: PlanInfo[] = [
  {
    type: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    description: 'Perfeito para começar sua jornada',
    stripeLink: '',
  },
  {
    type: 'basico',
    name: 'Semanal (Básico)',
    price: 'R$ 7,90',
    period: '/semana',
    description: 'Experimente o poder da IA',
    stripeLink: 'https://buy.stripe.com/6oUaEX7GS6yn8Xqfatg3602',
  },
  {
    type: 'premium',
    name: 'Mensal (Premium)',
    price: 'R$ 19,90',
    period: '/mês',
    description: 'Para quem leva saúde a sério',
    stripeLink: 'https://buy.stripe.com/7sY4gz8KWaOD5Le0fzg3601',
  },
  {
    type: 'elite',
    name: 'Anual (ELITE)',
    price: 'R$ 118,90',
    period: '/ano',
    description: 'O investimento mais inteligente',
    stripeLink: 'https://buy.stripe.com/cNidR91iu9Kz1uY6DXg3603',
  },
];
