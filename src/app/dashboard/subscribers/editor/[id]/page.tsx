'use client';
import React from 'react';
import EmailEdit from '@/components/ui/emailEditor';
import SendBulkMail from '../../_components/Send';
import { useParams } from 'next/navigation';
function Page() {
  const id = useParams();
  return (
    <div>
      <div>
        <SendBulkMail topic={id.id as string} />
      </div>
      <EmailEdit />
    </div>
  );
}

export default Page;
