'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from './ui/Button';

export function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <span className="text-sm font-bold text-white">Mo</span>
          </div>
          <span className="text-xl font-bold text-gray-900">MoCampaign</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Campaigns
          </Link>
          <Link
            href="/campaigns/create"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Start Fundraising
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
