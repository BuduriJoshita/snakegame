import React from 'react';

interface NeonPanelProps {
  children: React.ReactNode;
  color?: 'cyan' | 'magenta';
  className?: string;
  title?: string;
}

export const NeonPanel: React.FC<NeonPanelProps> = ({ 
  children, 
  color = 'cyan', 
  className = '',
  title
}) => {
  const borderColor = color === 'cyan' ? 'border-sys-cyan' : 'border-sys-magenta';
  const textColor = color === 'cyan' ? 'text-sys-cyan' : 'text-sys-magenta';

  return (
    <div className={`
      relative bg-sys-black border-2 ${borderColor} 
      p-1 shadow-[4px_4px_0px_0px_rgba(255,0,255,0.3)]
      hover:shadow-[6px_6px_0px_0px_rgba(0,255,255,0.3)]
      transition-shadow duration-100
      ${className}
    `}>
      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-2 h-2 bg-${color === 'cyan' ? 'sys-cyan' : 'sys-magenta'}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 bg-${color === 'cyan' ? 'sys-cyan' : 'sys-magenta'}`} />
      
      {title && (
        <div className={`absolute -top-3 left-4 bg-sys-black px-2 text-sm ${textColor} font-bold tracking-widest`}>
          [{title}]
        </div>
      )}
      
      <div className="h-full w-full bg-sys-gray/50 p-4 border border-sys-gray">
        {children}
      </div>
    </div>
  );
};
