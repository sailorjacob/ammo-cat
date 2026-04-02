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
          background: '#ffffff',
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
            fontSize: '14px',
            transition: 'background 0.15s'
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
          maxWidth: '720px',
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

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Open source note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '28px',
          padding: '14px 18px',
          background: '#fff',
          border: '1px solid #eaeaea',
          borderRadius: '10px'
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
            AMMOCAT is open source. You can also contribute or report issues on{' '}
            <a
              href="https://github.com/sailorjacob/ammo-cat"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#111', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >GitHub</a>.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left: Form */}
          <div style={{
            background: '#fff',
            border: '1px solid #eaeaea',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111', margin: '0 0 18px' }}>
              Send feedback
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
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

              <div style={{ marginBottom: '14px' }}>
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

              <div style={{ marginBottom: '18px' }}>
                <label style={{ color: '#444', fontSize: '12px', fontWeight: 500, marginBottom: '5px', display: 'block' }}>
                  Details
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
                  width: '100%',
                  transition: 'all 0.15s'
                }}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#111', margin: '0 0 14px' }}>
                How to contribute
              </h3>
              {[
                { title: 'Report bugs', text: 'Found a glitch? Submit it here or open a GitHub issue.' },
                { title: 'Request features', text: 'Have an idea for the game? Let us know.' },
                { title: 'Pull requests', text: 'The codebase is public — PRs are welcome.' },
                { title: 'General feedback', text: 'Share thoughts on gameplay, design, or anything.' }
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '10px 0',
                  borderTop: i > 0 ? '1px solid #f3f3f3' : 'none'
                }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#222', marginBottom: '2px' }}>
                    {item.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888', lineHeight: 1.4 }}>
                    {item.text}
                  </p>
                </div>
              ))}
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
        @media (max-width: 680px) {
          div[style*="grid-template-columns: 1fr 320px"] {
            display: flex !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
