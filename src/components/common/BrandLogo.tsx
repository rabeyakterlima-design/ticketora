import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showTagline = false,
  variant = 'dark',
  size = 'md',
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2 group transition-opacity hover:opacity-95 ${className}`}>
      <img
        src={logoImg}
        alt="Ticketora Logo"
        className={`${heightClasses[size]} w-auto object-contain drop-shadow-sm`}
      />
      {showTagline && (
        <span
          className={`text-[10px] tracking-wide font-medium hidden sm:inline-block border-l pl-2 ${
            variant === 'light' ? 'text-teal-200 border-teal-700/50' : 'text-slate-500 border-slate-300'
          }`}
        >
          Your Journey, Our Priority.
        </span>
      )}
    </Link>
  );
};
