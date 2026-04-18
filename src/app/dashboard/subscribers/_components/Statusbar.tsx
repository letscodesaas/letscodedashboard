'use client';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { system_health_check } from '../_handlers/handler';
import { Bell } from 'lucide-react';

function Statusbar() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInterval(() => {
      system_health_check()
        .then((data) => {
          setStatus(data.message);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setStatus('failed');
        });
    }, 3000);
  }, [status]);

  if (loading) {
    return <Badge variant="outline">Loading</Badge>;
  }
  return (
    <div>
      <Badge variant={`${status != 'failed' ? 'secondary' : 'destructive'}`}>
        {status === 'failed' ? (
          <Bell
            width={15}
            height={25}
            className="mr-1 animate-none text-white"
          />
        ) : (
          <Bell
            width={15}
            height={25}
            className="mr-1 animate-pulse text-green-600"
          />
        )}
        {status === 'failed' ? 'Out of service' : 'Healthy'}
      </Badge>
    </div>
  );
}

export default Statusbar;
