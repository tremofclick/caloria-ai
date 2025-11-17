'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações
      if (!name || !email || !password || !confirmPassword) {
        setError('Por favor, preencha todos os campos');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Por favor, insira um e-mail válido');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }

      // Buscar usuários existentes
      const allData = typeof window !== 'undefined' 
        ? localStorage.getItem('caloria-ai-users') 
        : null;
      
      const users = allData ? JSON.parse(allData) : [];

      // Verificar se email já existe
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        setError('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
        setLoading(false);
        return;
      }

      // Criar novo usuário
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        password, // Em produção, usar hash
        calorieGoal: 2000,
        waterGoal: 2000,
        tipo_plano: 'free',
        status_assinatura: 'inativo',
        createdAt: new Date().toISOString()
      };

      // Salvar no localStorage de usuários
      users.push(newUser);
      localStorage.setItem('caloria-ai-users', JSON.stringify(users));

      // Fazer login automático
      store.setUser({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        calorieGoal: newUser.calorieGoal,
        waterGoal: newUser.waterGoal,
        tipo_plano: newUser.tipo_plano,
        status_assinatura: newUser.status_assinatura,
        createdAt: newUser.createdAt
      });

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
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
            Crie sua conta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comece a acompanhar suas calorias hoje
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  disabled={loading}
                />
              </div>
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </Button>

            {/* Terms */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
            </p>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                Já tem uma conta?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-2"
            onClick={() => router.push('/login')}
            disabled={loading}
          >
            Fazer login
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
