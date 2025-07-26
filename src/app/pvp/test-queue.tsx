'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function TestQueue() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const testJoinQueue = async () => {
    setStatus('Joining queue...');
    try {
      const response = await fetch('/api/pvp/queue', { method: 'POST' });
      const data = await response.json();
      setStatus(`Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  const testCheckQueue = async () => {
    setStatus('Checking queue...');
    try {
      const response = await fetch('/api/pvp/queue');
      const data = await response.json();
      setStatus(`Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  const testDebugQueue = async () => {
    setStatus('Getting debug info...');
    try {
      const response = await fetch('/api/pvp/queue', { method: 'OPTIONS' });
      const data = await response.json();
      setDebugInfo(data);
      setStatus('Debug info loaded');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  const testLeaveQueue = async () => {
    setStatus('Leaving queue...');
    try {
      const response = await fetch('/api/pvp/queue', { method: 'DELETE' });
      const data = await response.json();
      setStatus(`Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-8">Queue System Test</h1>
      
      <div className="mb-4">
        <strong>User ID:</strong> {user.id}
      </div>
      <div className="mb-4">
        <strong>Is Anonymous:</strong> {user.is_anonymous ? 'Yes' : 'No'}
      </div>
      
      <div className="space-x-4 mb-8">
        <button 
          onClick={testJoinQueue}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Join Queue
        </button>
        <button 
          onClick={testCheckQueue}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Check Queue
        </button>
        <button 
          onClick={testLeaveQueue}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Leave Queue
        </button>
        <button 
          onClick={testDebugQueue}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Debug Queue
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-4">Status:</h2>
        <pre className="bg-gray-100 p-4 rounded text-black">{status}</pre>
      </div>

      {debugInfo && (
        <div>
          <h2 className="text-xl mb-4">Debug Info:</h2>
          <pre className="bg-gray-100 p-4 rounded text-black">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 