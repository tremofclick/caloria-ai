'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, TrendingDown, Droplets, Check, Zap, Crown, Star, ArrowRight, Users, Heart, BarChart3, Shield } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    // Se já estiver autenticado, redirecionar para dashboard
    if (store.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar sua jornada',
      features: [
        'Até 10 fotos por dia',
        'Banco de dados básico',
        'Contador de calorias',
        'Acompanhamento de água',
        'Suporte por email'
      ],
      cta: 'Começar Grátis',
      paymentLink: '/signup',
      popular: false,
      gradient: 'from-gray-500 to-gray-600',
      type: 'free'
    },
    {
      name: 'Semanal (Básico)',
      price: 'R$ 7,90',
      period: '/semana',
      description: 'Experimente o poder da IA',
      features: [
        'Fotos ilimitadas',
        '+500 mil alimentos',
        'IA de reconhecimento',
        'Análise de macronutrientes',
        'Relatórios semanais',
        'Suporte prioritário',
        'Sem anúncios'
      ],
      cta: 'Assinar Semanal (Básico)',
      paymentLink: 'https://buy.stripe.com/6oUaEX7GS6yn8Xqfatg3602',
      popular: false,
      gradient: 'from-blue-500 to-cyan-500',
      type: 'basico'
    },
    {
      name: 'Mensal (Premium)',
      price: 'R$ 19,90',
      period: '/mês',
      description: 'Para quem leva saúde a sério',
      features: [
        'Tudo do Básico +',
        '+1 milhão de alimentos',
        'IA avançada de reconhecimento',
        'Planos personalizados',
        'Análise completa de macros',
        'Relatórios detalhados',
        'Suporte prioritário 24/7',
        'Receitas personalizadas'
      ],
      cta: 'Assinar Mensal (Premium)',
      paymentLink: 'https://buy.stripe.com/7sY4gz8KWaOD5Le0fzg3601',
      popular: true,
      gradient: 'from-emerald-500 to-cyan-500',
      savings: 'Melhor custo-benefício mensal',
      type: 'premium'
    },
    {
      name: 'Anual (ELITE)',
      price: 'R$ 118,90',
      period: '/ano',
      originalPrice: 'R$ 238,80',
      description: 'O investimento mais inteligente',
      features: [
        'Tudo do Premium +',
        'Consultoria nutricional IA',
        'Integração com wearables',
        'Metas avançadas de treino',
        'Comunidade exclusiva',
        'Acesso antecipado a recursos',
        'API para desenvolvedores',
        'Suporte VIP dedicado'
      ],
      cta: 'Assinar Anual (ELITE)',
      paymentLink: 'https://buy.stripe.com/cNidR91iu9Kz1uY6DXg3603',
      popular: false,
      gradient: 'from-purple-500 to-pink-500',
      savings: '🔥 ECONOMIZE R$ 120/ANO - Apenas R$ 9,90/mês',
      badge: 'MELHOR OFERTA',
      type: 'elite'
    }
  ];

  // Filtrar planos baseado na seleção
  const displayedPlans = selectedPlan === 'weekly' 
    ? plans.filter(p => p.type === 'free' || p.type === 'basico')
    : selectedPlan === 'monthly'
    ? plans.filter(p => p.type === 'free' || p.type === 'premium')
    : plans.filter(p => p.type === 'free' || p.type === 'elite');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Caloria AI
          </span>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/login')}
          className="text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-800"
        >
          Entrar
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium">
            <Users className="w-4 h-4" />
            <span>Mais de 50.000 usuários transformando suas vidas</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
            Transforme seu corpo com{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              inteligência artificial
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Perca peso de forma inteligente e sustentável. Tire uma foto da sua refeição e nossa IA calcula calorias, macros e te guia para seus objetivos.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-4">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Precisão IA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">-8kg</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Média em 3 meses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">4.9★</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avaliação</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg"
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-10 py-7 rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 font-semibold"
            >
              Começar Grátis Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => {
                const plansSection = document.getElementById('plans');
                plansSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-lg px-10 py-7 rounded-2xl border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
            >
              Ver Planos
            </Button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            ✓ Sem cartão de crédito • ✓ Cancele quando quiser • ✓ Garantia de 7 dias
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Foto = Calorias
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Nossa IA identifica automaticamente todos os alimentos na foto e calcula calorias em segundos. Sem digitação manual!
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                +1 Milhão de Alimentos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Banco de dados gigante com marcas brasileiras e internacionais. Encontre qualquer alimento instantaneamente.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Resultados Reais
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Perca peso de forma sustentável com planos personalizados e sugestões inteligentes da nossa IA.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="grid md:grid-cols-2 gap-4 pt-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Acompanhe água e exercícios</span>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Relatórios detalhados de progresso</span>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Sugestões personalizadas com IA</span>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Comunidade de apoio ativa</span>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="plans" className="max-w-7xl mx-auto pt-24 md:pt-32">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Escolha seu plano ideal
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comece grátis e evolua quando estiver pronto. Todos os planos incluem garantia de 7 dias.
            </p>
            
            {/* Toggle Weekly/Monthly/Yearly */}
            <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
              <button
                onClick={() => setSelectedPlan('weekly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedPlan === 'weekly'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                  selectedPlan === 'yearly'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Anual
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                  -50%
                </span>
              </button>
            </div>

            {selectedPlan === 'yearly' && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-6 py-3 rounded-full animate-pulse">
                <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-700 dark:text-purple-300 font-bold">
                  🔥 OFERTA ESPECIAL: Economize R$ 120 no plano anual!
                </span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {displayedPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  plan.popular ? 'ring-4 ring-emerald-500 scale-105' : 'hover:scale-105'
                } ${plan.badge ? 'ring-4 ring-purple-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-bl-2xl font-semibold flex items-center gap-1 shadow-lg">
                    <Crown className="w-4 h-4" />
                    Mais Popular
                  </div>
                )}

                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-bl-2xl font-semibold flex items-center gap-1 shadow-lg animate-pulse">
                    <Shield className="w-4 h-4" />
                    {plan.badge}
                  </div>
                )}
                
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      {plan.originalPrice && (
                        <span className="text-2xl text-gray-400 line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>
                    {plan.savings && (
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        plan.badge 
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 animate-pulse'
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {plan.savings}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      if (plan.paymentLink.startsWith('http')) {
                        window.open(plan.paymentLink, '_blank');
                      } else {
                        router.push(plan.paymentLink);
                      }
                    }}
                    className={`w-full py-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                      plan.popular || plan.badge
                        ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-2xl hover:scale-105`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Button>

                  <div className="space-y-3 pt-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              💳 Pagamento 100% seguro via Stripe • 🔒 Dados criptografados • 🎁 Garantia de 7 dias
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto pt-24 md:pt-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-12">
            O que nossos usuários dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Maria Silva',
                role: 'Perdeu 12kg em 4 meses',
                text: 'Nunca pensei que seria tão fácil! Só tiro foto e pronto. Já perdi 12kg sem sofrimento.',
                rating: 5
              },
              {
                name: 'João Santos',
                role: 'Ganhou massa muscular',
                text: 'Como atleta, preciso de precisão. O Caloria AI me ajuda a bater minhas macros todos os dias.',
                rating: 5
              },
              {
                name: 'Ana Costa',
                role: 'Mudou estilo de vida',
                text: 'Finalmente entendo o que como. A IA me ensinou a fazer escolhas melhores naturalmente.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto pt-24 md:pt-32 text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para transformar seu corpo?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já estão alcançando seus objetivos com Caloria AI
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-10 py-7 rounded-2xl font-semibold shadow-xl hover:scale-105 transition-all duration-300"
            >
              Começar Grátis Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-white/80 text-sm mt-4">
              Sem cartão de crédito • Cancele quando quiser
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-24 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Caloria AI
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 Caloria AI. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <a href="#" className="hover:text-emerald-600 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
