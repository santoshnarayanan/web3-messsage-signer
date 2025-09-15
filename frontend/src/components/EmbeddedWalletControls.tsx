import { useState } from 'react';
import { useEmbeddedWallet, useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function EmbeddedWalletControls() {
  const { user, primaryWallet } = useDynamicContext();
  const { userHasEmbeddedWallet, createEmbeddedWallet } = useEmbeddedWallet();
  const [creating, setCreating] = useState(false);

  const address = primaryWallet?.address; // documented on useDynamicContext page

  const onCreate = async () => {
    try {
      setCreating(true);
      if (!userHasEmbeddedWallet) {
        await createEmbeddedWallet(); // returns walletId; primaryWallet updates
      }
    } finally {
      setCreating(false);
    }
  };

  if (!user) return <p>Please authenticate first.</p>;

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button onClick={onCreate} disabled={creating || userHasEmbeddedWallet}>
          {userHasEmbeddedWallet ? 'Embedded wallet ready' : creating ? 'Creating…' : 'Create embedded wallet'}
        </button>
      </div>
      <div>
        <small>Primary wallet address</small>
        <div className="address">{address ?? '—'}</div>
      </div>
    </div>
  );
}
