import type { FormEvent } from 'react';
import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { loadHistory, saveHistory } from '../lib/history';
import type { HistoryItem } from '../lib/history';

const API_URL = import.meta.env.VITE_API_URL as string;

export default function SignMessage() {
    const { primaryWallet } = useDynamicContext();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ isValid: boolean; signer: string | null } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [items, setItems] = useState<HistoryItem[]>(() => loadHistory());
    const canSign = !!primaryWallet;

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (!primaryWallet) {
            setError('No primary wallet available. Authenticate and create an embedded wallet first.');
            return;
        }
        const form = e.currentTarget as any;
        const message = form.message.value as string;
        if (!message.trim()) { setError('Please enter a message'); return; }

        try {
            setLoading(true);
            // Headless signing — no widget
            const signature = await primaryWallet.signMessage(message);
            if (!signature) {
                throw new Error('Failed to generate signature');
            }

            const res = await fetch(`${API_URL}/verify-signature`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, signature }),
            });
            const data = await res.json();
            setResult({ isValid: data.isValid, signer: data.signer });

            const entry: HistoryItem = {
                id: crypto.randomUUID(),
                message,
                signature,
                isValid: !!data.isValid,
                signer: data.signer ?? null,
                at: Date.now(),
            };
            const next = [entry, ...items].slice(0, 50);
            setItems(next);
            saveHistory(next);
            window.dispatchEvent(new StorageEvent('storage', { key: 'signed-messages' }));
            form.reset();
        } catch (err: any) {
            setError(err?.message ?? 'Failed to sign/verify');
        } finally {
            setLoading(false);
        }
    };

    const address: string | null = primaryWallet?.address ?? null;

    return (
        <div>
            <div style={{ marginBottom: 8 }}>
                <small>Connected wallet:</small>
                <div className="address">{address ?? '—'}</div>
            </div>
            <form onSubmit={onSubmit} className="row" style={{ alignItems: 'flex-start' }}>
                <textarea name="message" placeholder="Type any message…" rows={3} style={{ flex: 1 }} />
                <button type="submit" disabled={!canSign || loading}>
                    {loading ? 'Signing…' : 'Sign & Verify'}
                </button>
            </form>

            {result && (
                <div style={{ marginTop: 8 }}>
                    <div>Signature valid? <b>{result.isValid ? 'Yes ✅' : 'No ❌'}</b></div>
                    <div>Recovered signer: <span className="address">{result.signer ?? '—'}</span></div>
                </div>
            )}
            {error && <p style={{ color: '#ff7a7a' }}>{error}</p>}
        </div>
    );
}
