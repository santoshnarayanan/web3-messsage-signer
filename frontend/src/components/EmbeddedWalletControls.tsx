import { useState } from 'react';
import { useEmbeddedWallet, useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function EmbeddedWalletControls() {
  const { user, primaryWallet } = useDynamicContext();
  const { userHasEmbeddedWallet, createEmbeddedWallet } = useEmbeddedWallet();
  const [creating, setCreating] = useState(false);

  const address = primaryWallet?.address;

  // Normalize: handle case where it's a function
  const hasWallet =
    typeof userHasEmbeddedWallet === 'function'
      ? userHasEmbeddedWallet()
      : !!userHasEmbeddedWallet;

  const onCreate = async () => {
    try {
      setCreating(true);
      if (!hasWallet) {
        await createEmbeddedWallet(); // updates primaryWallet
      }
    } finally {
      setCreating(false);
    }
  };

  if (!user) return <p>Please authenticate first.</p>;

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button onClick={onCreate} disabled={creating || hasWallet}>
          {hasWallet ? 'Embedded wallet ready' : creating ? 'Creating…' : 'Create embedded wallet'}
        </button>
      </div>
      <div>
        <small>Primary wallet address</small>
        <div className="address">{address ?? '—'}</div>
      </div>
    </div>
  );
}
