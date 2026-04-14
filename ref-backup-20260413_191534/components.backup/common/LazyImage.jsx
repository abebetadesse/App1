import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, className, placeholderSrc = '/placeholder.svg' }) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      });
    });
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return <img loading="lazy" ref={imgRef} src={imageSrc} alt={alt} className={className} loading="lazy" />;
}
