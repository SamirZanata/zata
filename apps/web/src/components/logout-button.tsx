'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/src/actions/auth-actions';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" size="sm">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </form>
  );
}

