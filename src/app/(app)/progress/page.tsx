'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { generateId, formatDate } from '@/lib/utils';
import { User, WeightLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Weight, ArrowLeft, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30');
  
  // Form state
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');

  useEffect(() => {
    const currentUser = store.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const logs = store.getWeightLogs(currentUser.id);
    setWeightLogs(logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [router]);

  const addWeightLog = () => {
    if (!user || !weight) return;

    const log: WeightLog = {
      id: generateId(),
      userId: user.id,
      date: formatDate(new Date()),
      weight: parseFloat(weight),
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
      createdAt: new Date().toISOString()
    };

    store.addWeightLog(log);
    
    // Atualizar peso atual do usuário
    user.currentWeight = parseFloat(weight);
    store.setUser(user);
    
    setWeightLogs([log, ...weightLogs]);
    setWeight('');
    setWaist('');
    setHips('');
    setDialogOpen(false);
  };

  if (!user) return null;

  // Filtrar logs por período
  const now = new Date();
  const daysAgo = new Date(now.getTime() - parseInt(period) * 24 * 60 * 60 * 1000);
  const filteredLogs = weightLogs.filter(log => new Date(log.date) >= daysAgo);

  // Preparar dados para o gráfico
  const chartData = filteredLogs
    .slice()
    .reverse()
    .map(log => ({
      date: new Date(log.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: log.weight
    }));

  // Calcular progresso
  const firstWeight = filteredLogs[filteredLogs.length - 1]?.weight;
  const lastWeight = filteredLogs[0]?.weight;
  const weightChange = lastWeight && firstWeight ? lastWeight - firstWeight : 0;
  const isLosing = weightChange < 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Progresso
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Weight className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.currentWeight}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Peso atual (kg)
            </p>
          </div>

          {user.targetWeight && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${isLosing ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-red-500'} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                {isLosing ? <TrendingDown className="w-6 h-6 text-white" /> : <TrendingUp className="w-6 h-6 text-white" />}
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.abs(user.currentWeight - user.targetWeight).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                kg até a meta
              </p>
            </div>
          )}
        </div>

        {/* Add Weight Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl text-lg font-semibold">
              <Plus className="w-6 h-6 mr-2" />
              Registrar Peso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Medidas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist">Cintura (cm) - Opcional</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.1"
                  placeholder="80"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hips">Quadril (cm) - Opcional</Label>
                <Input
                  id="hips"
                  type="number"
                  step="0.1"
                  placeholder="95"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <Button
                onClick={addWeightLog}
                disabled={!weight}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
              >
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as '7' | '30' | '90')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <TabsTrigger value="7" className="rounded-xl py-3">7 dias</TabsTrigger>
            <TabsTrigger value="30" className="rounded-xl py-3">30 dias</TabsTrigger>
            <TabsTrigger value="90" className="rounded-xl py-3">90 dias</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Weight Chart */}
        {chartData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Evolução do Peso
              </h2>
              {weightChange !== 0 && (
                <div className={`flex items-center gap-1 ${isLosing ? 'text-green-600' : 'text-orange-600'}`}>
                  {isLosing ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  <span className="font-semibold">
                    {isLosing ? '' : '+'}{weightChange.toFixed(1)} kg
                  </span>
                </div>
              )}
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '8px 12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="url(#colorGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
            <Weight className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum registro ainda
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comece a registrar seu peso para acompanhar seu progresso
            </p>
          </div>
        )}

        {/* History */}
        {weightLogs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Histórico
            </h2>
            
            <div className="space-y-2">
              {weightLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {log.weight} kg
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(log.date).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  {(log.waist || log.hips) && (
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      {log.waist && <p>Cintura: {log.waist}cm</p>}
                      {log.hips && <p>Quadril: {log.hips}cm</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
