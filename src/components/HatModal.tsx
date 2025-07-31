import Image from "next/image";

type HatModalProps = {
  imageSrc: string;
  alt: string;
  title: string;
  specs: string[];
  about: string;
  price: string;
  stripeLink?: string;
  onClose: () => void;
};

export default function HatModal({ imageSrc, alt, title, specs, about, price, stripeLink, onClose }: HatModalProps) {
  const isMobile = window.innerWidth <= 768;
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '10px' : '20px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: isMobile ? '12px' : '16px',
          padding: isMobile ? '20px' : '40px',
          maxWidth: isMobile ? '95vw' : '900px',
          width: isMobile ? '95vw' : '90vw',
          maxHeight: isMobile ? '95vh' : '70vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobile ? '12px' : '16px',
            right: isMobile ? '12px' : '16px',
            background: 'none',
            border: 'none',
            fontSize: isMobile ? '18px' : '24px',
            cursor: 'pointer',
            color: '#999999',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color 0.2s ease',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = '#333333';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = '#999999';
          }}
        >
          ✕
        </button>

        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '20px' : '40px',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start'
        }}>
          <div style={{ 
            flex: isMobile ? 'none' : '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'transparent',
            borderRadius: '12px',
            padding: isMobile ? '16px' : '24px',
            minHeight: isMobile ? '250px' : '350px'
          }}>
            <Image 
              src={imageSrc}
              alt={alt}
              width={isMobile ? 200 : 300}
              height={isMobile ? 200 : 300}
              style={{ 
                objectFit: 'contain',
                borderRadius: '8px',
                maxWidth: '100%',
                height: 'auto'
              }}
              priority
            />
          </div>

          <div style={{ 
            flex: isMobile ? 'none' : '1.2',
            paddingLeft: isMobile ? '0' : '20px',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <h2 style={{ 
              fontSize: isMobile ? '24px' : '32px', 
              fontWeight: '900', 
              color: '#1a1a1a', 
              marginBottom: isMobile ? '8px' : '12px',
              letterSpacing: '-0.5px'
            }}>
              {title}
            </h2>

            <div style={{ marginBottom: isMobile ? '20px' : '28px' }}>
              <h3 style={{ 
                fontSize: isMobile ? '14px' : '16px', 
                fontWeight: '700', 
                color: '#666666', 
                marginBottom: isMobile ? '8px' : '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                SPECIFICATIONS
              </h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                color: '#555555',
                lineHeight: isMobile ? '1.4' : '1.6'
              }}>
                {specs.map((spec, index) => (
                  <li key={index} style={{ 
                    marginBottom: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '13px' : '15px'
                  }}>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: isMobile ? '20px' : '28px' }}>
              <h3 style={{ 
                fontSize: isMobile ? '14px' : '16px', 
                fontWeight: '700', 
                color: '#666666', 
                marginBottom: isMobile ? '8px' : '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                ABOUT
              </h3>
              <p style={{ 
                color: '#555555', 
                lineHeight: isMobile ? '1.4' : '1.6',
                fontSize: isMobile ? '13px' : '15px',
                margin: 0
              }}>
                {about}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: isMobile ? '20px' : '28px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '16px' : '0'
              }}>
                <span style={{ 
                  fontSize: isMobile ? '28px' : '36px', 
                  fontWeight: '900', 
                  color: '#9CA3AF', 
                  letterSpacing: '-1px' 
                }}>{price}</span>
                {stripeLink ? (
                  <a 
                    href={stripeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#000000',
                      border: 'none',
                      color: '#ffffff',
                      padding: isMobile ? '16px 32px' : '18px 36px',
                      borderRadius: '8px',
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      display: 'inline-block',
                      letterSpacing: '0.5px',
                      width: isMobile ? '100%' : 'auto',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.background = '#333333';
                      target.style.transform = 'translateY(-2px)';
                      target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.background = '#000000';
                      target.style.transform = 'translateY(0)';
                      target.style.boxShadow = 'none';
                    }}
                  >
                    BUY NOW
                  </a>
                ) : (
                  <button 
                    style={{
                      background: '#f5f5f5',
                      border: '1px solid #e0e0e0',
                      color: '#999999',
                      padding: isMobile ? '16px 32px' : '18px 36px',
                      borderRadius: '8px',
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: '700',
                      cursor: 'not-allowed',
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    COMING SOON
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}