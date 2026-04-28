'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Contest = {
  _id: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  userType: 'student' | 'workingprofessional';
  email: string;
};

export const columns: ColumnDef<Contest>[] = [
  {
    accessorKey: '_id',
    header: 'ID',
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
  },
  {
    accessorKey:'email',
    header:"Email"
  },
  {
    accessorKey: 'submissionStatus',
    header: 'Submission Status',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'questionId',
    header: 'Question Id',
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
