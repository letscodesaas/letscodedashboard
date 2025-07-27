'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      toast.success('You are already logged in, redirecting...');
      router.push('/dashboard');
    }
  }, []);

  async function userLogin() {
    try {
      setLoading(true);
      if (!userInfo.email || !userInfo.password) {
        toast.error('Please fill in all fields.');
        return;
      }
      const info = await trpc.auth.signin.mutate(userInfo);
      window.sessionStorage.setItem('token', info.message);
      toast.success('Login successful, redirecting...');
      router.push('/dashboard');
    } catch {
      toast.error(
        'Login failed. Please check your email and password and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            value={userInfo.email}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
        </div>
        <Button
          onClick={userLogin}
          className="w-full"
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  );
}
