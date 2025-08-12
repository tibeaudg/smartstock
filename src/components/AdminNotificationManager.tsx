import React, { useEffect, useState } from 'react';
import { fetchNotifications, sendNotification, deleteNotification } from '../lib/notifications';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export const AdminNotificationManager: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', message: '' });
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (notificationId: string) => {
    if (!window.confirm('Weet je zeker dat je deze melding wilt verwijderen?')) return;
    setDeletingId(notificationId);
    try {
      await deleteNotification(notificationId);
      fetchNotifications(user.id).then(setNotifications);
    } finally {
      setDeletingId(null);
    }
  };

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
    fetchNotifications(user.id).then(setNotifications);
    setSending(false);
  };

  const handleShowUsers = async (notificationId: string) => {
    setShowUsers(notificationId);
    const { data, error } = await supabase
      .from('notification_reads')
      .select('user_id, read_at')
      .eq('notification_id', notificationId);
    if (!error && data) setUsers(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Meldingen</h2>
      <form onSubmit={handleSend} className="mb-8 space-y-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Titel"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          required
        />
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Bericht"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          required
        />
        <Button type="submit" disabled={sending}>{sending ? 'Versturen...' : 'Verstuur melding'}</Button>
      </form>
      <h3 className="text-xl font-semibold mb-2">Alle meldingen</h3>
      {loading ? <div>Laden...</div> : (
        <ul className="divide-y divide-gray-200">
          {notifications.map(n => (
            <li key={n.id} className="py-3">
              <div className="flex justify-between items-center gap-2">
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-gray-600 text-sm">{n.message}</div>
                  <div className="text-gray-400 text-xs">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Button size="sm" variant="outline" onClick={() => handleShowUsers(n.id)}>
                    Geopend door
                  </Button>
                  <button
                    className="p-2 rounded hover:bg-red-100 text-red-600 disabled:opacity-50"
                    title="Verwijder melding"
                    onClick={() => handleDelete(n.id)}
                    disabled={deletingId === n.id}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {showUsers === n.id && (
                <div className="mt-2 bg-gray-50 p-2 rounded">
                  <div className="font-semibold text-xs mb-1">Gebruikers die deze melding hebben geopend:</div>
                  {users.length === 0 ? (
                    <div className="text-xs text-gray-500">Nog niet geopend</div>
                  ) : (
                    <ul className="text-xs">
                      {users.map(u => (
                        <li key={u.user_id}>{u.user_id} <span className="text-gray-400">({new Date(u.read_at).toLocaleString()})</span></li>
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
};
