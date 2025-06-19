import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully! You can now log in.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="border p-2 rounded w-full mb-4"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Reset Password
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {message && <p className="text-green-600 mt-2">{message}</p>}
    </form>
  );
}