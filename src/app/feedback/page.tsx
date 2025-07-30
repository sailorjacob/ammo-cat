"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    type: 'feedback',
    subject: '',
    message: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (you can replace this with actual API call)
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
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
          <h1 className="font-sora" style={{
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            Thank You!
          </h1>
          <p style={{
            color: '#cccccc',
            fontSize: '16px',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Your feedback has been submitted successfully. We appreciate you taking the time to help improve AMMOCAT!
          </p>
          <Link href="/">
            <button className="font-sora" style={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
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
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Back Button */}
      <Link href="/" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#ffffff',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'opacity 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
        ← Back to Home
      </Link>

      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
          <h1 className="font-sora" style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Share Your Feedback
          </h1>
          <p style={{
            color: '#cccccc',
            fontSize: '16px'
          }}>
            Help us improve AMMOCAT with your ideas and suggestions
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Type Selection */}
          <div>
            <label style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'block'
            }}>
              Type of Submission
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none'
              }}
            >
              <option value="feedback" style={{ background: '#2d2d2d', color: '#ffffff' }}>General Feedback</option>
              <option value="feature" style={{ background: '#2d2d2d', color: '#ffffff' }}>Feature Request</option>
              <option value="bug" style={{ background: '#2d2d2d', color: '#ffffff' }}>Bug Report</option>
              <option value="idea" style={{ background: '#2d2d2d', color: '#ffffff' }}>Game Idea</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'block'
            }}>
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of your feedback"
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          {/* Message */}
          <div>
            <label style={{
              color: '#ffffff',
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
              placeholder="Share your detailed feedback, ideas, or suggestions..."
              required
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'block'
            }}>
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="If you'd like a response to your feedback"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-sora"
            style={{
              background: isSubmitting 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
} 