'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, ArrowRight, Crown } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Aqui você pode adicionar lógica para atualizar o status da assinatura
    // quando o Stripe redirecionar de volta após pagamento bem-sucedido
    
    // Exemplo: pegar parâmetros da URL do Stripe
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // TODO: Fazer requisição para verificar status do pagamento
      // e atualizar dados do usuário no localStorage/backend
      console.log('Session ID do Stripe:', sessionId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Card de Sucesso */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8">
          {/* Ícone de Sucesso */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Bem-vindo ao Caloria AI! 🎉
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Sua assinatura foi ativada com sucesso. Agora você tem acesso a todos os recursos premium!
            </p>
          </div>

          {/* Benefícios Desbloqueados */}
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              Recursos Desbloqueados
            </h2>
            <div className="grid md:grid-cols-2 gap-3 text-left">
              {[
                'Fotos ilimitadas por dia',
                'IA avançada de reconhecimento',
                'Análise completa de macros',
                'Planos personalizados',
                'Relatórios detalhados',
                'Suporte prioritário 24/7',
                'Receitas personalizadas',
                'Sem anúncios'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Próximos Passos:
            </h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <p>✓ Acesse o dashboard e configure suas metas</p>
              <p>✓ Tire sua primeira foto e veja a IA em ação</p>
              <p>✓ Explore todos os recursos premium disponíveis</p>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="pt-6">
            <Button
              size="lg"
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-10 py-7 rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 font-semibold w-full md:w-auto"
            >
              Ir para o App
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Informações Adicionais */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Você receberá um email de confirmação com todos os detalhes da sua assinatura.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Precisa de ajuda? Entre em contato com nosso suporte prioritário.
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Caloria AI
          </span>
        </div>
      </div>
    </div>
  );
}
