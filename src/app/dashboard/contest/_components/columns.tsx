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
    accessorKey: 'firstname',
    header: 'Firstname',
  },
  {
    accessorKey: 'lastname',
    header: 'Lastname',
  },
  {
    accessorKey: 'phonenumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'userType',
    header: ({ column }) => {
      return (
        <>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </>
      );
    },
  },
];
