'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-32 h-32 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Assinatura Confirmada! 🎉
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Parabéns! Sua assinatura foi processada com sucesso.
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-emerald-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bem-vindo ao Caloria AI Premium
            </h2>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Análise de fotos ilimitada
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tire quantas fotos quiser e receba análises nutricionais instantâneas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Sugestões personalizadas de IA
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receba recomendações inteligentes baseadas nos seus hábitos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Gráficos de progresso avançados
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Acompanhe sua evolução com visualizações detalhadas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Suporte prioritário
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Atendimento rápido e dedicado quando você precisar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl p-8 text-white space-y-4">
          <h3 className="text-2xl font-bold">
            Próximos Passos
          </h3>
          <p className="text-white/90">
            Comece agora mesmo a usar todos os recursos premium do Caloria AI. 
            Tire uma foto da sua próxima refeição e veja a mágica acontecer!
          </p>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white h-14 px-12 rounded-xl text-lg font-semibold">
              Ir para o App
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Um email de confirmação foi enviado para você com todos os detalhes da sua assinatura.
          </p>
        </div>

        {/* Support */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Precisa de ajuda? Entre em contato com nosso{' '}
          <a href="mailto:suporte@caloriaai.com" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
            suporte
          </a>
        </div>
      </div>
    </div>
  );
}
