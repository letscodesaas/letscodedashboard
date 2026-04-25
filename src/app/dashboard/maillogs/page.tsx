'use client';
import React, { useEffect, useState } from 'react';
import { logs } from './_handlers/handler';
import { Spinner } from '@/components/ui/spinner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';

function Page() {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      logs()
        .then((d) => {
          console.log(d);
          setDatas(d.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }, 4000);

    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (datas?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60">
        <h3 className="text-2xl font-semibold text-muted-foreground">
          No logs Found
        </h3>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {' '}
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic Stamps</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {datas?.map((ele, index) => (
            <TableRow key={index} className="cursor-pointer">
              <TableCell className="font-medium">{ele?.topic}</TableCell>
              <TableCell>{ele?.email}</TableCell>
              <TableCell>{ele?.status}</TableCell>
              <TableCell>
                {new Date(ele?.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Page;
