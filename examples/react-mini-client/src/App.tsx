import { useState, useEffect } from 'react';
import { NearRpcClient, status, viewAccount } from '@near-js/jsonrpc-client';
import './App.css';

// Create clients for both mainnet and testnet
const mainnetClient = new NearRpcClient({
  endpoint: 'https://rpc.mainnet.fastnear.com',
  timeout: 10000,
});

const testnetClient = new NearRpcClient({
  endpoint: 'https://rpc.testnet.fastnear.com',
  timeout: 10000,
});

interface NetworkStatus {
  chainId: string;
  latestBlockHeight: number;
  latestBlockHash: string;
  protocolVersion: number;
}

interface AccountInfo {
  accountId: string;
  amount: string;
  storageUsage: number;
}

function App() {
  const [mainnetStatus, setMainnetStatus] = useState<NetworkStatus | null>(
    null
  );
  const [testnetStatus, setTestnetStatus] = useState<NetworkStatus | null>(
    null
  );
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch status from both networks in parallel
        const [mainnetRes, testnetRes] = await Promise.all([
          status(mainnetClient),
          status(testnetClient),
        ]);

        setMainnetStatus({
          chainId: mainnetRes.chainId,
          latestBlockHeight: mainnetRes.syncInfo.latestBlockHeight,
          latestBlockHash: mainnetRes.syncInfo.latestBlockHash,
          protocolVersion: mainnetRes.protocolVersion,
        });

        setTestnetStatus({
          chainId: testnetRes.chainId,
          latestBlockHeight: testnetRes.syncInfo.latestBlockHeight,
          latestBlockHash: testnetRes.syncInfo.latestBlockHash,
          protocolVersion: testnetRes.protocolVersion,
        });

        // Fetch a well-known testnet account
        const accountRes = await viewAccount(testnetClient, {
          accountId: 'testnet',
          finality: 'final',
        });

        // Handle different account response types
        if ('amount' in accountRes && 'storageUsage' in accountRes) {
          setAccount({
            accountId: 'testnet',
            amount: accountRes.amount,
            storageUsage: accountRes.storageUsage,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatBalance = (yoctoNear: string) => {
    const near = parseFloat(yoctoNear) / 1e24;
    return near.toFixed(2);
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 NEAR RPC Client React Demo</h1>
        <p>
          Demonstrating tree-shaking optimized NEAR RPC calls with static
          functions
        </p>
      </header>

      {loading && (
        <div className="loading">
          <p>Loading NEAR network data...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <main className="content">
          <div className="networks">
            <div className="network-card">
              <h2>🌐 Mainnet Status</h2>
              {mainnetStatus && (
                <div className="network-info">
                  <p>
                    <strong>Chain ID:</strong> {mainnetStatus.chainId}
                  </p>
                  <p>
                    <strong>Latest Block:</strong> #
                    {mainnetStatus.latestBlockHeight.toLocaleString()}
                  </p>
                  <p>
                    <strong>Block Hash:</strong>{' '}
                    {formatHash(mainnetStatus.latestBlockHash)}
                  </p>
                  <p>
                    <strong>Protocol:</strong> v{mainnetStatus.protocolVersion}
                  </p>
                </div>
              )}
            </div>

            <div className="network-card">
              <h2>🧪 Testnet Status</h2>
              {testnetStatus && (
                <div className="network-info">
                  <p>
                    <strong>Chain ID:</strong> {testnetStatus.chainId}
                  </p>
                  <p>
                    <strong>Latest Block:</strong> #
                    {testnetStatus.latestBlockHeight.toLocaleString()}
                  </p>
                  <p>
                    <strong>Block Hash:</strong>{' '}
                    {formatHash(testnetStatus.latestBlockHash)}
                  </p>
                  <p>
                    <strong>Protocol:</strong> v{testnetStatus.protocolVersion}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="account-card">
            <h2>👤 Account Information</h2>
            {account && (
              <div className="account-info">
                <p>
                  <strong>Account ID:</strong> {account.accountId}
                </p>
                <p>
                  <strong>Balance:</strong> {formatBalance(account.amount)} NEAR
                </p>
                <p>
                  <strong>Storage Used:</strong>{' '}
                  {account.storageUsage.toLocaleString()} bytes
                </p>
              </div>
            )}
          </div>

          <div className="features">
            <h2>✨ Client Features</h2>
            <ul>
              <li>🌳 Tree-shaking optimized bundle size</li>
              <li>📦 Static functions instead of instance methods</li>
              <li>🔄 Identical case conversion behavior</li>
              <li>⚡ Client-based configuration architecture</li>
              <li>🎯 Perfect for React applications</li>
            </ul>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
