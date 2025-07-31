"use client";

import Link from 'next/link';

export default function FeedbackPage() {
  const posts = [
    {
      id: 1,
      type: '💡 IDEA',
      title: 'Add weapon customization system',
      content: 'Would love to see different weapon skins and upgrades for the guns. Maybe unlockable through gameplay?',
      author: 'Player_42',
      time: '2 hours ago',
      color: '#4ECDC4'
    },
    {
      id: 2,
      type: '🐛 BUG',
      title: 'PVP matchmaking issue',
      content: 'Sometimes get stuck in matchmaking queue for over 5 minutes. Refreshing fixes it but annoying.',
      author: 'GamerX',
      time: '5 hours ago',
      color: '#FF6B6B'
    },
    {
      id: 3,
      type: '⭐ FEEDBACK',
      title: 'Love the new art style!',
      content: 'The recent art updates look amazing. The character designs are really cool and fit the theme perfectly.',
      author: 'ArtLover23',
      time: '1 day ago',
      color: '#95E1A3'
    },
    {
      id: 4,
      type: '🎮 FEATURE',
      title: 'Mobile version request',
      content: 'Any plans for a mobile version? Would be awesome to play on the go.',
      author: 'MobileGamer',
      time: '2 days ago',
      color: '#F7DC6F'
    },
    {
      id: 5,
      type: '💡 IDEA',
      title: 'Team modes for PVP',
      content: 'What about 2v2 or 3v3 team battles? Could add more strategy to the gameplay.',
      author: 'StrategyKing',
      time: '3 days ago',
      color: '#4ECDC4'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
        padding: '16px 20px',
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
          
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#000000',
            margin: 0
          }}>
            Community Feedback Board
          </h1>
          
          <button style={{
            background: '#f5f5f5',
            border: '1px solid #e0e0e0',
            color: '#999999',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'not-allowed'
          }}>
            + Post Feedback
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '100px'
      }}>
        {/* Welcome Section */}
        <div style={{
          background: 'transparent',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '16px'
          }}>
            Welcome to the AMMOCAT Community Board
          </h2>
          <p style={{
            color: '#666666',
            fontSize: '18px',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            This is where our community shares ideas, reports bugs, and helps make AMMOCAT even better. 
            Check out what others are saying and join the conversation!
          </p>
        </div>

        {/* Posts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {posts.map((post) => (
            <div key={post.id} style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <span style={{
                  background: post.color,
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {post.type}
                </span>
                <span style={{
                  color: '#999999',
                  fontSize: '14px'
                }}>
                  {post.time}
                </span>
              </div>
              
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {post.title}
              </h3>
              
              <p style={{
                color: '#666666',
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '16px'
              }}>
                {post.content}
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  color: '#999999',
                  fontSize: '12px'
                }}>
                  by {post.author}
                </span>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#999999',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    👍 12
                  </button>
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#999999',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    💬 3
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '12px'
          }}>
            Want to share your thoughts?
          </h3>
          <p style={{
            color: '#666666',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            Join our community and help shape the future of AMMOCAT
          </p>
          <button style={{
            background: '#f5f5f5',
            border: '1px solid #e0e0e0',
            color: '#999999',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'not-allowed'
          }}>
            Feature Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
} 