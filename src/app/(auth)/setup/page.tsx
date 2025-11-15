'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, ArrowRight } from 'lucide-react';
import { store } from '@/lib/store';
import { generateId, calculateDailyCalories, calculateMacros } from '@/lib/utils';
import { User, Gender, Goal, ActivityLevel } from '@/lib/types';

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState('');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [goal, setGoal] = useState<Goal>('lose');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    // Recuperar dados do signup
    const signupData = sessionStorage.getItem('signup-data');
    const { name, email, password } = signupData ? JSON.parse(signupData) : {};

    // Calcular metas
    const userData = {
      currentWeight: parseFloat(currentWeight),
      height: parseFloat(height),
      birthDate,
      gender,
      activityLevel,
      goal
    };

    const dailyCalories = calculateDailyCalories(userData);
    const macros = calculateMacros(dailyCalories, goal);

    // Criar usuário
    const user: User = {
      id: generateId(),
      name: name || 'Usuário',
      email: email || 'user@example.com',
      gender,
      birthDate,
      height: parseFloat(height),
      currentWeight: parseFloat(currentWeight),
      targetWeight: targetWeight ? parseFloat(targetWeight) : undefined,
      goal,
      activityLevel,
      dailyCalorieGoal: dailyCalories,
      dailyProteinGoal: macros.protein,
      dailyCarbGoal: macros.carbs,
      dailyFatGoal: macros.fat,
      dailyWaterGoal: 2000,
      darkMode: false,
      unitSystem: 'metric',
      notifications: true,
      integrations: [],
      tipo_plano: 'free',
      status_assinatura: 'inativo',
      createdAt: new Date().toISOString()
    };

    store.setUser(user);
    sessionStorage.removeItem('signup-data');

    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Configure seu perfil
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Etapa {step} de 3
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 1: Dados Básicos */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Sexo</Label>
                <RadioGroup value={gender} onValueChange={(v) => setGender(v as Gender)}>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2 flex-1">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Feminino</Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">Outro</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">Peso atual (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    placeholder="70"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Objetivo */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Qual é o seu objetivo?</Label>
                <RadioGroup value={goal} onValueChange={(v) => setGoal(v as Goal)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-4 border-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                      <RadioGroupItem value="lose" id="lose" />
                      <Label htmlFor="lose" className="cursor-pointer flex-1">
                        <div className="font-semibold">Perder peso</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Déficit calórico para emagrecimento</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                      <RadioGroupItem value="maintain" id="maintain" />
                      <Label htmlFor="maintain" className="cursor-pointer flex-1">
                        <div className="font-semibold">Manter peso</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Equilíbrio calórico para manutenção</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                      <RadioGroupItem value="gain" id="gain" />
                      <Label htmlFor="gain" className="cursor-pointer flex-1">
                        <div className="font-semibold">Ganhar peso</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Superávit calórico para ganho de massa</div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetWeight">Peso objetivo (kg) - Opcional</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="65"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Step 3: Nível de Atividade */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Nível de atividade física</Label>
                <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as ActivityLevel)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                    <SelectItem value="light">Levemente ativo (1-3 dias/semana)</SelectItem>
                    <SelectItem value="moderate">Moderadamente ativo (3-5 dias/semana)</SelectItem>
                    <SelectItem value="active">Muito ativo (6-7 dias/semana)</SelectItem>
                    <SelectItem value="very_active">Extremamente ativo (2x por dia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl space-y-2">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                  Suas metas serão calculadas automaticamente
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Com base nas suas informações, vamos sugerir metas diárias de calorias e macronutrientes personalizadas para você.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                Voltar
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={loading || (step === 1 && (!birthDate || !height || !currentWeight))}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl text-lg font-semibold"
            >
              {loading ? 'Finalizando...' : step === 3 ? 'Finalizar' : 'Próximo'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
