import React from 'react';
import Sidebar from '@/components/ui/sidebar';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      {children}
    </div>
  );
}

export default layout;
