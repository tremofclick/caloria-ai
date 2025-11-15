'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Camera, Database, Sparkles, Droplets, ArrowRight } from 'lucide-react';

const onboardingSteps = [
  {
    icon: Camera,
    title: 'Acompanhe suas calorias com apenas uma imagem',
    description: 'Tire uma foto da sua refeição e nossa IA identifica os alimentos e calcula as calorias automaticamente.',
    gradient: 'from-emerald-500 to-cyan-500'
  },
  {
    icon: Database,
    title: 'Banco de dados com mais de 1 milhão de alimentos',
    description: 'Pesquise em um banco completo com marcas e produtos globais, ou adicione seus próprios alimentos personalizados.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Sparkles,
    title: 'Receba sugestões inteligentes para atingir suas metas',
    description: 'Nossa IA analisa seu histórico e oferece recomendações personalizadas para otimizar sua dieta.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Droplets,
    title: 'Acompanhe água e exercícios diários',
    description: 'Registre sua hidratação e atividades físicas para ter uma visão completa da sua saúde.',
    gradient: 'from-blue-500 to-indigo-500'
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/setup');
    }
  };

  const handleSkip = () => {
    router.push('/setup');
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
          {/* Progress Indicators */}
          <div className="flex justify-center gap-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-gradient-to-r ' + step.gradient
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className={`w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {step.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {step.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleNext}
              className={`w-full h-12 bg-gradient-to-r ${step.gradient} hover:opacity-90 text-white rounded-xl text-lg font-semibold`}
            >
              {currentStep < onboardingSteps.length - 1 ? (
                <>
                  Próximo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                'Começar'
              )}
            </Button>
            
            {currentStep < onboardingSteps.length - 1 && (
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="w-full h-12 text-gray-600 dark:text-gray-400"
              >
                Pular
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
