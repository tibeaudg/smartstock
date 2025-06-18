import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const response: any = await signIn(email, password);
        const { error, user } = response;

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Ongeldig e-mailadres of wachtwoord.');
          } else {
            toast.error(error.message);
          }
          return;
        }

        if (user && !user.confirmed_at) {
          toast.error('Bevestig eerst je e-mailadres via de bevestigingsmail.');
          return;
        }

        toast.success('Welkom terug!');
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });

        // Tijdelijke fix voor auth context die nog niet is bijgewerkt
        window.location.reload();

      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          toast.error('Wachtwoorden komen niet overeen.');
          return;
        }
        if (password.length < 6) {
          toast.error('Wachtwoord moet minimaal 6 tekens zijn.');
          return;
        }

        const { error } = await signUp(email, password, firstName, lastName, 'admin');

        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('Er bestaat al een account met dit e-mailadres.');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('Account aangemaakt! Bevestig je e-mailadres via de mail.');
        setMode('login');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');

      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Reset e-mail verzonden! Controleer je inbox.');
        setMode('login');
      }
    } catch (err) {
      console.error('Auth fout:', err);
      toast.error('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">StockManager</h1>
          <p className="text-gray-600">Professioneel voorraadbeheer</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {mode === 'login' && 'Inloggen'}
              {mode === 'register' && 'Account aanmaken'}
              {mode === 'reset' && 'Wachtwoord herstellen'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' && 'Voer je gegevens in om in te loggen'}
              {mode === 'register' && 'Vul je gegevens in om een account aan te maken'}
              {mode === 'reset' && 'Voer je e-mailadres in om een resetlink te ontvangen'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Voornaam</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Achternaam</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {mode !== 'reset' && (
                <div>
                  <Label htmlFor="password">Wachtwoord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Even geduld...
                  </>
                ) : (
                  <>
                    {mode === 'login' && 'Inloggen'}
                    {mode === 'register' && 'Account aanmaken'}
                    {mode === 'reset' && 'Verzend reset e-mail'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-blue-600 hover:underline"
                  disabled={isSubmitting}
                >
                  Wachtwoord vergeten?
                </button>
                <div className="text-sm text-gray-600">
                  Nog geen account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-blue-600 hover:underline"
                    disabled={isSubmitting}
                  >
                    Registreer
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div className="text-sm text-gray-600">
                Heb je al een account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:underline"
                  disabled={isSubmitting}
                >
                  Inloggen
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div className="text-sm text-gray-600">
                Toch nog toegang?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:underline"
                  disabled={isSubmitting}
                >
                  Inloggen
                </button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
