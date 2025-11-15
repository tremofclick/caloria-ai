'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, ArrowLeft, User as UserIcon, Target, Moon, LogOut, Bell } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState('');
  const [dailyWaterGoal, setDailyWaterGoal] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const currentUser = store.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setName(currentUser.name);
    setEmail(currentUser.email);
    setDailyCalorieGoal(currentUser.dailyCalorieGoal.toString());
    setDailyWaterGoal(currentUser.dailyWaterGoal.toString());
    setDarkMode(currentUser.darkMode);
    setNotifications(currentUser.notifications);
  }, [router]);

  const handleSave = () => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name,
      email,
      dailyCalorieGoal: parseInt(dailyCalorieGoal),
      dailyWaterGoal: parseInt(dailyWaterGoal),
      darkMode,
      notifications
    };

    store.setUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    const updatedUser = { ...user!, darkMode: checked };
    store.setUser(updatedUser);
    setUser(updatedUser);
    
    // Apply dark mode immediately to the document
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    store.logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <Button
              onClick={() => setEditing(!editing)}
              variant="outline"
              className="rounded-xl"
            >
              {editing ? 'Cancelar' : 'Editar'}
            </Button>
          </div>

          {editing && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl"
                >
                  Salvar Alterações
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Goals Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Metas Diárias
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calorieGoal">Meta de calorias (kcal)</Label>
              <Input
                id="calorieGoal"
                type="number"
                value={dailyCalorieGoal}
                onChange={(e) => setDailyCalorieGoal(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waterGoal">Meta de água (ml)</Label>
              <Input
                id="waterGoal"
                type="number"
                value={dailyWaterGoal}
                onChange={(e) => setDailyWaterGoal(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <Button
              onClick={handleSave}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Atualizar Metas
            </Button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Preferências
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Modo escuro
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tema escuro para uso noturno
                  </p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Notificações
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lembretes e alertas
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => {
                  setNotifications(checked);
                  const updatedUser = { ...user, notifications: checked };
                  store.setUser(updatedUser);
                  setUser(updatedUser);
                }}
              />
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Informações da Conta
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sexo</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Feminino' : 'Outro'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Altura</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user.height} cm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Peso atual</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user.currentWeight} kg
              </span>
            </div>
            {user.targetWeight && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Peso objetivo</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.targetWeight} kg
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Objetivo</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user.goal === 'lose' ? 'Perder peso' : user.goal === 'gain' ? 'Ganhar peso' : 'Manter peso'}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full h-12 rounded-xl"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair da Conta
        </Button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-4">
          <p>Caloria AI v1.0</p>
          <p className="mt-1">© 2024 Todos os direitos reservados</p>
        </div>
      </main>
    </div>
  );
}
