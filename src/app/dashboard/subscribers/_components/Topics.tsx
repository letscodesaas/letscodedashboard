'use client';

import React from 'react';
import { topics } from '../_handlers/handler';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Topics() {
  const router = useRouter();

  const [datas, setData] = useState([]);
  useEffect(() => {
    topics()
      .then((d) => {
        console.log(d);
        setData(d.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <div className="grid grid-cols-3 items-center justify-center gap-3">
      {datas?.map((ele, index) => {
        return (
          <Card key={index + '-' + index + 1}>
            <CardHeader>
              <sup>
                Status:{' '}
                <Badge variant="outline">
                  {ele?.isActive === true ? 'Active' : 'InActive'}
                </Badge>
              </sup>
              <CardTitle>
                <span className="text-sm text-slate-500 font-extralight">
                  Topic
                </span>{' '}
                <br />
                <h3 className="text-2xl font-semibold">{ele?.topic}</h3>
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex flex-row items-center justify-start  gap-3">
              <Button variant="destructive">
                <Trash2 />
              </Button>
              <Button
                onClick={() =>
                  router.push(`/dashboard/subscribers/editor/${ele?.topic}`)
                }
              >
                Schedule mails
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default Topics;

// createdAt
// :
// "2026-04-15T11:49:00.185Z"
// isActive
// :
// true
// topic
// :
// "contest"
// updatedAt
// :
// "2026-04-15T11:49:00.185Z"
// __v
// :
// 0
// _id
// :
// "69df7b2c6a5eb0cad738aebd"
