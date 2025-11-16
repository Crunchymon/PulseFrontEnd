'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ModeToggle } from '@/components/mode-toggle';
import PulseLogo from '@/components/PulseLogo';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-orange-500/10">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center">
            <PulseLogo size="small" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname === '/dashboard' 
                  ? 'gradient-pulse-text font-semibold' 
                  : 'text-muted-foreground hover:text-orange-500'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/polls/create"
              className={`text-sm font-medium transition-colors ${
                pathname === '/polls/create' 
                  ? 'gradient-pulse-text font-semibold' 
                  : 'text-muted-foreground hover:text-orange-500'
              }`}
            >
              Create Poll
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}


