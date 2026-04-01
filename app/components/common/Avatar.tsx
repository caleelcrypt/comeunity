import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 48, onClick }) => {
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="post-avatar"
        style={{ width: size, height: size, objectFit: 'cover' }}
        onClick={onClick}
      />
    );
  }

  return (
    <div
      className="post-avatar"
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {getInitials(alt)}
    </div>
  );
};