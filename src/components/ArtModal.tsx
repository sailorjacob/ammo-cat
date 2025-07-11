import Image from "next/image";

type ArtModalProps = {
  imageSrc: string;
  alt: string;
  title: string;
  specs: string[];
  about: string;
  price: string;
  stripeLink: string;
  onClose: () => void;
};

export default function ArtModal({ imageSrc, alt, title, specs, about, price, stripeLink, onClose }: ArtModalProps) {
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
            top: isMobile ? '15px' : '20px',
            right: isMobile ? '15px' : '20px',
            background: 'transparent',
            border: 'none',
            fontSize: isMobile ? '24px' : '28px',
            cursor: 'pointer',
            color: '#999999',
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = '#f5f5f5';
            target.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'transparent';
            target.style.color = '#999999';
          }}
        >
          ×
        </button>

        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '20px' : '40px', 
          alignItems: 'flex-start' 
        }}>
          <div style={{ 
            flex: isMobile ? '1' : '0 0 400px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <Image 
              src={imageSrc}
              alt={alt}
              width={400}
              height={400}
              loading="lazy"
              style={{ 
                objectFit: 'cover',
                borderRadius: '12px',
                width: '100%',
                height: 'auto',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserDrag: 'none',
                KhtmlUserSelect: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                pointerEvents: 'none'
              } as React.CSSProperties}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
              onTouchEnd={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: isMobile ? '24px' : '32px', 
              fontWeight: '900', 
              color: '#000000', 
              marginBottom: isMobile ? '16px' : '20px', 
              letterSpacing: '1px' 
            }}>
              {title}
            </h2>
            
            <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
              <h3 style={{ 
                fontSize: isMobile ? '18px' : '20px', 
                fontWeight: '700', 
                color: '#000000', 
                marginBottom: '16px' 
              }}>
                Specifications
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '12px', 
                color: '#666666', 
                lineHeight: '1.8',
                fontSize: isMobile ? '14px' : '16px'
              }}>
                {specs.map((spec, index) => (
                  <div key={index}>{spec}</div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
              <h3 style={{ 
                fontSize: isMobile ? '18px' : '20px', 
                fontWeight: '700', 
                color: '#000000', 
                marginBottom: '16px' 
              }}>
                About This Print
              </h3>
              <p style={{ 
                color: '#666666', 
                lineHeight: '1.7', 
                fontSize: isMobile ? '14px' : '16px' 
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 