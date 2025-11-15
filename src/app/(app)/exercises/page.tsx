'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { generateId, formatDate, formatTime } from '@/lib/utils';
import { Exercise, User, ExerciseType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dumbbell, ArrowLeft, Plus, Flame } from 'lucide-react';
import Link from 'next/link';

export default function ExercisesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [exerciseType, setExerciseType] = useState<ExerciseType>('cardio');
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    const currentUser = store.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const today = formatDate(new Date());
    const todayExercises = store.getExercises(currentUser.id, today);
    setExercises(todayExercises);
  }, [router]);

  const addExercise = () => {
    if (!user || !exerciseName || !duration) return;

    const exercise: Exercise = {
      id: generateId(),
      userId: user.id,
      type: exerciseType,
      name: exerciseName,
      duration: parseInt(duration),
      caloriesBurned: calories ? parseInt(calories) : Math.round(parseInt(duration) * 5), // Estimativa simples
      date: formatDate(new Date()),
      time: formatTime(new Date()),
      source: 'manual',
      createdAt: new Date().toISOString()
    };

    store.addExercise(exercise);
    setExercises([...exercises, exercise]);
    
    // Reset form
    setExerciseName('');
    setDuration('');
    setCalories('');
    setDialogOpen(false);
  };

  if (!user) return null;

  const totalCalories = exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);

  const getExerciseIcon = (type: ExerciseType) => {
    return <Dumbbell className="w-5 h-5" />;
  };

  const getExerciseColor = (type: ExerciseType) => {
    const colors = {
      cardio: 'from-orange-500 to-red-500',
      strength: 'from-purple-500 to-pink-500',
      flexibility: 'from-green-500 to-emerald-500',
      sports: 'from-blue-500 to-cyan-500',
      other: 'from-gray-500 to-gray-600'
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Exercícios de Hoje
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalCalories}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              kcal queimadas
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalDuration}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              minutos
            </p>
          </div>
        </div>

        {/* Add Exercise Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl text-lg font-semibold">
              <Plus className="w-6 h-6 mr-2" />
              Adicionar Exercício
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Exercício</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipo de exercício</Label>
                <Select value={exerciseType} onValueChange={(v) => setExerciseType(v as ExerciseType)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Musculação</SelectItem>
                    <SelectItem value="flexibility">Flexibilidade</SelectItem>
                    <SelectItem value="sports">Esportes</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do exercício</Label>
                <Input
                  id="name"
                  placeholder="Ex: Corrida, Musculação, Yoga..."
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calorias queimadas (opcional)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Deixe em branco para estimativa automática"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <Button
                onClick={addExercise}
                disabled={!exerciseName || !duration}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
              >
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Exercise List */}
        {exercises.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Atividades de hoje
            </h2>
            
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getExerciseColor(exercise.type)} rounded-xl flex items-center justify-center`}>
                      {getExerciseIcon(exercise.type)}
                      <span className="text-white">{getExerciseIcon(exercise.type)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.duration} min • {exercise.caloriesBurned} kcal • {exercise.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
            <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum exercício registrado hoje
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Adicione suas atividades físicas para acompanhar seu progresso
            </p>
          </div>
        )}

        {/* Tip */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="font-bold text-lg mb-2">💪 Dica</h3>
          <p className="text-white/90">
            Exercícios regulares aceleram o metabolismo e ajudam a atingir suas metas de peso mais rapidamente.
          </p>
        </div>
      </main>
    </div>
  );
}
