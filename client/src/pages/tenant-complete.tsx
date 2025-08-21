import React, { useState, useEffect } from 'react';

interface TenantContext {
  id: string;
  name: string;
  subdomain: string;
  colorScheme: string;
  subscriptionTier: 'basic' | 'professional' | 'enterprise';
  settings?: any;
}

interface TenantStats {
  totalUpdates: number;
  totalLegalCases: number;
  activeDataSources: number;
  monthlyUsage: number;
  usageLimit: number;
  usagePercentage: number;
}

interface RegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  impact: string;
  category: string;
}

export default function TenantComplete() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [context, setContext] = useState<TenantContext | null>(null);
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form
  const [email, setEmail] = useState('admin@demo-medical.local');
  const [password, setPassword] = useState('demo123');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tenant/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(true);
        loadTenantData();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const loadTenantData = async () => {
    try {
      // Load context
      const contextRes = await fetch('/api/tenant/context');
      const contextData = await contextRes.json();
      setContext(contextData);

      // Load stats
      const statsRes = await fetch('/api/tenant/dashboard/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Load updates
      const updatesRes = await fetch('/api/tenant/regulatory-updates');
      const updatesData = await updatesRes.json();
      setUpdates(updatesData.slice(0, 10));

    } catch (err) {
      console.error('Error loading tenant data:', err);
    }
  };

  const getColorScheme = () => {
    if (!context) return 'from-blue-500 to-cyan-600';
    
    switch (context.colorScheme) {
      case 'purple': return 'from-purple-500 to-indigo-600';
      case 'green': return 'from-green-500 to-emerald-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  const getSubscriptionIcon = () => {
    if (!context) return '🔒';
    
    switch (context.subscriptionTier) {
      case 'basic': return '🛡️';
      case 'professional': return '⭐';
      case 'enterprise': return '👑';
      default: return '🔒';
    }
  };

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)'
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">🔬 Helix</h1>
            <p className="text-gray-600 mt-2">Regulatory Intelligence Platform</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@demo-medical.local"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="demo123"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-blue-800 text-sm font-medium">Demo Credentials:</p>
              <p className="text-blue-600 text-sm">Email: admin@demo-medical.local</p>
              <p className="text-blue-600 text-sm">Password: demo123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)`
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🔬 Helix Regulatory Intelligence</h1>
              <p className="text-blue-100 mt-2">
                {context?.name || 'Demo Medical Corp'} - {context?.subscriptionTier ? (context.subscriptionTier.charAt(0).toUpperCase() + context.subscriptionTier.slice(1)) : 'Professional'} Plan {getSubscriptionIcon()}
              </p>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-600 text-sm">Regulatory Updates</h3>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalUpdates || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">⚖️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-600 text-sm">Legal Cases</h3>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalLegalCases || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">🔗</span>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-600 text-sm">Data Sources</h3>
                <p className="text-2xl font-bold text-gray-800">{stats?.activeDataSources || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-600 text-sm">Monthly Usage</h3>
                <p className="text-lg font-bold text-gray-800">
                  {stats?.monthlyUsage || 0}/{stats?.usageLimit || 200}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${stats?.usagePercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📈 Recent Regulatory Updates</h2>
          
          {updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{update.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {update.summary || 'No summary available'}
                      </p>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>Source: {update.source}</span>
                        <span>Category: {update.category}</span>
                        <span>
                          {new Date(update.publishedAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          update.impact === 'high' ? 'bg-red-100 text-red-800' :
                          update.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {update.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No updates available</p>
          )}
        </div>
      </main>
    </div>
  );
}