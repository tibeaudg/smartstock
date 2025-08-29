import React, { useEffect, useState } from 'react';
import { fetchNotifications, sendNotification, deleteNotification } from '../lib/notifications';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id).then(setNotifications).finally(() => setLoading(false));
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message || !user) return;
    setSending(true);
    await sendNotification(form.title, form.message, user.id);
    setForm({ title: '', message: '' });
    // Refresh notifications
    fetchNotifications(user.id).then(setNotifications);
    setSending(false);
  };

  const handleShowUsers = async (notificationId: string) => {
    setShowUsers(notificationId);
    const { data: reads, error: readsError } = await supabase
      .from('notification_reads')
      .select('user_id, read_at')
      .eq('notification_id', notificationId);
    if (readsError || !reads || reads.length === 0) {
      setUsers([]);
      return;
    }
    const userIds = Array.from(new Set(reads.map((r: any) => r.user_id)));
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', userIds);
    const idToProfile: Record<string, any> = {};
    if (!profilesError && profiles) {
      for (const p of profiles) idToProfile[p.id] = p;
    }
    const merged = reads.map((r: any) => {
      const p = idToProfile[r.user_id];
      const fullName = p ? [p.first_name, p.last_name].filter(Boolean).join(' ') : '';
      const display = fullName || (p?.email ?? r.user_id);
      return { user_id: r.user_id, read_at: r.read_at, display };
    });
    setUsers(merged);
  };

  const handleDelete = async (notificationId: string) => {
    if (!window.confirm('Weet je zeker dat je deze melding wilt verwijderen?')) return;
    try {
      await deleteNotification(notificationId);
    } catch (e: any) {
      console.error('Delete notification failed:', e?.message || e);
      alert(e?.message || 'Kon melding niet verwijderen. Controleer RLS/policies in Supabase.');
      return;
    }
    try {
      if (user) {
        const refreshed = await fetchNotifications(user.id);
        setNotifications(refreshed);
      }
    } catch {}
    if (showUsers === notificationId) {
      setShowUsers(null);
      setUsers([]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Beheer Meldingen</h2>
      <form onSubmit={handleSend} className="mb-8 space-y-2">
        <input
          className="border rounded px-3 py-2 w-full text-sm sm:text-base"
          placeholder="Titel"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          required
        />
        <textarea
          className="border rounded px-3 py-2 w-full text-sm sm:text-base"
          placeholder="Bericht"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          required
          rows={isMobile ? 3 : 4}
        />
        <Button type="submit" disabled={sending} className="w-full sm:w-auto">
          {sending ? 'Versturen...' : 'Verstuur melding'}
        </Button>
      </form>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">Alle meldingen</h3>
      {loading ? <div>Laden...</div> : (
        <ul className="divide-y divide-gray-200">
          {notifications.map(n => (
            <li key={n.id} className="py-3">
              <div className={`flex ${isMobile ? 'flex-col' : 'justify-between items-center'} gap-2`}>
                <div className="flex-1">
                  <div className="font-medium text-sm sm:text-base">{n.title}</div>
                  <div className="text-gray-600 text-xs sm:text-sm">{n.message}</div>
                  <div className="text-gray-400 text-xs">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                <div className={`flex items-center gap-2 ${isMobile ? 'justify-end' : ''}`}>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleShowUsers(n.id)}
                    className="text-xs sm:text-sm"
                  >
                    Geopend door
                  </Button>
                  <button
                    className="p-2 rounded hover:bg-red-100 text-red-600"
                    title="Verwijder melding"
                    onClick={() => handleDelete(n.id)}
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
              {showUsers === n.id && (
                <div className="mt-2 bg-gray-50 p-2 rounded">
                  <div className="font-semibold text-xs mb-1">Gebruikers die deze melding hebben geopend:</div>
                  {users.length === 0 ? (
                    <div className="text-xs text-gray-500">Nog niet geopend</div>
                  ) : (
                    <ul className="text-xs space-y-1">
                      {users.map(u => (
                        <li key={u.user_id} className="break-words">
                          {u.display} 
                          <span className="text-gray-400 block sm:inline sm:ml-1">
                            ({new Date(u.read_at).toLocaleString()})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
