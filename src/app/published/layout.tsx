import React from 'react';
import NewsLetterSidebar from '@/components/ui/newsletterSidebar';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex ">
      <NewsLetterSidebar />
      {children}
    </div>
  );
}

export default layout;
