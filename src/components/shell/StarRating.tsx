import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number; // 0.5 to 5.0
  onChange?: (val: number) => void;
  onHoverChange?: (val: number | null) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showScoreLabel?: boolean;
  className?: string;
}

export function StarRating({
  value,
  onChange,
  onHoverChange,
  interactive = false,
  size = 'md',
  showScoreLabel = false,
  className = ''
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleHover = (val: number | null) => {
    setHoverValue(val);
    onHoverChange?.(val);
  };

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
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div 
        className={`flex items-center gap-1 shrink-0 ${interactive ? 'cursor-pointer' : ''}`}
        onMouseLeave={() => interactive && handleHover(null)}
      >
        {starIndices.map((starIndex) => {
          const fillState = getStarFillState(starIndex, displayValue);

          return (
            <div
              key={starIndex}
              className="relative shrink-0"
            >
              {/* If interactive, render invisible hit zones for left half (starIndex - 0.5) and right half (starIndex) */}
              {interactive && (
                <div className="absolute inset-0 z-20 flex">
                  {/* Left half */}
                  <div
                    className="w-1/2 h-full cursor-pointer"
                    onMouseEnter={() => handleHover(starIndex - 0.5)}
                    onClick={() => {
                      onChange && onChange(starIndex - 0.5);
                      handleHover(null);
                    }}
                    title={`${starIndex - 0.5} Stars`}
                  />
                  {/* Right half */}
                  <div
                    className="w-1/2 h-full cursor-pointer"
                    onMouseEnter={() => handleHover(starIndex)}
                    onClick={() => {
                      onChange && onChange(starIndex);
                      handleHover(null);
                    }}
                    title={`${starIndex} Stars`}
                  />
                </div>
              )}

              {/* Base empty star */}
              <Star
                className={`${sizeClasses[size]} text-neutral-600 transition-colors duration-150 shrink-0`}
                strokeWidth={1.5}
              />

              {/* Full star overlay */}
              {fillState === 'full' && (
                <div className="absolute inset-0 pointer-events-none text-amber-400">
                  <Star
                    className={`${sizeClasses[size]} fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)] shrink-0`}
                    strokeWidth={1.5}
                  />
                </div>
              )}

              {/* Half star overlay (clipped left 50%) */}
              {fillState === 'half' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden w-1/2 text-amber-400">
                  <Star
                    className={`${sizeClasses[size]} fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)] shrink-0`}
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showScoreLabel && (
        <span className="font-bold text-amber-400 font-mono tracking-tight text-sm w-7 min-w-[1.75rem] text-center inline-block tabular-nums shrink-0">
          {displayValue > 0 ? (displayValue.toFixed(1).endsWith('.0') ? displayValue.toFixed(0) : displayValue.toFixed(1)) : '0'}
        </span>
      )}
    </div>
  );
}
