'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Crown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PlansPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? store.getUser() : null;

  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      subtitle: 'Perfeito para começar',
      price: 'R$ 7,90',
      period: '/semana',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      url: 'https://buy.stripe.com/6oUaEX7GS6yn8Xqfatg3602',
      features: [
        'Análise de fotos com IA',
        'Escaneamento de códigos de barras',
        'Banco de dados com 1M+ alimentos',
        'Acompanhamento de calorias',
        'Registro de água e exercícios',
        'Suporte por email'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Mais popular',
      price: 'R$ 19,90',
      period: '/mês',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      url: 'https://buy.stripe.com/7sY4gz8KWaOD5Le0fzg3601',
      badge: 'Mais Popular',
      features: [
        'Tudo do plano Básico',
        'Sugestões personalizadas de IA',
        'Gráficos de progresso avançados',
        'Receitas personalizadas',
        'Integração com apps de fitness',
        'Suporte prioritário'
      ]
    },
    {
      id: 'elite',
      name: 'ELITE',
      subtitle: 'Melhor custo-benefício',
      price: 'R$ 118,90',
      period: '/ano',
      icon: Crown,
      color: 'from-amber-500 to-orange-500',
      url: 'https://buy.stripe.com/cNidR91iu9Kz1uY6DXg3603',
      badge: 'Economize 50%',
      savings: 'Equivalente a R$ 9,90/mês',
      features: [
        'Tudo do plano Premium',
        'Análise nutricional completa',
        'Planos de refeição personalizados',
        'Consultoria nutricional mensal',
        'Acesso antecipado a novos recursos',
        'Suporte VIP 24/7'
      ]
    }
  ];

  const handleSubscribe = (url: string) => {
    // Abre o link do Stripe em nova aba
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          {user && (
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          )}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Escolha seu Plano
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Transforme sua saúde com IA
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Alcance suas metas com o poder da{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Inteligência Artificial
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Tire uma foto, escaneie um código de barras ou descreva sua refeição. 
            Nossa IA calcula tudo instantaneamente.
          </p>
        </div>

        {/* Social Proof */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">10k+</div>
            <div className="text-gray-600 dark:text-gray-400">Usuários ativos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">1M+</div>
            <div className="text-gray-600 dark:text-gray-400">Alimentos no banco</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">4.9★</div>
            <div className="text-gray-600 dark:text-gray-400">Avaliação média</div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isElite = plan.id === 'elite';
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6 border-2 ${
                  isElite 
                    ? 'border-amber-500 dark:border-amber-400 transform scale-105' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.color} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {plan.subtitle}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>

                  {plan.savings && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 px-4 py-2 rounded-xl text-sm font-semibold text-center">
                      💰 {plan.savings}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.url)}
                  className={`w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                >
                  Assinar {plan.name}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Elite Plan Highlight */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center space-y-6">
          <Crown className="w-16 h-16 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Plano ELITE: O melhor investimento na sua saúde
          </h2>
          <p className="text-xl text-white/90">
            Economize mais de 50% com o plano anual. Apenas R$ 9,90/mês quando você assina por um ano completo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <div className="text-sm opacity-90">Plano Mensal</div>
              <div className="text-2xl font-bold">R$ 19,90/mês</div>
            </div>
            <div className="text-3xl font-bold">→</div>
            <div className="bg-white text-amber-600 px-6 py-3 rounded-xl">
              <div className="text-sm font-semibold">Plano ELITE</div>
              <div className="text-2xl font-bold">R$ 9,90/mês</div>
            </div>
          </div>
          <Button
            onClick={() => handleSubscribe('https://buy.stripe.com/cNidR91iu9Kz1uY6DXg3603')}
            className="bg-white text-amber-600 hover:bg-gray-100 h-14 px-8 rounded-xl text-lg font-bold"
          >
            Assinar Plano ELITE Agora
          </Button>
        </div>

        {/* FAQ / Benefits */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Por que escolher o Caloria AI?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                IA de última geração
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nossa inteligência artificial analisa fotos, códigos de barras e texto para fornecer informações nutricionais precisas em segundos.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Rápido e fácil
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Registre suas refeições em segundos. Sem digitação manual, sem complicação. Apenas tire uma foto e pronto.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Banco de dados completo
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Acesso a mais de 1 milhão de alimentos com informações nutricionais detalhadas e atualizadas.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Resultados comprovados
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Milhares de usuários já alcançaram suas metas de saúde e fitness com nossa plataforma.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Comece sua jornada hoje
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Junte-se a milhares de pessoas que já transformaram sua saúde com o Caloria AI
          </p>
          {!user && (
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white h-14 px-8 rounded-xl text-lg font-semibold">
                Criar Conta Grátis
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
