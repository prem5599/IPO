'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({ 
  src, 
  alt, 
  fallbackSrc, 
  ...props 
}) {
  const [error, setError] = useState(false);

  // Handle image load error
  const handleError = () => {
    setError(true);
  };

  // If error occurs or no src, use fallback
  if (error || !src) {
    return (
      <div 
        className={`bg-light flex items-center justify-center ${props.className || ''}`}
        style={props.style}
      >
        {fallbackSrc ? (
          <Image 
            src={fallbackSrc} 
            alt={alt || 'Fallback image'} 
            {...props} 
          />
        ) : (
          <span className="text-muted text-center">{alt}</span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
}

// PropTypes for type checking (optional in Next.js)
ImageWithFallback.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
};