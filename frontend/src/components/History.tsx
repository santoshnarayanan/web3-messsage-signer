import { useEffect, useState } from 'react';
import { loadHistory } from '../lib/history';
import type { HistoryItem } from '../lib/history';

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const update = () => setItems(loadHistory());
    update(); // initial load
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);


  if (!items.length) return <p>No messages yet.</p>;

  return (
    <div>
      {items.map(it => (
        <div key={it.id} className="history-item">
          <div><small>{new Date(it.at).toLocaleString()}</small></div>
          <div>Message: {it.message}</div>
          <div>Signature: <span className="address">{it.signature}</span></div>
          <div>Valid: <b>{it.isValid ? 'Yes' : 'No'}</b></div>
          <div>Signer: <span className="address">{it.signer ?? '—'}</span></div>
        </div>
      ))}
    </div>
  );
}
