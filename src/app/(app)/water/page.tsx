'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { generateId, formatDate, formatTime } from '@/lib/utils';
import { WaterLog, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function WaterPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [totalWater, setTotalWater] = useState(0);
  const [logs, setLogs] = useState<WaterLog[]>([]);

  useEffect(() => {
    const currentUser = store.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const today = formatDate(new Date());
    const waterLogs = store.getWaterLogs(currentUser.id, today);
    setLogs(waterLogs);
    setTotalWater(waterLogs.reduce((sum, log) => sum + log.amount, 0));
  }, [router]);

  const addWater = (amount: number) => {
    if (!user) return;

    const log: WaterLog = {
      id: generateId(),
      userId: user.id,
      date: formatDate(new Date()),
      amount,
      time: formatTime(new Date()),
      createdAt: new Date().toISOString()
    };

    store.addWaterLog(log);
    setLogs([...logs, log]);
    setTotalWater(totalWater + amount);
  };

  if (!user) return null;

  const progress = (totalWater / user.dailyWaterGoal) * 100;
  const remaining = Math.max(0, user.dailyWaterGoal - totalWater);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Água de Hoje
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Water Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
            <Droplets className="w-16 h-16 text-white" />
          </div>

          <div>
            <p className="text-5xl font-bold text-gray-900 dark:text-white">
              {totalWater}ml
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              de {user.dailyWaterGoal}ml
            </p>
          </div>

          <Progress value={progress} className="h-3" />

          {remaining > 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              Faltam <span className="font-semibold text-blue-600 dark:text-blue-400">{remaining}ml</span> para atingir sua meta
            </p>
          ) : (
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
              🎉 Meta atingida! Continue se hidratando!
            </p>
          )}
        </div>

        {/* Quick Add Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Adicionar água
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => addWater(250)}
              className="h-20 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl flex flex-col items-center justify-center"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-lg font-semibold">250ml</span>
              <span className="text-xs opacity-90">1 copo</span>
            </Button>

            <Button
              onClick={() => addWater(500)}
              className="h-20 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl flex flex-col items-center justify-center"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-lg font-semibold">500ml</span>
              <span className="text-xs opacity-90">1 garrafa</span>
            </Button>

            <Button
              onClick={() => addWater(750)}
              className="h-20 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl flex flex-col items-center justify-center"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-lg font-semibold">750ml</span>
              <span className="text-xs opacity-90">Garrafa grande</span>
            </Button>

            <Button
              onClick={() => addWater(1000)}
              className="h-20 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl flex flex-col items-center justify-center"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-lg font-semibold">1000ml</span>
              <span className="text-xs opacity-90">1 litro</span>
            </Button>
          </div>
        </div>

        {/* History */}
        {logs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Histórico de hoje
            </h2>
            
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {log.amount}ml
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {log.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="font-bold text-lg mb-2">💡 Dica</h3>
          <p className="text-white/90">
            Beber água regularmente ajuda na digestão, controle de apetite e melhora o desempenho físico e mental.
          </p>
        </div>
      </main>
    </div>
  );
}
