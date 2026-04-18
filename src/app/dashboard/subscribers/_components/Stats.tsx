'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeClosed } from 'lucide-react';

function Stats() {
  const [visible, setVisible] = useState(true);
  const data = {
    delivery_count: 190,
    delivery_rate: 0.95,
    bounce_count: 10,
    bounce_rate: 0.05,
    open_count: 171,
    open_rate: 0.9,
    click_count: 133,
    click_rate: 0.7,
    spam_count: 3,
    spam_rate: 0.02,
  };

  const statsConfig = [
    { title: 'Delivery Count', key: 'delivery_count' },
    { title: 'Delivery Rate', key: 'delivery_rate', isRate: true },
    { title: 'Bounce Count', key: 'bounce_count' },
    { title: 'Bounce Rate', key: 'bounce_rate', isRate: true },
    { title: 'Open Count', key: 'open_count' },
    { title: 'Open Rate', key: 'open_rate', isRate: true },
    { title: 'Click Count', key: 'click_count' },
    { title: 'Click Rate', key: 'click_rate', isRate: true },
    { title: 'Spam Count', key: 'spam_count' },
    { title: 'Spam Rate', key: 'spam_rate', isRate: true },
  ];

  const formatValue = (value, isRate) => {
    if (isRate) return `${(value * 100).toFixed(1)}%`;
    return value;
  };

  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-4xl font-semibold mb-3">Notification Stats</h2>
        {visible ? (
          <Button
            variant="outline"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            <EyeClosed />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            <Eye />
          </Button>
        )}
      </div>
      {visible && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {statsConfig.map((stat) => (
            <Card key={stat.key}>
              <CardHeader>
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-2xl font-semibold">
                  {formatValue(data[stat.key], stat.isRate)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stats;
