import React, { memo } from 'react';

export interface TodoMVCProps {
  className?: string;
}

export const TodoMVC = memo<TodoMVCProps>(({ className }) => {
  return <div className={className}>Hello World!</div>;
});
