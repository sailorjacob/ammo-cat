"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with shop mode
    router.push("/?shop=true");
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          color: '#000000',
          fontSize: '24px',
          marginBottom: '16px',
          fontWeight: 'bold'
        }}>
          Loading Shop...
        </h1>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #000000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
