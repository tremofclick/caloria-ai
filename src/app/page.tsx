'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, TrendingDown, Droplets } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Se já estiver autenticado, redirecionar para dashboard
    if (store.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

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
          className="text-gray-700 dark:text-gray-300"
        >
          Entrar
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Acompanhe suas calorias com{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              apenas uma imagem
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tire uma foto, escaneie um código de barras ou descreva sua refeição e obtenha calorias instantâneas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Criar conta grátis
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => router.push('/login')}
              className="text-lg px-8 py-6 rounded-2xl border-2"
            >
              Já tenho conta
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Foto Inteligente
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                IA identifica alimentos e calcula calorias automaticamente
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                +1 Milhão de Alimentos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Banco de dados completo com marcas e produtos globais
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Perca Peso Sem Esforço
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sugestões inteligentes para você se manter no caminho certo
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="pt-12 space-y-4">
            <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
              <Droplets className="w-5 h-5 text-cyan-500" />
              <span>Acompanhe sua água e exercícios diários</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>Sugestões personalizadas com IA</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>© 2024 Caloria AI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
