import React from 'react';
import Sidebar from '@/components/ui/sidebar';
import Authcontext from '@/context/Authcontext';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <Authcontext>
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </Authcontext>
  );
}

export default layout;
