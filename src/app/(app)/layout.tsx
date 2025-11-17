'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { store } from '@/lib/store';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const user = store.getUser();
    
    if (!user) {
      // Usuário não autenticado, redirecionar para login
      router.push('/login');
    } else {
      setIsChecking(false);
    }
  }, [router, pathname]);

  // Mostrar loading enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
