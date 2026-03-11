import React, { useRef, useState, useEffect, useCallback } from 'react';

const CarouselRow: React.FC<{ className?: string; children: React.ReactNode; cardCount: number }> = ({ className = '', children, cardCount }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);

    if (cardCount > 1) {
      const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth || 1);
      setActiveIndex(Math.round(scrollRatio * (cardCount - 1)));
    }
  }, [cardCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);
    return () => {
      el.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
    };
  }, [updateFades]);

  const scrollToDot = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / cardCount;
    el.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  return (
    <div className={`carousel-fade-wrapper${showLeft ? ' show-fade-left' : ''}${showRight ? ' show-fade-right' : ''}`}>
      <div ref={scrollRef} className={`row dashboard-carousel ${className}`}>
        {children}
      </div>
      {cardCount > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: cardCount }, (_, i) => (
            <button
              key={i}
              className={`dot${i === activeIndex ? ' active' : ''}`}
              onClick={() => scrollToDot(i)}
              aria-label={`Scroll to card ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselRow;
