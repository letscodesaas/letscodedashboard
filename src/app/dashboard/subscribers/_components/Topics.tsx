'use client';

import React, { useEffect, useState } from 'react';
import { topics } from '../_handlers/handler';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddUser from '../_components/AddUser';

function Topics() {
  const router = useRouter();

  const [datas, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    topics()
      .then((d) => {
        setData(d.data);
      })
      .catch((e) => {
        console.log(e);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      topics()
        .then((d) => {
          setData(d.data);
        })
        .catch((e) => {
          console.log(e);
          setData([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 3000);

    return () => {
      clearInterval(id);
    };
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-lg text-muted-foreground">Loading topics...</p>
      </div>
    );
  }
  if (datas?.length === 0) {
    return (
      <div className="flex items-center justify-center h-60">
        <h3 className="text-2xl font-semibold text-muted-foreground">
          No Topics Found
        </h3>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {datas?.map((ele, index) => {
        const isActive = ele?.topics?.isActive;

        return (
          <Card
            key={ele?.topics?._id || index}
            className="hover:shadow-lg transition-all duration-200 border border-muted"
          >
            <CardHeader className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge variant={isActive ? 'default' : 'secondary'}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>

                <AddUser topics={ele?.topics?.topic} />
              </div>

              {/* Topic */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Topic
                </p>
                <CardTitle className="text-xl font-semibold mt-1">
                  {ele?.topics?.topic}
                </CardTitle>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Subscribers
                </p>
                <p className="text-xl font-semibold mt-1">{ele?.subscribers}</p>
              </div>

              {/* Created date */}
              <p className="text-xs text-muted-foreground">
                Created: {new Date(ele?.topics?.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>

            {/* Actions */}
            <CardFooter className="flex items-center justify-between gap-2">
              <Button variant="destructive" size="icon" className="shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>

              <Button
                className="w-full"
                onClick={() =>
                  router.push(
                    `/dashboard/subscribers/editor/${ele?.topics?.topic}`
                  )
                }
              >
                Schedule Mail
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default Topics;
