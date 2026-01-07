import React from 'react';
import { columns, Contest } from './_components/columns';
import { DataTable } from './_components/data-table';
import { trpc } from '@/app/_trpc/client';

async function getData(): Promise<Contest[]> {
  const info = await trpc.contest.getregisations.query();
  return info;
}

async function Page() {
  const data = await getData();
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Page;
