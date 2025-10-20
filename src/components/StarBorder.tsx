import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = '#60a5fa',
  speed = '6s',
  thickness = 2,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';

  return (
    <div className="relative inline-block">
      {/* Outer container with rotating gradient border */}
      <div
        className="absolute inset-0 rounded-[20px] p-[2px] animate-star-movement-bottom"
        style={{
          background: `conic-gradient(from 0deg, ${color}, transparent 30%, transparent 70%, ${color})`,
          animationDuration: speed,
        }}
      >
        <div className="w-full h-full rounded-[18px] bg-transparent" />
      </div>
      
      {/* Shimmer effect that moves across the button */}
      <div className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 w-[200%] h-full animate-star-movement-top"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
            animationDuration: speed,
          }}
        />
      </div>

      {/* Button positioned on top */}
      <Component
        className={`relative z-10 rounded-[20px] ${className}`}
        style={{
          margin: `${thickness}px`,
          ...(rest as any).style,
        }}
        {...rest}
      >
        {children}
      </Component>
    </div>
  );
};

export default StarBorder;

