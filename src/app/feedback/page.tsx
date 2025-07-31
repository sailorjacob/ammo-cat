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
    {
      id: 1,
      type: 'IDEA',
      title: 'Add weapon customization system',
      content: 'Would love to see different weapon skins and upgrades for the guns. Maybe unlockable through gameplay?',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'BUG',
      title: 'PVP matchmaking issue',
      content: 'Sometimes get stuck in matchmaking queue for over 5 minutes. Refreshing fixes it but annoying.',
      time: '5 hours ago'
    },
    {
      id: 3,
      type: 'FEEDBACK',
      title: 'Love the new art style',
      content: 'The recent art updates look amazing. The character designs are really cool and fit the theme perfectly.',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'FEATURE',
      title: 'Mobile version request',
      content: 'Any plans for a mobile version? Would be awesome to play on the go.',
      time: '2 days ago'
    },
    {
      id: 5,
      type: 'IDEA',
      title: 'Team modes for PVP',
      content: 'What about 2v2 or 3v3 team battles? Could add more strategy to the gameplay.',
      time: '3 days ago'
    }
  ];

  if (isSubmitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            color: '#000000',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            Thank You
          </h1>
          <p style={{
            color: '#666666',
            fontSize: '16px',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Your feedback has been submitted successfully. We appreciate you taking the time to help improve AMMOCAT.
          </p>
          <Link href="/">
            <button style={{
              background: '#000000',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}>
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
      <Link href="/" style={{
            color: '#000000',
        textDecoration: 'none',
        fontSize: '16px',
            fontWeight: '500'
          }}>
        ← Back to Home
      </Link>

          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000000',
            margin: 0
          }}>
            Feedback
          </h1>
          
          <div style={{ width: '100px' }}></div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '40px'
      }}>
        {/* Left Column - Existing Feedback */}
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '20px'
          }}>
            Recent Feedback
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map((post) => (
            <div key={post.id} style={{
              background: '#ffffff',
              border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                  marginBottom: '12px'
              }}>
                <span style={{
                    background: '#000000',
                  color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                  {post.type}
                </span>
                <span style={{
                  color: '#999999',
                    fontSize: '13px'
                }}>
                  {post.time}
                </span>
              </div>
              
              <h3 style={{
                  fontSize: '16px',
                fontWeight: 'bold',
                color: '#000000',
                  marginBottom: '8px'
              }}>
                {post.title}
              </h3>
              
              <p style={{
                color: '#666666',
                fontSize: '14px',
                lineHeight: '1.5',
                  marginBottom: '12px'
              }}>
                {post.content}
              </p>
              

              </div>
            ))}
            </div>
        </div>

        {/* Right Column - Submit Form */}
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '20px'
          }}>
            Submit Feedback
          </h2>
          
          <form onSubmit={handleSubmit} style={{
            background: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                color: '#000000',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
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
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: '#ffffff'
                }}
              >
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="feedback">General Feedback</option>
                <option value="idea">Game Idea</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                color: '#000000',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
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
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                color: '#000000',
            fontSize: '14px',
            fontWeight: '600',
                marginBottom: '8px',
                display: 'block'
              }}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Detailed feedback, ideas, or suggestions"
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? '#cccccc' : '#000000',
                border: 'none',
                borderRadius: '4px',
                color: '#ffffff',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          </form>
        </div>
      </div>
    </div>
  );
} 