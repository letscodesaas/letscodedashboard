'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/app/_trpc/client';

export type Question = {
  _id: string;
  title: string;
  contentType: string;
};

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'contentType',
    header: 'Content Type',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                window.location.replace(
                  `/dashboard/questions/questions/${payment._id}/view`
                )
              }
            >
              View Question
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await trpc.question.deletequestion.mutate({
                  id: payment._id,
                });
                window.location.reload();
              }}
            >
              Delete Question
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.location.replace(
                  `/dashboard/questions/questions/${payment._id}/update`
                );
              }}
            >
              Update Question
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
