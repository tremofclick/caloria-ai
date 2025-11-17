'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { User, DailySummary } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Droplets, Dumbbell, Weight, Settings, TrendingUp, Sparkles, Camera, Barcode, Lock, Crown, X } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  const [summary, setSummary] = useState<DailySummary>({
    date: formatDate(new Date()),
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
    exerciseCalories: 0,
    mealsCount: 0,
    exercisesCount: 0
  });

  useEffect(() => {
    const currentUser = store.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // Calcular resumo do dia
    const today = formatDate(new Date());
    const meals = store.getMeals(currentUser.id, today);
    const waterLogs = store.getWaterLogs(currentUser.id, today);
    const exercises = store.getExercises(currentUser.id, today);

    const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const totalProtein = meals.reduce((sum, meal) => sum + meal.totalProtein, 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
    const totalFat = meals.reduce((sum, meal) => sum + meal.totalFat, 0);
    const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);
    const totalExerciseCalories = exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);

    setSummary({
      date: today,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      water: totalWater,
      exerciseCalories: totalExerciseCalories,
      mealsCount: meals.length,
      exercisesCount: exercises.length
    });
  }, [router]);

  const handlePremiumFeatureClick = (feature: string) => {
    if (user?.tipo_plano === 'free') {
      setUpgradeFeature(feature);
      setShowUpgradeModal(true);
    }
  };

  if (!user) return null;

  const calorieProgress = (summary.calories / user.dailyCalorieGoal) * 100;
  const proteinProgress = (summary.protein / user.dailyProteinGoal) * 100;
  const carbProgress = (summary.carbs / user.dailyCarbGoal) * 100;
  const fatProgress = (summary.fat / user.dailyFatGoal) * 100;
  const waterProgress = (summary.water / user.dailyWaterGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Olá, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Upgrade Banner for Free Users */}
        {user.tipo_plano === 'free' && (
          <Link href="/#plans">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white cursor-pointer hover:opacity-90 transition-opacity">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Desbloqueie recursos Premium</h3>
                  <p className="text-white/90">Tire fotos, leia códigos de barras e muito mais</p>
                </div>
                <Button className="bg-white text-purple-600 hover:bg-gray-100">
                  Ver Planos
                </Button>
              </div>
            </div>
          </Link>
        )}

        {/* Premium Features - Camera & Barcode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => handlePremiumFeatureClick('Tirar foto de alimentos')}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900 dark:text-white">Tirar Foto</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reconhecimento automático</p>
              </div>
              {user.tipo_plano === 'free' && (
                <Lock className="w-5 h-5 text-purple-500" />
              )}
            </div>
            {user.tipo_plano === 'free' && (
              <div className="absolute top-2 right-2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              </div>
            )}
          </div>

          <div 
            onClick={() => handlePremiumFeatureClick('Ler código de barras')}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Barcode className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900 dark:text-white">Código de Barras</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Escaneie produtos</p>
              </div>
              {user.tipo_plano === 'free' && (
                <Lock className="w-5 h-5 text-purple-500" />
              )}
            </div>
            {user.tipo_plano === 'free' && (
              <div className="absolute top-2 right-2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Calorie Ring */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - Math.min(calorieProgress / 100, 1))}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {summary.calories}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  / {user.dailyCalorieGoal}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">kcal</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Proteína</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(summary.protein)}g / {user.dailyProteinGoal}g</span>
                </div>
                <Progress value={proteinProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carboidratos</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(summary.carbs)}g / {user.dailyCarbGoal}g</span>
                </div>
                <Progress value={carbProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gorduras</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(summary.fat)}g / {user.dailyFatGoal}g</span>
                </div>
                <Progress value={fatProgress} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/water">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Água de hoje</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.water}ml
                  </p>
                  <Progress value={waterProgress} className="h-1 mt-2" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/exercises">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Exercícios</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.exerciseCalories} kcal
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {summary.exercisesCount} atividades
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/progress">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Weight className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Peso atual</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.currentWeight} kg
                  </p>
                  {user.targetWeight && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Meta: {user.targetWeight} kg
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* AI Suggestions */}
        <Link href="/suggestions">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Sugestões inteligentes</p>
                <p className="text-white/90 text-sm">Veja recomendações personalizadas para você</p>
              </div>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>

        {/* Recent Meals */}
        {summary.mealsCount > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Refeições de hoje
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {summary.mealsCount} refeição(ões) registrada(s)
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <Link href="/add-meal">
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-2xl hover:shadow-3xl transition-all"
          >
            <Plus className="w-8 h-8 text-white" />
          </Button>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </Link>
            <Link href="/water" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
              <Droplets className="w-6 h-6" />
              <span className="text-xs">Água</span>
            </Link>
            <Link href="/exercises" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
              <Dumbbell className="w-6 h-6" />
              <span className="text-xs">Exercícios</span>
            </Link>
            <Link href="/progress" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
              <Weight className="w-6 h-6" />
              <span className="text-xs">Progresso</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Recurso Premium
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>{upgradeFeature}</strong> está disponível apenas para assinantes.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Desbloqueie agora e tenha acesso a:
                </h3>
                <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <Camera className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Reconhecimento de alimentos por foto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Barcode className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Leitura de códigos de barras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Sugestões personalizadas com IA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Gráficos avançados de progresso</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/#plans" onClick={() => setShowUpgradeModal(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-all">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Ver Planos e Fazer Upgrade
                  </Button>
                </Link>
                
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-2"
                >
                  Continuar com plano gratuito
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500">
                💎 Planos a partir de R$ 7,90/semana
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
