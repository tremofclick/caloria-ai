'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { PlanType } from '@/lib/types';
import { canAccessResource } from '@/lib/auth-utils';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedFeatureProps {
  children: React.ReactNode;
  requiredPlan: PlanType;
  featureName: string;
  fallback?: React.ReactNode;
}

export function ProtectedFeature({
  children,
  requiredPlan,
  featureName,
  fallback
}: ProtectedFeatureProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = store.getUser();
    
    if (!user) {
      router.push('/');
      return;
    }

    const access = canAccessResource(
      user.tipo_plano,
      user.status_assinatura,
      requiredPlan
    );

    setHasAccess(access);
    setIsLoading(false);
  }, [requiredPlan, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 text-center space-y-4 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-purple-600" />
            Recurso Premium
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {featureName} está disponível apenas para assinantes {requiredPlan === 'basico' ? 'Básico' : requiredPlan === 'premium' ? 'Premium' : 'Elite'} ou superior.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => router.push('/#plans')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Ver Planos e Fazer Upgrade
          </Button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-500">
          Desbloqueie este e muitos outros recursos premium
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook para verificar acesso a recursos
export function useFeatureAccess(requiredPlan: PlanType) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = store.getUser();
    
    if (!user) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    const access = canAccessResource(
      user.tipo_plano,
      user.status_assinatura,
      requiredPlan
    );

    setHasAccess(access);
    setIsLoading(false);
  }, [requiredPlan]);

  return { hasAccess, isLoading };
}

// Badge de plano do usuário
export function PlanBadge() {
  const [planType, setPlanType] = useState<PlanType>('free');

  useEffect(() => {
    const user = store.getUser();
    if (user) {
      setPlanType(user.tipo_plano);
    }
  }, []);

  if (planType === 'free') {
    return null;
  }

  const badges = {
    basico: { text: 'BÁSICO', gradient: 'from-blue-500 to-cyan-500' },
    premium: { text: 'PREMIUM', gradient: 'from-emerald-500 to-cyan-500' },
    elite: { text: 'ELITE', gradient: 'from-purple-500 to-pink-500' },
  };

  const badge = badges[planType];

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${badge.gradient} text-white text-xs font-bold shadow-lg`}>
      <Crown className="w-3 h-3" />
      {badge.text}
    </div>
  );
}
