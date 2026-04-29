'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type Contest = {
  _id: string;
  topic: string;
  email: string;
  status: string;
};

export const columns: ColumnDef<Contest>[] = [
  {
    accessorKey: '_id',
    header: 'ID',
  },
  {
    accessorKey: 'topic',
    header: 'Message Id',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: ' Status',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Time Stamp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </>
      );
    },
  },
];
