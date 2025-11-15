'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { generateAISuggestions } from '@/lib/ai';
import { generateId, formatDate } from '@/lib/utils';
import { User, AISuggestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SuggestionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  useEffect(() => {
    const currentUser = store.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // Buscar sugestões existentes
    let existingSuggestions = store.getSuggestions(currentUser.id);
    
    // Se não houver sugestões de hoje, gerar novas
    const today = formatDate(new Date());
    const todaySuggestions = existingSuggestions.filter(s => s.date === today);
    
    if (todaySuggestions.length === 0) {
      // Calcular dados do dia
      const meals = store.getMeals(currentUser.id, today);
      const waterLogs = store.getWaterLogs(currentUser.id, today);
      
      const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
      const totalProtein = meals.reduce((sum, meal) => sum + meal.totalProtein, 0);
      const totalCarbs = meals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
      const totalFat = meals.reduce((sum, meal) => sum + meal.totalFat, 0);
      const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);
      
      // Gerar sugestões
      const newSuggestionTexts = generateAISuggestions(
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        totalWater,
        currentUser.dailyCalorieGoal,
        currentUser.dailyProteinGoal,
        currentUser.dailyWaterGoal
      );
      
      // Criar objetos de sugestão
      const newSuggestions: AISuggestion[] = newSuggestionTexts.map(text => ({
        id: generateId(),
        userId: currentUser.id,
        date: today,
        text,
        type: 'diet',
        status: 'new',
        createdAt: new Date().toISOString()
      }));
      
      // Salvar sugestões
      newSuggestions.forEach(s => store.addSuggestion(s));
      existingSuggestions = [...existingSuggestions, ...newSuggestions];
    }
    
    setSuggestions(existingSuggestions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, [router]);

  const markAsRead = (suggestionId: string) => {
    store.markSuggestionAsRead(suggestionId);
    setSuggestions(suggestions.map(s => 
      s.id === suggestionId ? { ...s, status: 'read' as const } : s
    ));
  };

  if (!user) return null;

  const newSuggestions = suggestions.filter(s => s.status === 'new');
  const readSuggestions = suggestions.filter(s => s.status === 'read');

  const getSuggestionIcon = (type: string) => {
    return <Lightbulb className="w-6 h-6" />;
  };

  const getSuggestionColor = (type: string) => {
    const colors = {
      diet: 'from-emerald-500 to-cyan-500',
      water: 'from-blue-500 to-cyan-500',
      exercise: 'from-orange-500 to-red-500'
    };
    return colors[type as keyof typeof colors] || colors.diet;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Sugestões Inteligentes
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Hero */}
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl shadow-lg p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Recomendações Personalizadas
          </h2>
          <p className="text-white/90">
            Nossa IA analisa seus hábitos e oferece sugestões para você atingir suas metas
          </p>
        </div>

        {/* New Suggestions */}
        {newSuggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Novas sugestões
            </h3>
            
            {newSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getSuggestionColor(suggestion.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {suggestion.text}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {new Date(suggestion.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => markAsRead(suggestion.id)}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Marcar como lida
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Read Suggestions */}
        {readSuggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Sugestões anteriores
            </h3>
            
            {readSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getSuggestionColor(suggestion.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {suggestion.text}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {new Date(suggestion.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long'
                      })}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {suggestions.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma sugestão ainda
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Continue registrando suas refeições e atividades para receber recomendações personalizadas
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
