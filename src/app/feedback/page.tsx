"use client";

import { useState } from 'react';
import Link from 'next/link';

const GITHUB_REPO = "https://github.com/sailorjacob/ammo-cat";

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
    const issueTitle = `[${formData.type.toUpperCase()}] ${formData.title}`;
    const issueBody = formData.message;
    const url = `${GITHUB_REPO}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
    window.open(url, '_blank');
    setIsSubmitting(false);
    setIsSubmitted(true);
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
        padding: '20px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '48px 40px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid #e5e5e5',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{
            color: '#000000',
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            Thank You
          </h1>
          <p style={{
            color: '#666666',
            fontSize: '15px',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Your issue should be opening on GitHub. If it didn&apos;t, you can submit it directly on the repository.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{
              background: '#000000',
              borderRadius: '10px',
              color: '#ffffff',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}>
              Back to Home
            </Link>
            <a href={`${GITHUB_REPO}/issues`} target="_blank" rel="noopener noreferrer" style={{
              background: '#ffffff',
              border: '1px solid #d0d0d0',
              borderRadius: '10px',
              color: '#000000',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            color: '#000000',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Home
          </Link>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#000000',
            margin: 0
          }}>
            Feedback & Contribute
          </h1>
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#000000',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 14px',
            border: '1px solid #d0d0d0',
            borderRadius: '8px',
            transition: 'background 0.15s',
            background: '#ffffff'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>

      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Open Source Banner */}
        <div style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px' }}>
              AMMOCAT is Open Source
            </h2>
            <p style={{ fontSize: '14px', color: '#a0a0a0', margin: 0, lineHeight: '1.5', maxWidth: '420px' }}>
              Report bugs, suggest features, or contribute directly. All feedback gets tracked as GitHub issues.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href={`${GITHUB_REPO}/issues`} target="_blank" rel="noopener noreferrer" style={{
              padding: '10px 22px',
              background: '#ffffff',
              color: '#000000',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}>
              View Issues
            </a>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" style={{
              padding: '10px 22px',
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}>
              Star on GitHub
            </a>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '40px'
        }}>
          {/* Left Column - How to Contribute */}
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Ways to Contribute
            </h2>

            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ),
                label: 'BUG',
                title: 'Report Bugs',
                description: 'Found something broken? Open an issue with steps to reproduce and we\'ll fix it.'
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
                label: 'FEATURE',
                title: 'Request Features',
                description: 'Have an idea for the game? Suggest new mechanics, modes, or improvements.'
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                ),
                label: 'CODE',
                title: 'Submit Pull Requests',
                description: 'Fork the repo, make changes, and open a PR. All contributions are welcome.'
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                label: 'FEEDBACK',
                title: 'Share Feedback',
                description: 'General thoughts on gameplay, art, UX, or anything else — we want to hear it.'
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '12px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#000000', margin: 0 }}>
                      {item.title}
                    </h3>
                    <span style={{
                      background: '#f0f0f0',
                      color: '#555',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      {item.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Quick Submit */}
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Quick Submit
            </h2>

            <form onSubmit={handleSubmit} style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#888',
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                This opens a pre-filled GitHub issue. You&apos;ll need a GitHub account to submit.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  color: '#000000',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#fafafa',
                    color: '#000'
                  }}
                >
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">General Feedback</option>
                  <option value="idea">Game Idea</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  color: '#000000',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  display: 'block'
                }}>
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
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#fafafa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  color: '#000000',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe the issue or suggestion in detail"
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    minHeight: '100px',
                    background: '#fafafa',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? '#999' : '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  width: '100%',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                {isSubmitting ? 'Opening GitHub...' : 'Open Issue on GitHub'}
              </button>
            </form>

            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '16px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '13px', color: '#888', margin: '0 0 12px', lineHeight: '1.5' }}>
                Want to contribute code directly?
              </p>
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#000',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                padding: '8px 20px',
                border: '1px solid #d0d0d0',
                borderRadius: '8px'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                Fork on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
