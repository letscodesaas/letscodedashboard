'use client';
import React, { useState, useEffect } from 'react';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { trpc } from '@/app/_trpc/client';

function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      setLoading(true);
      const info = await trpc.contest.getregisations.query();
      setData(info);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="mb-4">
        <div>Total Regisation : {data.length}</div>
      </div>
      {loading ? 'Loading..' : <DataTable columns={columns} data={data} />}
    </div>
  );
}

export default Page;
