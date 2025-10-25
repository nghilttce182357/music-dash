'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { TEKNIX_USER_ACCESS_TOKEN } from '@/utils/constants';

export default function TestApiPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/v1/music', {
          headers: {
            Authorization: `Bearer ${TEKNIX_USER_ACCESS_TOKEN}`,
          },
        });
        setData(response.data);
        console.log("Test TeknixAPI response:", response.data);
      } catch (err: any) {
        setError(err.message || 'API call failed');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Test TeknixAPI Call</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <pre style={{ background: '#f4f4f4', padding: 16, borderRadius: 8 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}