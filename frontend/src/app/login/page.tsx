'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { Spinner } from '@/components/ui/Spinner';
import { useAppStore } from '@/store/useAppStore';
import { loginUser, getCurrentUser } from '@/lib/api/auth';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('demo@droneplatform.in');
  const [password, setPassword] = useState('demo1234');
  const setUser = useAppStore(state => state.setUser);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { access_token } = await loginUser(email, password);
      localStorage.setItem('token', access_token);
      const user = await getCurrentUser();
      setUser(user);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-brand-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌾</span>
          </div>
          <CardTitle className="text-2xl">{t('auth.welcomeBack')}</CardTitle>
          <p className="text-text-secondary text-sm mt-2">AgriDrone Platform</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('auth.email')}
              </label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('auth.password')}
              </label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-md font-medium transition-colors flex justify-center items-center h-10 mt-6"
            >
              {loading ? <Spinner size="sm" className="text-white" /> : t('auth.signIn')}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-text-secondary">
            Use demo@droneplatform.in / demo1234 to login
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
