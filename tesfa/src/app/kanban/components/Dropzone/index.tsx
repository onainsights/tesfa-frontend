import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropZoneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DropZone({ id, children, className = '', style }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const baseClasses = 'rounded-md transition-all duration-200 ease-in-out';

  return (
    <div
      ref={setNodeRef}
      className={`${baseClasses} ${isOver ? 'bg-primary-light' : 'bg-transparent'} ${className}`}
    >
      {children}
    </div>
  );

}
