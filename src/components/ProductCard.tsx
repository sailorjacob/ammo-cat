import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  imageSrc: string;
  alt: string;
  title: string;
  description: string;
  limit: string;
  price: string;
  stripeLink?: string;
  isAvailable: boolean;
  onClick?: () => void;
  isHero?: boolean;
};

export default function ProductCard({ imageSrc, alt, title, description, limit, price, stripeLink, isAvailable, onClick, isHero = false }: ProductCardProps) {
  return (
    <div 
      style={{
        padding: '24px',
        transition: 'all 0.3s ease',
        opacity: isAvailable ? 1 : 0.7
      }}
      onMouseEnter={(e) => {
        const target = e.target as HTMLElement;
        target.style.transform = 'translateY(-4px)';
        if (!isAvailable) target.style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLElement;
        target.style.transform = 'translateY(0)';
        if (!isAvailable) target.style.opacity = '0.7';
      }}
    >
      <div 
        onClick={onClick}
        style={{
          width: '100%',
          height: '192px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: isAvailable ? 'pointer' : 'default',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (isAvailable) {
            const target = e.target as HTMLElement;
            target.style.transform = 'scale(1.02)';
            target.style.background = 'rgba(0, 0, 0, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (isAvailable) {
            const target = e.target as HTMLElement;
            target.style.transform = 'scale(1)';
            target.style.background = 'transparent';
          }
        }}
      >
        <Image 
          src={imageSrc}
          alt={alt}
          width={isHero ? 120 : 200}
          height={isHero ? 120 : 200}
          priority={isAvailable}
          loading={isAvailable ? undefined : "lazy"}
          style={{ 
            objectFit: isHero ? 'contain' : 'cover',
            borderRadius: '8px',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            pointerEvents: 'none',
            filter: isAvailable ? undefined : 'grayscale(50%)'
          } as React.CSSProperties}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: '#666666', marginBottom: '8px' }}>
        {description}
      </p>
      <p style={{ color: '#666666', fontSize: '14px', fontWeight: '400', marginBottom: '16px' }}>
        {limit}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: isAvailable ? '24px' : '18px', fontWeight: 'bold', color: isAvailable ? '#9CA3AF' : '#666666' }}>{price}</span>
        {isAvailable ? (
          <Link 
            href={stripeLink || ''}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#f5f5f5',
              border: '1px solid #e0e0e0',
              color: '#999999',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              display: 'inline-block',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.background = '#e8e8e8';
              target.style.color = '#666666';
              target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.background = '#f5f5f5';
              target.style.color = '#999999';
              target.style.transform = 'translateY(0)';
            }}
          >
            BUY NOW
          </Link>
        ) : (
          <button 
            disabled
            style={{
              background: '#f5f5f5',
              border: '1px solid #e0e0e0',
              color: '#999999',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'not-allowed',
              transition: 'all 0.3s ease'
            }}
          >
            NOTIFY ME
          </button>
        )}
      </div>
    </div>
  );
} 