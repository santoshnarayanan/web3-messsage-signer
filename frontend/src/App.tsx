import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import AuthEmail from './components/AuthEmail';
import EmbeddedWalletControls from './components/EmbeddedWalletControls';
import SignMessage from './components/SignMessage';
import History from './components/History';

const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID as string;
console.log('Using Dynamic Environment ID:', environmentId);

export default function App() {
  return (
    <div className="container">
      <DynamicContextProvider
        settings={{
          environmentId,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <header>
          <h1>Web3 Message Signer & Verifier</h1>
          <p className="muted">Headless Dynamic.xyz + ethers.js</p>
        </header>

        <section className="card">
          <h2>1) Authenticate (Email + OTP, Headless)</h2>
          <AuthEmail />
        </section>

        <section className="card">
          <h2>2) Embedded Wallet (Headless)</h2>
          <EmbeddedWalletControls />
        </section>

        <section className="card">
          <h2>3) Sign a Message & Verify</h2>
          <SignMessage />
        </section>

        <section className="card">
          <h2>Signed Messages (Local History)</h2>
          <History />
        </section>
      </DynamicContextProvider>
    </div>
  );
}
