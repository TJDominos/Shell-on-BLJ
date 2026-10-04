import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number; // 0.5 to 5.0
  onChange?: (val: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showScoreLabel?: boolean;
  className?: string;
}

export function StarRating({
  value,
  onChange,
  interactive = false,
  size = 'md',
  showScoreLabel = false,
  className = ''
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const starIndices = [1, 2, 3, 4, 5];

  const getStarFillState = (index: number, score: number): 'full' | 'half' | 'empty' => {
    if (score >= index) return 'full';
    if (score >= index - 0.5) return 'half';
    return 'empty';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div 
        className={`flex items-center gap-1 ${interactive ? 'cursor-pointer select-none' : ''}`}
        onMouseLeave={() => interactive && setHoverValue(null)}
      >
        {starIndices.map((starIndex) => {
          const fillState = getStarFillState(starIndex, displayValue);

          return (
            <div
              key={starIndex}
              className="relative group transition-transform active:scale-95"
            >
              {/* If interactive, render invisible hit zones for left half (starIndex - 0.5) and right half (starIndex) */}
              {interactive && (
                <div className="absolute inset-0 z-20 flex">
                  {/* Left half */}
                  <div
                    className="w-1/2 h-full cursor-pointer"
                    onMouseEnter={() => setHoverValue(starIndex - 0.5)}
                    onClick={() => onChange && onChange(starIndex - 0.5)}
                    title={`${starIndex - 0.5} Stars`}
                  />
                  {/* Right half */}
                  <div
                    className="w-1/2 h-full cursor-pointer"
                    onMouseEnter={() => setHoverValue(starIndex)}
                    onClick={() => onChange && onChange(starIndex)}
                    title={`${starIndex} Stars`}
                  />
                </div>
              )}

              {/* Base empty star */}
              <Star
                className={`${sizeClasses[size]} text-neutral-600 transition-colors duration-150`}
                strokeWidth={1.5}
              />

              {/* Full star overlay */}
              {fillState === 'full' && (
                <div className="absolute inset-0 pointer-events-none text-amber-400">
                  <Star
                    className={`${sizeClasses[size]} fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]`}
                    strokeWidth={1.5}
                  />
                </div>
              )}

              {/* Half star overlay (clipped left 50%) */}
              {fillState === 'half' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden w-1/2 text-amber-400">
                  <Star
                    className={`${sizeClasses[size]} fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]`}
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showScoreLabel && (
        <span className="font-bold text-amber-400 font-mono tracking-tight text-sm">
          {displayValue > 0 ? (displayValue.toFixed(1).endsWith('.0') ? displayValue.toFixed(0) : displayValue.toFixed(1)) : '0'}
        </span>
      )}
    </div>
  );
}
