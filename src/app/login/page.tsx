'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações básicas
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Por favor, insira um e-mail válido');
        setLoading(false);
        return;
      }

      // Buscar todos os usuários registrados
      const allData = typeof window !== 'undefined' 
        ? localStorage.getItem('caloria-ai-users') 
        : null;
      
      const users = allData ? JSON.parse(allData) : [];

      // Procurar usuário pelo email
      const user = users.find((u: any) => u.email === email);

      if (!user) {
        setError('Usuário não encontrado. Verifique seu e-mail ou crie uma conta.');
        setLoading(false);
        return;
      }

      // Verificar senha
      if (user.password !== password) {
        setError('Senha incorreta. Tente novamente.');
        setLoading(false);
        return;
      }

      // Login bem-sucedido - salvar usuário na sessão
      store.setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        calorieGoal: user.calorieGoal || 2000,
        waterGoal: user.waterGoal || 2000,
        tipo_plano: user.tipo_plano || 'free',
        status_assinatura: user.status_assinatura || 'inativo',
        createdAt: user.createdAt
      });

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Caloria AI
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Entre na sua conta para continuar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                Não tem uma conta?
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-2"
            onClick={() => router.push('/signup')}
            disabled={loading}
          >
            Criar conta grátis
          </Button>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
