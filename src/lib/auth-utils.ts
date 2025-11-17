import { PlanType, SubscriptionStatus, PLAN_FEATURES } from './types';

// Verificar se usuário tem acesso a um recurso específico
export function hasFeatureAccess(
  planType: PlanType,
  status: SubscriptionStatus,
  feature: keyof typeof PLAN_FEATURES.free
): boolean {
  // Se assinatura não está ativa, só tem acesso ao plano free
  if (status !== 'ativo' && status !== 'trial') {
    return PLAN_FEATURES.free[feature] as boolean;
  }

  return PLAN_FEATURES[planType][feature] as boolean;
}

// Verificar se usuário pode acessar uma rota/recurso
export function canAccessResource(
  planType: PlanType,
  status: SubscriptionStatus,
  requiredPlan: PlanType
): boolean {
  // Se assinatura não está ativa, só tem acesso ao plano free
  if (status !== 'ativo' && status !== 'trial') {
    return requiredPlan === 'free';
  }

  // Hierarquia de planos: free < basico < premium < elite
  const planHierarchy: Record<PlanType, number> = {
    free: 0,
    basico: 1,
    premium: 2,
    elite: 3,
  };

  return planHierarchy[planType] >= planHierarchy[requiredPlan];
}

// Obter limite de fotos por dia
export function getPhotosLimit(
  planType: PlanType,
  status: SubscriptionStatus
): number | 'unlimited' {
  if (status !== 'ativo' && status !== 'trial') {
    return PLAN_FEATURES.free.maxPhotosPerDay;
  }

  return PLAN_FEATURES[planType].maxPhotosPerDay;
}

// Verificar se usuário atingiu limite de fotos
export function hasReachedPhotosLimit(
  photosToday: number,
  planType: PlanType,
  status: SubscriptionStatus
): boolean {
  const limit = getPhotosLimit(planType, status);
  
  if (limit === 'unlimited') {
    return false;
  }

  return photosToday >= limit;
}

// Obter mensagem de upgrade para usuários free
export function getUpgradeMessage(feature: string): string {
  return `Este recurso está disponível apenas para assinantes. Faça upgrade para desbloquear ${feature} e muito mais!`;
}

// Verificar se é trial
export function isTrialActive(status: SubscriptionStatus): boolean {
  return status === 'trial';
}

// Verificar se assinatura está ativa
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === 'ativo' || status === 'trial';
}

// Obter nome amigável do plano
export function getPlanDisplayName(planType: PlanType): string {
  const names: Record<PlanType, string> = {
    free: 'Gratuito',
    basico: 'Básico',
    premium: 'Premium',
    elite: 'Elite',
  };

  return names[planType];
}

// Obter badge do plano (para UI)
export function getPlanBadge(planType: PlanType): {
  text: string;
  color: string;
} | null {
  switch (planType) {
    case 'elite':
      return { text: 'ELITE', color: 'purple' };
    case 'premium':
      return { text: 'PREMIUM', color: 'emerald' };
    case 'basico':
      return { text: 'BÁSICO', color: 'blue' };
    default:
      return null;
  }
}
