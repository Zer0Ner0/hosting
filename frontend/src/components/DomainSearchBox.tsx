import { useState } from 'react';

export default function DomainSearchBox() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch('/api/domain-check/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain })
      });
      const data = await res.json();
      setResult(data.available ? '✅ Domain is available!' : '❌ Domain is taken.');
    } catch {
      setResult('⚠️ Error checking domain.');
    } finally { setLoading(false); }
  };

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Search for Your Perfect Domain</h2>
        <form onSubmit={checkDomain} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
          <input type="text" value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com"
            className="px-4 py-3 w-full md:w-96 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400" />
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition" disabled={loading}>
            {loading ? 'Checking...' : 'Check'}
          </button>
        </form>
        {result && <p className="text-lg mt-2">{result}</p>}
      </div>
    </section>
  );
}