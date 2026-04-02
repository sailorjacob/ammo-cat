"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    type: 'bug',
    title: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const posts = [
    { id: 1, type: 'IDEA', title: 'Add weapon customization system', content: 'Would love to see different weapon skins and upgrades for the guns. Maybe unlockable through gameplay?', time: '2 hours ago' },
    { id: 2, type: 'BUG', title: 'PVP matchmaking issue', content: 'Sometimes get stuck in matchmaking queue for over 5 minutes. Refreshing fixes it but annoying.', time: '5 hours ago' },
    { id: 3, type: 'FEEDBACK', title: 'Love the new art style', content: 'The recent art updates look amazing. The character designs are really cool and fit the theme perfectly.', time: '1 day ago' },
    { id: 4, type: 'FEATURE', title: 'Mobile version request', content: 'Any plans for a mobile version? Would be awesome to play on the go.', time: '2 days ago' },
    { id: 5, type: 'IDEA', title: 'Team modes for PVP', content: 'What about 2v2 or 3v3 team battles? Could add more strategy to the gameplay.', time: '3 days ago' }
  ];

  if (isSubmitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '48px 40px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid #eaeaea'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#16a34a',
            fontSize: '22px'
          }}>&#10003;</div>
          <h1 style={{ color: '#111', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Feedback received
          </h1>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
            Thanks for helping improve AMMOCAT.
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: '#fafafa',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontWeight: 500,
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #eaeaea',
        padding: '14px 20px'
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            color: '#555',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Home
          </Link>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#111', letterSpacing: '0.5px' }}>
            Feedback
          </span>
          <div style={{ width: '50px' }} />
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 20px 60px' }}>
        {/* Open source note */}
        <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#888' }}>
          AMMOCAT is open source. You can also report issues or contribute on{' '}
          <a
            href="https://github.com/sailorjacob/ammo-cat"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#333', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >GitHub</a>.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '28px',
          alignItems: 'start'
        }}>
          {/* Left: Recent Feedback */}
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '0 0 14px' }}>
              Recent Feedback
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {posts.map((post) => (
                <div key={post.id} style={{
                  background: '#fff',
                  border: '1px solid #eaeaea',
                  borderRadius: '10px',
                  padding: '16px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      background: '#f3f3f3',
                      color: '#555',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}>
                      {post.type}
                    </span>
                    <span style={{ color: '#bbb', fontSize: '12px' }}>
                      {post.time}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#222', margin: '0 0 4px' }}>
                    {post.title}
                  </h3>
                  <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Submit Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              padding: '22px'
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '0 0 16px' }}>
                Submit Feedback
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#444', fontSize: '12px', fontWeight: 500, marginBottom: '5px', display: 'block' }}>
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '13px',
                      background: '#fff',
                      color: '#333',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="feedback">General Feedback</option>
                    <option value="idea">Game Idea</option>
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#444', fontSize: '12px', fontWeight: 500, marginBottom: '5px', display: 'block' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief description"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#333'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#444', fontSize: '12px', fontWeight: 500, marginBottom: '5px', display: 'block' }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe the issue, idea, or suggestion"
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '13px',
                      resize: 'vertical',
                      minHeight: '100px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#333',
                      lineHeight: 1.5
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting ? '#eee' : '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    color: isSubmitting ? '#999' : '#333',
                    padding: '10px 0',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>

            <a
              href="https://github.com/sailorjacob/ammo-cat/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '11px',
                background: '#fff',
                border: '1px solid #eaeaea',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#444',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              Open an issue on GitHub
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          div[style*="grid-template-columns: 1fr 340px"] {
            display: flex !important;
            flex-direction: column-reverse !important;
          }
        }
      `}</style>
    </div>
  );
}
