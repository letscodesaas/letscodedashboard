'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { trpc } from '@/app/_trpc/client';

function Page() {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async function fetchData() {
      try {
        const response = await trpc.question.getquestions.query();
        setData(response.data);
      } catch (error) {
        setData([]);
      }
    })();
  }, []);

  

  return (
    <div>
      <div className="flex flex-row items-center justify-end gap-2">
        <Link href={'/dashboard/questions/question'}>
          <Button>Add Questions</Button>
        </Link>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Page;
