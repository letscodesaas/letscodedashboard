'use client';
import React, { useEffect, useState } from 'react';
import { emails } from './_handlers/handler';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

function Page() {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      emails(topic)
        .then((d) => {
          setDatas(d.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }, 4000);

    return () => clearInterval(id);
  }, [topic]);

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
          No Emails Found
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
      {/* Search */}
      <div className="flex justify-end">
        <Input
          placeholder="Search by topic..."
          onChange={(e) => setTopic(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {datas?.map((ele, index) => (
            <TableRow
              key={index}
              className="cursor-pointer"
              onClick={() => setSelectedEmail(ele)}
            >
              <TableCell className="font-medium">{ele?.subject}</TableCell>
              <TableCell>{ele?.category}</TableCell>
              <TableCell>{ele?.topic}</TableCell>
              <TableCell>
                {new Date(ele?.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog */}
      <Dialog
        open={!!selectedEmail}
        onOpenChange={() => setSelectedEmail(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
            <DialogDescription>
              {selectedEmail?.category} • {selectedEmail?.topic}
            </DialogDescription>
          </DialogHeader>

          {/* Render HTML safely */}
          <div
            className="prose max-w-none mt-4"
            dangerouslySetInnerHTML={{
              __html: selectedEmail?.html || '',
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
