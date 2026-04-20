'use client';

import React, { useEffect, useState } from 'react';
import { notificatonEvent } from '../_handlers/handler';
import {
  Card,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function NotificationEvent() {
  const [datas, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificatonEvent()
      .then((d) => {
        setData(d.data || []);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-lg">
        Loading events...
      </div>
    );
  }

  // ❌ Empty State (fixed return bug)
  if (datas.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <h3 className="text-2xl font-semibold text-gray-500">
          No Notification Events
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {datas.map((ele, index) => {
        const isActive = ele?.eventProcessed;
        const isScheduled = ele?.scheduled;

        return (
          <Card
            key={index}
            className="shadow-md hover:shadow-xl transition duration-300 rounded-2xl"
          >
            <CardHeader className="space-y-3">
              {/* Status Row */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Status</span>
                <Badge
                  className={`${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Topic */}
              <div>
                <p className="text-xs text-gray-400">Topic</p>
                <h3 className="text-xl font-semibold text-gray-800 truncate">
                  {ele?.topic}
                </h3>
              </div>

              {/* Scheduled */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Scheduled Status
                </span>
                <Badge
                  variant="outline"
                  className={`${
                    isScheduled
                      ? 'border-blue-500 text-blue-600'
                      : 'border-gray-400 text-gray-500'
                  }`}
                >
                  {isScheduled ? 'Scheduled' : 'Not Scheduled'}
                </Badge>
              </div>
            </CardHeader>

            <CardFooter className="text-xs text-gray-400">
              Event #{index + 1}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default NotificationEvent;